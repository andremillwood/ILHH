import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from '../_lib/supabase';
import { z } from 'zod';

const ADMIN_EMAILS = ['andremillwood@gmail.com', 'admin@ilovehiphopja.com'];

const MixtapeSchema = z.object({
    title: z.string().min(1),
    dj_name: z.string().min(1),
    cover_art_url: z.string().optional(),
    embed_url: z.string().optional(),
    description: z.string().optional(),
    release_date: z.string().optional(),
});

async function isAdmin(authHeader: string): Promise<boolean> {
    const supabaseUser = createUserClient(authHeader);
    const { data: { user } } = await supabaseUser.auth.getUser();
    return user?.email ? ADMIN_EMAILS.includes(user.email) : false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!(await isAdmin(authHeader))) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const supabase = createServerClient();
    const { id } = req.query;

    try {
        // GET - List all mixtapes
        if (req.method === 'GET') {
            const { data: mixtapes, error } = await supabase
                .from('mixtapes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(mixtapes || []);
        }

        // POST - Create mixtape
        if (req.method === 'POST') {
            const parseResult = MixtapeSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
            }

            const { data: mixtape, error } = await supabase
                .from('mixtapes')
                .insert(parseResult.data)
                .select()
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(201).json(mixtape);
        }

        // PUT - Update mixtape
        if (req.method === 'PUT' && id) {
            const parseResult = MixtapeSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
            }

            const { data: mixtape, error } = await supabase
                .from('mixtapes')
                .update(parseResult.data)
                .eq('id', parseInt(id as string))
                .select()
                .single();

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(mixtape);
        }

        // DELETE - Delete mixtape
        if (req.method === 'DELETE' && id) {
            const { error } = await supabase
                .from('mixtapes')
                .delete()
                .eq('id', parseInt(id as string));

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
