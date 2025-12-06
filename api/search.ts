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

    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = `%${q.trim().toLowerCase()}%`;

    try {
        const supabase = createUserClient();

        // Search across events, articles, and mixtapes
        const [eventsResult, articlesResult, mixtapesResult] = await Promise.all([
            supabase
                .from('events')
                .select('id, title, theme, sub_theme, event_date, venue_name')
                .or(`title.ilike.${searchTerm},theme.ilike.${searchTerm},sub_theme.ilike.${searchTerm},venue_name.ilike.${searchTerm}`)
                .limit(10),
            supabase
                .from('articles')
                .select('id, title, slug, excerpt')
                .eq('is_published', true)
                .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
                .limit(10),
            supabase
                .from('mixtapes')
                .select('id, title, dj_name, description')
                .or(`title.ilike.${searchTerm},dj_name.ilike.${searchTerm},description.ilike.${searchTerm}`)
                .limit(10),
        ]);

        return res.status(200).json({
            events: eventsResult.data || [],
            articles: articlesResult.data || [],
            mixtapes: mixtapesResult.data || [],
            query: q,
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
