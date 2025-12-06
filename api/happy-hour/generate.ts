import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from '../_lib/supabase';

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

        const supabase = createServerClient();

        // Get member
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (memberError || !member) {
            return res.status(404).json({ error: 'Member not found. Please complete membership first.' });
        }

        // Check if already has active coupon
        const { data: existing } = await supabase
            .from('happy_hour_coupons')
            .select('*')
            .eq('member_id', member.id)
            .eq('is_redeemed', false)
            .gt('valid_until', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (existing) {
            return res.status(200).json({ success: true, coupon: existing });
        }

        // Generate new coupon
        const code = `HH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Set valid times for next Thursday 8pm-10:30pm
        const now = new Date();
        const nextThursday = new Date(now);
        const daysUntilThursday = (4 - now.getDay() + 7) % 7 || 7;
        nextThursday.setDate(now.getDate() + daysUntilThursday);

        const validFrom = new Date(nextThursday);
        validFrom.setHours(20, 0, 0, 0);

        const validUntil = new Date(nextThursday);
        validUntil.setHours(22, 30, 0, 0);

        const { data: coupon, error: insertError } = await supabase
            .from('happy_hour_coupons')
            .insert({
                member_id: member.id,
                coupon_code: code,
                valid_from: validFrom.toISOString(),
                valid_until: validUntil.toISOString(),
            })
            .select('*')
            .single();

        if (insertError) {
            console.error('Error creating coupon:', insertError);
            return res.status(500).json({ error: insertError.message });
        }

        return res.status(200).json({ success: true, coupon });
    } catch (error: any) {
        console.error('Error in happy-hour generate handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
