import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';

const ADMIN_EMAILS = ['andremillwood@gmail.com', 'admin@ilovehiphopja.com'];

const EventSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    event_date: z.string(),
    event_time: z.string().optional(),
    venue_name: z.string().optional(),
    venue_address: z.string().optional(),
    theme: z.string().optional(),
    sub_theme: z.string().optional(),
    flyer_url: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_special: z.boolean().optional(),
});

const ArticleSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    featured_image_url: z.string().optional(),
    tags: z.string().optional(),
    is_published: z.boolean().optional(),
});

const MixtapeSchema = z.object({
    title: z.string().min(1),
    dj_name: z.string().min(1),
    cover_art_url: z.string().optional(),
    embed_url: z.string().optional(),
    description: z.string().optional(),
    release_date: z.string().optional(),
});

// Helper to get keys (Safe inline)
const getKeys = () => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) throw new Error('Missing Supabase keys');
    return { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
};

async function isAdmin(authHeader: string): Promise<boolean> {
    const { supabaseUrl, supabaseAnonKey } = getKeys();
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    return user?.email ? ADMIN_EMAILS.includes(user.email) : false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    try {
        if (!(await isAdmin(authHeader))) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { supabaseUrl, supabaseServiceKey } = getKeys();
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false }
        });

        const { resource, id } = req.query;

        try {
            // --- Stats (Default) ---
            if (!resource || resource === 'stats') {
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

                const [eventsResult, membersResult, rsvpsResult] = await Promise.all([
                    supabase.from('events').select('id', { count: 'exact', head: true }),
                    supabase.from('members').select('id', { count: 'exact', head: true }),
                    supabase.from('rsvps').select('id', { count: 'exact', head: true }),
                ]);
                const [ordersResult, failedOrdersResult, eventSubmissionsResult] = await Promise.all([
                    supabase.from('merch_orders').select('id', { count: 'exact', head: true }),
                    supabase.from('merch_orders').select('id', { count: 'exact', head: true }).eq('status_v2', 'failed'),
                    supabase.from('event_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                ]);

                return res.status(200).json({
                    totalEvents: eventsResult.count || 0,
                    totalMembers: membersResult.count || 0,
                    totalRsvps: rsvpsResult.count || 0,
                    totalOrders: ordersResult.count || 0,
                    failedOrders: failedOrdersResult.count || 0,
                    pendingEventSubmissions: eventSubmissionsResult.count || 0,
                });
            }

            if (resource === 'orders') {
                if (req.method === 'GET') {
                    const { data: orders, error } = await supabase
                        .from('merch_orders')
                        .select('*, merch_order_items(*), order_events(*)')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(orders || []);
                }

                if (req.method === 'POST' && id && req.query.action === 'resend') {
                    const { data: order, error } = await supabase
                        .from('merch_orders')
                        .select('*, merch_order_items(*)')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (error) throw error;
                    if (!order.customer_email) return res.status(400).json({ error: 'Order has no customer email' });

                    await sendBrandedEmail({
                        to: order.customer_email,
                        subject: 'Your ILHH order status',
                        preview: 'Here is the latest status for your merch order.',
                        from: emailSenders.orders,
                        eyebrow: 'Order Update',
                        title: 'Latest order status',
                        intro: 'Here is the current status for your ILHH merch order.',
                        sections: [
                            { title: 'Order', rows: [['Order', order.public_id], ['Payment status', order.status_v2], ['Fulfillment status', order.fulfillment_status], ['Tracking', order.tracking_url || order.tracking_number]] },
                        ],
                        action: { label: 'View Order Status', url: siteUrl(`/order/${order.public_id}`) },
                    });

                    await supabase.from('order_events').insert({
                        order_id: order.id,
                        event_type: 'manual_email_resend',
                        message: 'Admin resent order status email.',
                    });

                    return res.status(200).json({ success: true });
                }
            }

            if (resource === 'rsvps') {
                if (req.method === 'GET') {
                    const { data: rsvps, error } = await supabase
                        .from('rsvps')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(rsvps || []);
                }
            }

            if (resource === 'event_submissions') {
                if (req.method === 'GET') {
                    const { data: submissions, error } = await supabase
                        .from('event_submissions')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(submissions || []);
                }
            }

            // --- Events ---
            if (resource === 'events') {
                if (req.method === 'GET') {
                    const { data: events, error } = await supabase
                        .from('events')
                        .select('*, event_djs (*)')
                        .order('event_date', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(events || []);
                }
                if (req.method === 'POST') {
                    const parseResult = EventSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: event, error } = await supabase.from('events').insert(parseResult.data).select().single();
                    if (error) throw error;
                    return res.status(201).json(event);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = EventSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: event, error } = await supabase.from('events').update(parseResult.data).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    return res.status(200).json(event);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('events').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            // --- Articles ---
            if (resource === 'articles') {
                if (req.method === 'GET') {
                    const { data: articles, error } = await supabase
                        .from('articles')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(articles || []);
                }
                if (req.method === 'POST') {
                    const parseResult = ArticleSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const data = { ...parseResult.data, published_at: parseResult.data.is_published ? new Date().toISOString() : null };
                    const { data: article, error } = await supabase.from('articles').insert(data).select().single();
                    if (error) throw error;
                    return res.status(201).json(article);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = ArticleSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const data = { ...parseResult.data, published_at: parseResult.data.is_published ? new Date().toISOString() : null };
                    const { data: article, error } = await supabase.from('articles').update(data).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    return res.status(200).json(article);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('articles').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            // --- Mixtapes ---
            if (resource === 'mixtapes') {
                if (req.method === 'GET') {
                    const { data: mixtapes, error } = await supabase
                        .from('mixtapes')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(mixtapes || []);
                }
                if (req.method === 'POST') {
                    const parseResult = MixtapeSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: mixtape, error } = await supabase.from('mixtapes').insert(parseResult.data).select().single();
                    if (error) throw error;
                    return res.status(201).json(mixtape);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = MixtapeSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: mixtape, error } = await supabase.from('mixtapes').update(parseResult.data).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    return res.status(200).json(mixtape);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('mixtapes').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            return res.status(404).json({ error: 'Resource not found' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
