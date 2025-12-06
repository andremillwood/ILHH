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

        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching articles:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(articles || []);
    } catch (error: any) {
        console.error('Error in articles handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
