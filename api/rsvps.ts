import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { adminEmails, emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';
import { enforceRateLimit } from './_lib/rate-limit.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';

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

        // Inline Supabase logic
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase server environment variables in rsvps.ts');
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false }
        });

        const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'rsvp', limit: 6, windowSeconds: 60 * 60 });
        if (!rateLimit.allowed) {
            return res.status(429).json({ error: 'Too many RSVP attempts. Try again later.' });
        }

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

        const isIndependenceEvent = data.event_id === 30;

        await Promise.all([
            sendBrandedEmail({
                to: data.email,
                subject: isIndependenceEvent
                    ? '🇯🇲 CONFIRMED: Independence Day Special (Jay-Z Black Album Tribute) | This Is Hip Hop'
                    : 'RSVP received | This Is Hip Hop Caribbean Events',
                preview: isIndependenceEvent
                    ? 'Your Independence Day RSVP is confirmed! Wear Full Black for FREE entry.'
                    : 'Your RSVP has been received and is pending review.',
                from: emailSenders.events,
                eyebrow: isIndependenceEvent ? 'Jamaica Independence Special' : 'RSVP Received',
                title: isIndependenceEvent ? 'Dirt Off Your Shoulders — You are on the list!' : 'You are on the list',
                intro: isIndependenceEvent
                    ? "We've confirmed your RSVP for Thursday, August 6th at Dulce Lounge! Join us as we celebrate Jamaica Independence and 20 Years of Jay-Z's legendary Black Album."
                    : 'We received your RSVP request. The team will review the details and follow up if anything else is needed before the event.',
                sections: [
                    {
                        title: 'RSVP & Entry Details',
                        rows: [
                            ['Guest Name', data.name],
                            ['Event', isIndependenceEvent ? 'Independence Day Special: Dirt Off Your Shoulders' : `Event #${data.event_id}`],
                            ['Date & Time', 'Thursday, August 6, 2026 @ 9:00 PM'],
                            ['Venue', 'Dulce Lounge (22 Barbican Road, Kingston)'],
                            ['Admission Rate', 'FREE in Full Black w/ RSVP ($500 w/ Standard RSVP, $1,000 Gate)'],
                            ['Lineup', 'Main DJ Troy Finzi | Resident DJ Steamaz | Resident Andre Millwood'],
                            ['Group Size', data.group_size || 1],
                            ['Table / Notes', data.special_notes || 'None'],
                        ],
                    },
                ],
                action: { label: isIndependenceEvent ? 'View Independence Landing Page' : 'View Events', url: siteUrl(isIndependenceEvent ? '/independence' : '/events') },
            }),
            sendBrandedEmail({
                to: adminEmails,
                subject: `New RSVP: ${data.name}`,
                preview: `${data.name} submitted an RSVP for event ${data.event_id}.`,
                from: emailSenders.ops,
                eyebrow: 'Admin Alert',
                title: 'New RSVP Submitted',
                intro: 'A new RSVP is waiting in the dashboard/Supabase queue.',
                sections: [
                    {
                        title: 'Guest',
                        rows: [
                            ['Name', data.name],
                            ['Email', data.email],
                            ['Phone', data.phone],
                            ['Event ID', data.event_id],
                            ['Package', data.package_type],
                            ['Group size', data.group_size || 1],
                            ['Bottle selection', data.bottle_selection],
                            ['Notes', data.special_notes],
                        ],
                    },
                ],
            }),
        ]);
        await trackAnalyticsEvent(supabase, req, {
            eventName: 'rsvp_submitted',
            email: data.email,
            properties: { rsvpId: rsvp.id, eventId: data.event_id, packageType: data.package_type, groupSize: data.group_size || 1 },
        });

        return res.status(201).json({ success: true, id: rsvp.id });
    } catch (error: any) {
        console.error('Error in rsvps handler:', error);
        return res.status(500).json({ error: error.message });
    }
}
