import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from '../_lib/supabase';
import { z } from 'zod';

// Admin emails - TODO: Move to environment variable or database
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

async function isAdmin(authHeader: string): Promise<boolean> {
    const supabaseUser = createUserClient(authHeader);
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

    if (!(await isAdmin(authHeader))) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const supabase = createServerClient();
    const { id } = req.query;

    try {
        // GET - List all events with DJs
        if (req.method === 'GET') {
            const { data: events, error } = await supabase
                .from('events')
                .select('*, event_djs (*)')
                .order('event_date', { ascending: false });

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(events || []);
        }

        // POST - Create event
        if (req.method === 'POST') {
            const parseResult = EventSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
            }

            const { data: event, error } = await supabase
                .from('events')
                .insert(parseResult.data)
                .select()
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json(event);
        }

        // PUT - Update event
        if (req.method === 'PUT' && id) {
            const parseResult = EventSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
            }

            const { data: event, error } = await supabase
                .from('events')
                .update(parseResult.data)
                .eq('id', parseInt(id as string))
                .select()
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(event);
        }

        // DELETE - Delete event
        if (req.method === 'DELETE' && id) {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', parseInt(id as string));

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
