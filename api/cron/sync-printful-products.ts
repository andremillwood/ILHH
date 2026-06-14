import type { VercelRequest, VercelResponse } from '@vercel/node';
import { syncPrintfulProducts } from '../_lib/printful-sync.js';
import { syncPrintfulOrderStatus, logOrderEvent } from '../_lib/orders.js';
import { createServerClient } from '../_lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createServerClient();
        const catalog = await syncPrintfulProducts(supabase);
        const { data: orders, error } = await supabase
            .from('merch_orders')
            .select('*, merch_order_items(*)')
            .not('printful_order_id', 'is', null)
            .in('status_v2', ['submitted_to_printful', 'in_fulfillment', 'shipped'])
            .order('updated_at', { ascending: true })
            .limit(25);

        if (error) throw error;

        const orderResults = [];
        for (const order of orders || []) {
            try {
                const updated = await syncPrintfulOrderStatus(supabase, order);
                orderResults.push({ id: order.id, status: updated.status_v2, ok: true });
            } catch (error) {
                await logOrderEvent(supabase, order.id, 'printful_poll_failed', error instanceof Error ? error.message : 'Printful poll failed', 'error');
                orderResults.push({ id: order.id, ok: false, error: error instanceof Error ? error.message : 'Printful poll failed' });
            }
        }

        return res.status(200).json({ success: true, catalog, orders: orderResults });
    } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Printful sync failed' });
    }
}
