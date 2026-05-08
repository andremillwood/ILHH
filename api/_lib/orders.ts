import type { SupabaseClient } from '@supabase/supabase-js';
import { adminEmails, emailSenders, sendBrandedEmail, siteUrl } from './email.js';

type NormalizedOrderItem = {
    productId: string;
    variantId: string;
    printfulVariantId: number;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
};

type CheckoutOrderInput = {
    stripeSessionId: string;
    affiliateCode?: string | null;
    currency: string;
    items: NormalizedOrderItem[];
};

type StripeSession = {
    id: string;
    payment_intent?: string;
    customer_email?: string;
    customer_details?: {
        email?: string;
        name?: string;
        phone?: string;
        address?: Record<string, string | null>;
    };
    amount_total?: number;
    amount_subtotal?: number;
    total_details?: {
        amount_shipping?: number;
        amount_tax?: number;
    };
    currency?: string;
    shipping_details?: {
        name?: string;
        address?: Record<string, string | null>;
    };
    metadata?: Record<string, string>;
};

export async function logOrderEvent(
    supabase: SupabaseClient,
    orderId: number | null,
    eventType: string,
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    metadata?: Record<string, unknown>,
) {
    const { error } = await supabase.from('order_events').insert({
        order_id: orderId,
        level,
        event_type: eventType,
        message,
        metadata: metadata || null,
    });

    if (error) console.error('Order event log failed:', error);
}

export async function createPendingOrder(supabase: SupabaseClient, input: CheckoutOrderInput) {
    const subtotalCents = input.items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0);

    const { data: existing } = await supabase
        .from('merch_orders')
        .select('id, public_id')
        .eq('stripe_session_id', input.stripeSessionId)
        .maybeSingle();

    if (existing) return existing;

    const { data: order, error } = await supabase
        .from('merch_orders')
        .insert({
            stripe_session_id: input.stripeSessionId,
            affiliate_code: input.affiliateCode || null,
            subtotal_cents: subtotalCents,
            total_cents: subtotalCents,
            currency: input.currency,
            status: 'pending_payment',
            status_v2: 'pending_payment',
            fulfillment_status: 'not_submitted',
            raw_order: { source: 'checkout_create' },
        })
        .select('id, public_id')
        .single();

    if (error) throw error;

    const { error: itemError } = await supabase.from('merch_order_items').insert(input.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unit_amount_cents: Math.round(item.price * 100),
        printful_variant_id: item.printfulVariantId,
    })));

    if (itemError) throw itemError;
    await logOrderEvent(supabase, order.id, 'checkout_created', 'Stripe checkout session created.');
    return order;
}

