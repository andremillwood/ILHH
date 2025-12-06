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

    try {
        const supabase = createUserClient();

        const { data: galleries, error } = await supabase
            .from('galleries')
            .select('*')
            .order('created_at', { ascending: false });

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
