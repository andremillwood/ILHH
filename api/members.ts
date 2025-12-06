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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    try {
        // Get user from token
        const supabaseUser = createUserClient(authHeader);
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate request body
        const parseResult = MemberSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid request data',
                details: parseResult.error.issues
            });
        }

        const data = parseResult.data;
        const supabase = createServerClient();

        // Check if member already exists
        const { data: existing } = await supabase
            .from('members')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Membership already exists' });
        }

        // Create member
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

        if (error) {
            console.error('Error creating member:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ success: true, id: member.id });
    } catch (error: any) {
        console.error('Error in members handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
