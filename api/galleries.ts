import type { VercelRequest, VercelResponse } from '@vercel/node';


const baseGallerySelect = '*, events(id, title, event_date, venue_name)';
const gallerySelectWithImages = `${baseGallerySelect}, event_gallery_images(*)`;

async function fetchGalleries(supabase: any, eventId?: number, includeImages = true) {
    let query = supabase
        .from('galleries')
        .select(includeImages ? gallerySelectWithImages : baseGallerySelect)
        .or('status.is.null,status.eq.published')
        .order('created_at', { ascending: false });

    if (eventId) {
        query = query.eq('event_id', eventId);
    }

    return query;
}


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
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

        const eventId = req.query.event_id ? Number(req.query.event_id) : undefined;
        let { data: galleries, error } = await fetchGalleries(supabase, eventId);

        if (error && /event_gallery_images|relationship|schema cache/i.test(error.message || '')) {
            console.warn('Gallery image relationship unavailable, falling back to gallery records:', error.message);
            const fallback = await fetchGalleries(supabase, eventId, false);
            galleries = fallback.data?.map((gallery: any) => ({ ...gallery, event_gallery_images: [] })) || [];
            error = fallback.error;
        }

        if (error) {
            console.error('Error fetching galleries:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(galleries || []);
    } catch (error: any) {
        console.error('Error in galleries handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
