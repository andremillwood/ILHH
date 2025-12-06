import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createUserClient } from '../_lib/supabase';

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

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Event ID is required' });
    }

    try {
        const supabase = createUserClient();

        const { data: event, error } = await supabase
            .from('events')
            .select(`
        *,
        event_djs (
          id,
          dj_name,
          dj_description,
          is_resident
        )
      `)
            .eq('id', parseInt(id))
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Event not found' });
            }
            console.error('Error fetching event:', error);
            return res.status(500).json({ error: error.message });
        }

        // Transform to match expected format
        const transformedEvent = {
            ...event,
            djs: event.event_djs || [],
            event_djs: undefined
        };

        return res.status(200).json(transformedEvent);
    } catch (error: any) {
        console.error('Error in event handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
