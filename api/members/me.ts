import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from '../_lib/supabase';
import { z } from 'zod';

const UpdateMemberSchema = z.object({
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
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

        const supabase = createServerClient();

        if (req.method === 'GET') {
            const { data: member, error } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching member:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(member || null);
        }

        if (req.method === 'PUT') {
            // Validate request body
            const parseResult = UpdateMemberSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({
                    error: 'Invalid request data',
                    details: parseResult.error.issues
                });
            }

            const data = parseResult.data;

            const { error: updateError } = await supabase
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

            if (updateError) {
                console.error('Error updating member:', updateError);
                return res.status(500).json({ error: updateError.message });
            }

            const { data: member } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            return res.status(200).json({ success: true, member });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        console.error('Error in members/me handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
