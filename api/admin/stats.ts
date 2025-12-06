import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from '../_lib/supabase';

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

        // Get counts
        const [eventsResult, membersResult, rsvpsResult] = await Promise.all([
            supabase.from('events').select('id', { count: 'exact', head: true }),
            supabase.from('members').select('id', { count: 'exact', head: true }),
            supabase.from('rsvps').select('id', { count: 'exact', head: true }),
        ]);

        return res.status(200).json({
            totalEvents: eventsResult.count || 0,
            totalMembers: membersResult.count || 0,
            totalRsvps: rsvpsResult.count || 0,
        });
    } catch (error: any) {
        console.error('Error in admin stats handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
