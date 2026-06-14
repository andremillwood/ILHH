import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { normalizeCheckoutItemsWithCatalog, type CheckoutItem } from './_lib/merch.js';
import { createServerClient } from './_lib/supabase.js';
import { createPendingOrder } from './_lib/orders.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';

const CheckoutSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        name: z.string().min(1),
        price: z.number(),
        color: z.string().min(1),
        size: z.string().min(1),
        quantity: z.number(),
    })).min(1),
    affiliateCode: z.string().max(64).nullable().optional(),
});

function getBaseUrl(req: VercelRequest) {
    const configuredUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (configuredUrl) {
        return configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`;
    }

    const proto = req.headers['x-forwarded-proto'] || 'http';
    return `${proto}://${req.headers.host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        return res.status(503).json({
            error: 'Stripe checkout is not configured. Add STRIPE_SECRET_KEY to enable payments.',
        });
    }

    const parseResult = CheckoutSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid checkout data', details: parseResult.error.issues });
    }

    try {
        const baseUrl = getBaseUrl(req);
        const supabase = createServerClient();
        const checkoutItems: CheckoutItem[] = parseResult.data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            price: item.price,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
        }));
        const items = await normalizeCheckoutItemsWithCatalog(checkoutItems, supabase);
        const params = new URLSearchParams({
            mode: 'payment',
            success_url: `${baseUrl}/merch?checkout=success`,
            cancel_url: `${baseUrl}/merch?checkout=cancelled`,
            'metadata[affiliate_code]': parseResult.data.affiliateCode || '',
            'metadata[source]': 'this-is-hip-hop-caribbean-merch',
        });

        items.forEach((item, index) => {
            params.append(`line_items[${index}][price_data][currency]`, process.env.STRIPE_CURRENCY || 'usd');
            params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            params.append(`line_items[${index}][price_data][product_data][metadata][product_id]`, item.productId);
            params.append(`line_items[${index}][price_data][product_data][metadata][variant_id]`, item.variantId);
            params.append(`line_items[${index}][price_data][product_data][metadata][printful_variant_id]`, String(item.printfulVariantId));
            params.append(`line_items[${index}][price_data][product_data][metadata][color]`, item.color);
            params.append(`line_items[${index}][price_data][product_data][metadata][size]`, item.size);
            params.append(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
            params.append(`line_items[${index}][quantity]`, String(item.quantity));
        });

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Stripe checkout failed' });
        }

        await createPendingOrder(supabase, {
            stripeSessionId: data.id,
            affiliateCode: parseResult.data.affiliateCode,
            currency: process.env.STRIPE_CURRENCY || 'usd',
            items,
        });
        await trackAnalyticsEvent(supabase, req, {
            eventName: 'checkout_started',
            properties: {
                stripeSessionId: data.id,
                affiliateCode: parseResult.data.affiliateCode || null,
                items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
                totalCents: items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0),
            },
        });

        return res.status(200).json({ id: data.id, url: data.url });
    } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Checkout failed' });
    }
}
