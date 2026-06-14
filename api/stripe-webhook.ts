import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createServerClient } from './_lib/supabase.js';
import { adminEmails, emailSenders, sendBrandedEmail } from './_lib/email.js';
import { logOrderEvent, markOrderCancelled, markOrderPaid, submitOrderToPrintful } from './_lib/orders.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function readRawBody(req: VercelRequest) {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBody: Buffer, signatureHeader: string, secret: string) {
    const parts = signatureHeader.split(',').reduce<Record<string, string[]>>((acc, item) => {
        const [key, value] = item.split('=');
        if (!key || !value) return acc;
        acc[key] = [...(acc[key] || []), value];
        return acc;
    }, {});

    const timestamp = parts.t?.[0];
    const signatures = parts.v1 || [];
    if (!timestamp || signatures.length === 0) return false;

    const payload = `${timestamp}.${rawBody.toString('utf8')}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return signatures.some((signature) => {
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        return a.length === b.length && crypto.timingSafeEqual(a, b);
    });
}

async function fetchStripeSession(sessionId: string) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

    const params = new URLSearchParams({
        expand: 'line_items.data.price.product',
    });
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${stripeSecretKey}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Could not fetch Stripe session');
    return data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return res.status(503).json({ error: 'Stripe webhook is not configured.' });
    }

    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') {
        return res.status(400).json({ error: 'Missing Stripe signature.' });
    }

    const rawBody = await readRawBody(req);
    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
        return res.status(400).json({ error: 'Invalid Stripe signature.' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const supabase = createServerClient();

    try {
        if (event.type === 'checkout.session.completed') {
            const session = await fetchStripeSession(event.data.object.id);
            const order = await markOrderPaid(supabase, session);
            await trackAnalyticsEvent(supabase, req, {
                eventName: 'checkout_completed',
                email: order.customer_email,
                properties: { orderId: order.id, publicId: order.public_id, totalCents: order.total_cents, stripeSessionId: session.id },
            });
            await submitOrderToPrintful(supabase, order);
        }

        if (event.type === 'checkout.session.expired') {
            await markOrderCancelled(supabase, event.data.object.id, 'Stripe checkout session expired.');
            await trackAnalyticsEvent(supabase, req, {
                eventName: 'checkout_expired',
                properties: { stripeSessionId: event.data.object.id },
            });
        }

        if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const { data: order } = await supabase
                .from('merch_orders')
                .update({
                    status: 'failed',
                    status_v2: 'failed',
                    failed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('stripe_payment_intent_id', paymentIntent.id)
                .select('id, public_id, customer_email')
                .maybeSingle();

            await logOrderEvent(supabase, order?.id || null, 'payment_failed', paymentIntent.last_payment_error?.message || 'Stripe payment failed.', 'error', paymentIntent);
            await sendBrandedEmail({
                to: adminEmails,
                subject: 'Stripe payment failed | ILHH',
                preview: 'A Stripe payment failed and may need review.',
                from: emailSenders.ops,
                eyebrow: 'Payment Alert',
                title: 'Payment failed',
                intro: 'Stripe reported a failed payment for a merch checkout.',
                sections: [{ title: 'Payment', rows: [['Payment intent', paymentIntent.id], ['Order', order?.public_id], ['Error', paymentIntent.last_payment_error?.message]] }],
            });
        }

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Stripe webhook failed:', error);
        await logOrderEvent(supabase, null, 'stripe_webhook_failed', error.message, 'error', { eventId: event.id, type: event.type });
        await sendBrandedEmail({
            to: adminEmails,
            subject: 'Stripe webhook failed | ILHH',
            preview: error.message,
            from: emailSenders.ops,
            eyebrow: 'Ops Alert',
            title: 'Webhook failed',
            intro: 'A Stripe webhook could not complete. Review the order lifecycle before retrying.',
            sections: [{ title: 'Failure', rows: [['Event', event.type], ['Message', error.message]] }],
        });
        return res.status(500).json({ error: error.message });
    }
}
