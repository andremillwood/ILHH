import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient } from './_lib/supabase.js';

const fallbackPolicies: Record<string, { title: string; body: string }> = {
    terms: {
        title: 'Terms of Service',
        body: 'Purchases, RSVPs, memberships, and submissions are subject to review, availability, payment verification, fulfillment partner requirements, and applicable law. Do not submit false, abusive, infringing, or fraudulent information.',
    },
    privacy: {
        title: 'Privacy Policy',
        body: 'We collect information you submit for memberships, RSVPs, event submissions, orders, payments, fulfillment, support, fraud prevention, and site operations. Payment data is processed by Stripe. Merch fulfillment data is shared with Printful as needed to produce and ship orders.',
    },
    refunds: {
        title: 'Refund Policy',
        body: 'Merch is made to order. Contact support promptly if an item arrives damaged, misprinted, or incorrect. Refunds, replacements, and cancellations are reviewed case by case before fulfillment begins and may be limited once production has started.',
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const resource = String(req.query.resource || '');

    if (resource === 'order-status') {
        const publicId = String(req.query.id || '');
        if (!publicId) return res.status(400).json({ error: 'Order ID is required' });

        try {
            const supabase = createServerClient();
            const { data: order, error } = await supabase
                .from('merch_orders')
                .select('public_id, customer_email, customer_name, total_cents, currency, status_v2, fulfillment_status, tracking_number, tracking_url, carrier, created_at, paid_at, submitted_to_printful_at, shipped_at, delivered_at, merch_order_items(product_name, color, size, quantity)')
                .eq('public_id', publicId)
                .single();

            if (error) return res.status(404).json({ error: 'Order not found' });
            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (resource === 'policies') {
        const slug = String(req.query.slug || '');
        try {
            const supabase = createServerClient();
            let query = supabase.from('site_policies').select('slug, title, body, updated_at').eq('is_published', true);
            if (slug) query = query.eq('slug', slug);

            const { data, error } = await query.order('slug');
            if (error) throw error;
            return res.status(200).json(slug ? data?.[0] || fallbackPolicies[slug] : data);
        } catch {
            if (slug) return res.status(200).json({ slug, ...fallbackPolicies[slug] });
            return res.status(200).json(Object.entries(fallbackPolicies).map(([policySlug, policy]) => ({ slug: policySlug, ...policy })));
        }
    }

    return res.status(404).json({ error: 'Resource not found' });
}
