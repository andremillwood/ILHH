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

        const { data: mixtapes, error } = await supabase
            .from('mixtapes')
            .select('*')
            .order('release_date', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching mixtapes:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(mixtapes || []);
    } catch (error: any) {
        console.error('Error in mixtapes handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
