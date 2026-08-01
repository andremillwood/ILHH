import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createR2Upload } from './_lib/r2.js';

const ADMIN_EMAILS = ['andremillwood@gmail.com', 'frankgriz@gmail.com', 'admin@ilovehiphopja.com'];

const MixtapeCreateSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    dj_name: z.string().min(1),
    cover_art_url: z.string().optional(),
    audio_url: z.string().url(),
    download_url: z.string().url().optional(),
    description: z.string().optional(),
    release_date: z.string().optional(),
    duration_seconds: z.number().optional(),
    genre: z.string().optional(),
    tags: z.string().optional(),
    is_downloadable: z.boolean().optional(),
});

const UploadSchema = z.object({
    filename: z.string().min(1).max(240),
    contentType: z.string().min(1).max(120),
    size: z.number().int().positive(),
    purpose: z.enum(['mix', 'artwork', 'gallery']),
    galleryId: z.number().int().positive().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        const { createClient } = await import('@supabase/supabase-js');
        const authHeader = req.headers.authorization;
        const supabase = createClient(supabaseUrl!, supabaseAnonKey!, authHeader ? {
            global: { headers: { Authorization: authHeader } },
            auth: { persistSession: false },
        } : undefined);

        if (req.method === 'POST' && req.query.action === 'sign-upload') {
            if (!authHeader) return res.status(401).json({ error: 'Authorization required' });
            const parsed = UploadSchema.safeParse(req.body);
            if (!parsed.success) return res.status(400).json({ error: 'Invalid upload request', details: parsed.error.issues });
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
            if (parsed.data.purpose === 'gallery' && (!user.email || !ADMIN_EMAILS.includes(user.email))) {
                return res.status(403).json({ error: 'Admin access required for gallery uploads' });
            }
            try {
                return res.status(200).json(await createR2Upload({
                    filename: parsed.data.filename,
                    contentType: parsed.data.contentType,
                    size: parsed.data.size,
                    purpose: parsed.data.purpose,
                    galleryId: parsed.data.galleryId,
                    userId: user.id,
                }));
            } catch (uploadError) {
                return res.status(400).json({ error: uploadError instanceof Error ? uploadError.message : 'Could not prepare upload' });
            }
        }

        if (req.method === 'GET') {
            const { id, slug } = req.query;

            if (id || slug) {
                const query = supabase.from('mixtapes').select('*');
                const { data: mixtape, error } = id
                    ? await query.eq('id', Number(id)).single()
                    : await query.eq('slug', slug as string).single();
                if (error) return res.status(404).json({ error: 'Mix not found' });
                return res.status(200).json(mixtape);
            }

            const { data: mixtapes, error } = await supabase
                .from('mixtapes')
                .select('*')
                .in('status', ['published', 'pending'])
                .order('release_date', { ascending: false })
                .limit(50);

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(mixtapes || []);
        }

        if (req.method === 'POST') {
            if (!authHeader) return res.status(401).json({ error: 'Authorization required' });
            const parseResult = MixtapeCreateSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid mix data', details: parseResult.error.issues });
            }

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) return res.status(401).json({ error: 'Unauthorized' });

            const { data: mixtape, error } = await supabase
                .from('mixtapes')
                .insert({
                    ...parseResult.data,
                    uploaded_by: user.id,
                    release_date: parseResult.data.release_date || new Date().toISOString().slice(0, 10),
                    download_url: parseResult.data.download_url || parseResult.data.audio_url,
                    status: 'pending',
                })
                .select('*')
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json(mixtape);
        }

        if (req.method === 'PATCH') {
            const { id, action } = req.query;
            if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Mix id required' });
            if (!['play', 'download'].includes(String(action))) return res.status(400).json({ error: 'Invalid action' });

            const column = action === 'play' ? 'play_count' : 'download_count';
            const { data: current, error: currentError } = await supabase
                .from('mixtapes')
                .select(column)
                .eq('id', Number(id))
                .single();
            if (currentError) return res.status(404).json({ error: 'Mix not found' });

            const { data: updated, error } = await supabase
                .from('mixtapes')
                .update({ [column]: Number(current?.[column] || 0) + 1 })
                .eq('id', Number(id))
                .select('*')
                .single();
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(updated);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        console.error('Error in mixtapes handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
