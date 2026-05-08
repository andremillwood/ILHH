import type { VercelRequest, VercelResponse } from '@vercel/node';



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

    try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

        // If slug provided, get single article
        if (slug && typeof slug === 'string') {
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
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(article);
        }

        // Get all articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(10);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(articles || []);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