export async function markOrderPaid(supabase: SupabaseClient, session: StripeSession) {
    const customerEmail = session.customer_details?.email || session.customer_email || null;
    const { data: order, error } = await supabase
        .from('merch_orders')
        .update({
            status: 'paid',
            status_v2: 'paid',
            stripe_payment_intent_id: session.payment_intent || null,
            customer_email: customerEmail,
            customer_name: session.customer_details?.name || session.shipping_details?.name || null,
            customer_phone: session.customer_details?.phone || null,
            shipping_name: session.shipping_details?.name || session.customer_details?.name || null,
            shipping_address: session.shipping_details?.address || session.customer_details?.address || null,
            subtotal_cents: session.amount_subtotal || 0,
            shipping_cents: session.total_details?.amount_shipping || 0,
            tax_cents: session.total_details?.amount_tax || 0,
            total_cents: session.amount_total || 0,
            currency: session.currency || 'usd',
            raw_order: session,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id)
        .select('*, merch_order_items (*)')
        .single();

    if (error) throw error;
    await logOrderEvent(supabase, order.id, 'payment_succeeded', 'Stripe payment confirmed.');
    return order;
}

export async function submitOrderToPrintful(supabase: SupabaseClient, order: any) {
    const printfulApiKey = process.env.PRINTFUL_API_KEY;
    if (!printfulApiKey) throw new Error('PRINTFUL_API_KEY is not configured');
    if (!order.shipping_address) throw new Error('Missing shipping address for Printful fulfillment');

    const address = order.shipping_address;
    const body = {
        external_id: String(order.public_id || order.id),
        recipient: {
            name: order.shipping_name || order.customer_name || 'ILHH Customer',
            address1: address.line1,
            address2: address.line2 || undefined,
            city: address.city,
            state_code: address.state || undefined,
            country_code: address.country,
            zip: address.postal_code,
            email: order.customer_email,
            phone: order.customer_phone || undefined,
        },
        items: (order.merch_order_items || []).map((item: any) => ({
            sync_variant_id: item.printful_variant_id,
            quantity: item.quantity,
            name: item.product_name,
            retail_price: (item.unit_amount_cents / 100).toFixed(2),
        })),
    };

    const response = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${printfulApiKey}`,
            'Content-Type': 'application/json',
            ...(process.env.PRINTFUL_STORE_ID ? { 'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID } : {}),
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
        await supabase.from('merch_orders').update({
            status: 'failed',
            status_v2: 'failed',
            fulfillment_status: 'failed',
            failed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).eq('id', order.id);
        await logOrderEvent(supabase, order.id, 'printful_failed', data.error?.message || 'Printful order failed.', 'error', data);
        await sendBrandedEmail({
            to: adminEmails,
            subject: `Printful fulfillment failed: ${order.public_id}`,
            preview: 'A paid merch order failed Printful submission.',
            from: emailSenders.ops,
            eyebrow: 'Fulfillment Alert',
            title: 'Printful submission failed',
            intro: 'A paid order needs manual attention before it can be fulfilled.',
            sections: [{ title: 'Order', rows: [['Order', order.public_id], ['Customer', order.customer_email], ['Error', data.error?.message || 'Unknown Printful error']] }],
        });
        throw new Error(data.error?.message || 'Printful order failed');
    }

    const { data: updated, error } = await supabase
        .from('merch_orders')
        .update({
            status: 'submitted_to_printful',
            status_v2: 'submitted_to_printful',
            fulfillment_status: data.result?.status || 'submitted',
            printful_order_id: data.result?.id ? String(data.result.id) : null,
            submitted_to_printful_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
        .select('*, merch_order_items (*)')
        .single();

    if (error) throw error;
    await logOrderEvent(supabase, order.id, 'printful_submitted', 'Order submitted to Printful.', 'info', data.result);

    if (updated.customer_email) {
        await sendBrandedEmail({
            to: updated.customer_email,
            subject: 'Order confirmed | I Love Hip Hop JA',
            preview: 'Your merch order is confirmed and moving to fulfillment.',
            from: emailSenders.orders,
            eyebrow: 'Order Confirmed',
            title: 'Order in motion',
            intro: 'Your payment was confirmed and your merch order has been sent to fulfillment. We will follow up when shipping details are available.',
            sections: [
                { title: 'Order', rows: [['Order', updated.public_id], ['Total', `${updated.currency?.toUpperCase() || 'USD'} ${(updated.total_cents / 100).toFixed(2)}`], ['Status', 'Submitted to Printful']] },
            ],
            action: { label: 'View Order Status', url: siteUrl(`/order/${updated.public_id}`) },
        });
    }

    return updated;
}

export async function markOrderCancelled(supabase: SupabaseClient, stripeSessionId: string, reason = 'Checkout expired or cancelled.') {
    const { data: order, error } = await supabase
        .from('merch_orders')
        .update({
            status: 'cancelled',
            status_v2: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', stripeSessionId)
        .select('id')
        .maybeSingle();

    if (error) throw error;
    if (order) await logOrderEvent(supabase, order.id, 'order_cancelled', reason, 'warning');
}
