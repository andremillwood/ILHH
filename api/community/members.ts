import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createUserClient } from './_lib/supabase';

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

    try {
        const supabase = createUserClient();

        const { data: members, error } = await supabase
            .from('members')
            .select(`
        id,
        first_name,
        last_name,
        instagram_handle,
        location,
        bio,
        favorite_songs,
        favorite_albums,
        favorite_lyrics,
        favorite_djs,
        avatar_url,
        created_at
      `)
            .not('first_name', 'is', null)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching community members:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(members || []);
    } catch (error: any) {
        console.error('Error in community members handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
