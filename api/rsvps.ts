import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient } from './_lib/supabase';
import { z } from 'zod';

const RsvpSchema = z.object({
    event_id: z.number(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    package_type: z.enum(['special', 'vip', 'mogul']),
    group_size: z.number().optional(),
    bottle_selection: z.string().optional(),
    special_notes: z.string().optional(),
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

    try {
        // Validate request body
        const parseResult = RsvpSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid request data',
                details: parseResult.error.issues
            });
        }

        const data = parseResult.data;
        const supabase = createServerClient();

        const { data: rsvp, error } = await supabase
            .from('rsvps')
            .insert({
                event_id: data.event_id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                package_type: data.package_type,
                group_size: data.group_size || null,
                bottle_selection: data.bottle_selection || null,
                special_notes: data.special_notes || null,
                status: 'pending'
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating RSVP:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ success: true, id: rsvp.id });
    } catch (error: any) {
        console.error('Error in rsvps handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
