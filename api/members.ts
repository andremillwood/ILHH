import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from './_lib/supabase';
import { z } from 'zod';

const MemberSchema = z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    instagram_handle: z.string().optional(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    favorite_songs: z.string().optional(),
    favorite_albums: z.string().optional(),
    favorite_lyrics: z.string().optional(),
    favorite_djs: z.string().optional(),
    favorite_genre: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action } = req.query;
    const authHeader = req.headers.authorization;

    // GET /api/members?action=community - public community list
    if (req.method === 'GET' && action === 'community') {
        try {
            const supabase = createUserClient();
            const { data: members, error } = await supabase
                .from('members')
                .select('id, first_name, last_name, instagram_handle, location, bio, favorite_songs, favorite_albums, favorite_djs, avatar_url, created_at')
                .not('first_name', 'is', null)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(members || []);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // All other operations require auth
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    try {
        const supabaseUser = createUserClient(authHeader);
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const supabase = createServerClient();

        // GET /api/members?action=me - get current user's profile
        if (req.method === 'GET' && action === 'me') {
            const { data: member, error } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json(member || null);
        }

        // PUT /api/members?action=me - update current user's profile
        if (req.method === 'PUT' && action === 'me') {
            const parseResult = MemberSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid request data', details: parseResult.error.issues });
            }

            const data = parseResult.data;
            await supabase
                .from('members')
                .update({
                    email: data.email,
                    phone: data.phone || null,
                    instagram_handle: data.instagram_handle || null,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    favorite_songs: data.favorite_songs || null,
                    favorite_albums: data.favorite_albums || null,
                    favorite_lyrics: data.favorite_lyrics || null,
                    favorite_djs: data.favorite_djs || null,
                    favorite_genre: data.favorite_genre || null,
                    bio: data.bio || null,
                    location: data.location || null,
                })
                .eq('user_id', user.id);

            const { data: member } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            return res.status(200).json({ success: true, member });
        }

        // POST /api/members - create new member
        if (req.method === 'POST') {
            const parseResult = MemberSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid request data', details: parseResult.error.issues });
            }

            const data = parseResult.data;

            // Check if member already exists
            const { data: existing } = await supabase
                .from('members')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existing) {
                return res.status(400).json({ error: 'Membership already exists' });
            }

            const { data: member, error } = await supabase
                .from('members')
                .insert({
                    user_id: user.id,
                    email: data.email,
                    phone: data.phone || null,
                    instagram_handle: data.instagram_handle || null,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    favorite_songs: data.favorite_songs || null,
                    favorite_albums: data.favorite_albums || null,
                    favorite_lyrics: data.favorite_lyrics || null,
                    favorite_djs: data.favorite_djs || null,
                    favorite_genre: data.favorite_genre || null,
                    bio: data.bio || null,
                    location: data.location || null,
                })
                .select('id')
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json({ success: true, id: member.id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
