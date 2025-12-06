import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createUserClient } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createUserClient();

        const { data: events, error } = await supabase
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
            .order('event_date', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
            return res.status(500).json({ error: error.message });
        }

        // Transform to match expected format (rename event_djs to djs)
        const transformedEvents = events?.map(event => ({
            ...event,
            djs: event.event_djs || [],
            event_djs: undefined
        }));

        return res.status(200).json(transformedEvents || []);
    } catch (error: any) {
        console.error('Error in events handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
