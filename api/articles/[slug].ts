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

    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Article slug is required' });
    }

    try {
        const supabase = createUserClient();

        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Article not found' });
            }
            console.error('Error fetching article:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(article);
    } catch (error: any) {
        console.error('Error in article handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
