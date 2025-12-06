import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createUserClient, createServerClient } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        const supabase = createUserClient();

        // If ID provided, get single event
        if (id && typeof id === 'string') {
            const { data: event, error } = await supabase
                .from('events')
                .select(`*, event_djs (id, dj_name, dj_description, is_resident)`)
                .eq('id', parseInt(id))
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Event not found' });
                }
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ ...event, djs: event.event_djs || [] });
        }

        // Get all events
        const { data: events, error } = await supabase
            .from('events')
            .select(`*, event_djs (id, dj_name, dj_description, is_resident)`)
            .order('event_date', { ascending: true });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const transformedEvents = events?.map(event => ({
            ...event,
            djs: event.event_djs || [],
        }));

        return res.status(200).json(transformedEvents || []);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
