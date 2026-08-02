import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { adminEmails, emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';
import { enforceRateLimit } from './_lib/rate-limit.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';

const EventSubmissionSchema = z.object({
    event_title: z.string().min(2),
    event_date: z.string().min(4),
    event_time: z.string().optional(),
    venue_name: z.string().min(2),
    venue_address: z.string().optional(),
    city_country: z.string().min(2),
    event_type: z.string().min(2),
    lineup: z.string().optional(),
    promoter_name: z.string().min(2),
    promoter_email: z.string().email(),
    promoter_phone: z.string().optional(),
    instagram_handle: z.string().optional(),
    flyer_url: z.string().optional(),
    event_url: z.string().optional(),
    notes: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!['GET', 'POST'].includes(req.method || '')) {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, action } = req.query;

    try {
        // Init Supabase (Inlined for debugging)
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables in events.ts');
        }

        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createClient(supabaseUrl, req.method === 'POST' ? supabaseServiceKey || supabaseAnonKey : supabaseAnonKey, {
            auth: { persistSession: false }
        });

        if (req.method === 'POST' && action === 'submit') {
            const parseResult = EventSubmissionSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid submission data', details: parseResult.error.issues });
            }

            const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'event_submission', limit: 4, windowSeconds: 60 * 60 });
            if (!rateLimit.allowed) {
                return res.status(429).json({ error: 'Too many event submissions. Try again later.' });
            }

            const { data, error } = await supabase
                .from('event_submissions')
                .insert({ ...parseResult.data, status: 'pending' })
                .select('id')
                .single();

            if (error) throw error;

            const submission = parseResult.data;
            await Promise.all([
                sendBrandedEmail({
                    to: submission.promoter_email,
                    subject: 'Event submission received | This Is Hip Hop Caribbean Events',
                    preview: 'Your event submission has been received for review.',
                    from: emailSenders.events,
                    eyebrow: 'Event Submission',
                    title: 'Submission received',
                    intro: 'Thanks for sending your event through. The team will review the details and follow up if we need anything before publishing.',
                    sections: [{ title: 'Event Details', rows: [['Event', submission.event_title], ['Date', submission.event_date], ['Time', submission.event_time], ['Venue', submission.venue_name], ['City', submission.city_country], ['Type', submission.event_type]] }],
                    action: { label: 'View Events', url: siteUrl('/events') },
                    replyTo: adminEmails[0],
                }),
                sendBrandedEmail({
                    to: adminEmails,
                    subject: `New event submission: ${submission.event_title}`,
                    preview: `${submission.promoter_name} submitted ${submission.event_title}.`,
                    from: emailSenders.ops,
                    eyebrow: 'Admin Alert',
                    title: 'New event submission',
                    intro: 'A promoter submitted a new event for review.',
                    sections: [{ title: 'Submission', rows: [['Event', submission.event_title], ['Date', submission.event_date], ['Venue', submission.venue_name], ['City', submission.city_country], ['Promoter', submission.promoter_name], ['Email', submission.promoter_email], ['Phone', submission.promoter_phone], ['Instagram', submission.instagram_handle], ['Event URL', submission.event_url], ['Notes', submission.notes]] }],
                    replyTo: submission.promoter_email,
                }),
            ]);
            await trackAnalyticsEvent(supabase, req, {
                eventName: 'event_submitted',
                email: submission.promoter_email,
                properties: { submissionId: data.id, eventTitle: submission.event_title, eventDate: submission.event_date },
            });

            return res.status(201).json({ success: true, id: data.id });
        }

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // If ID provided, get single event
        if (id && typeof id === 'string') {
            const { data: event, error } = await supabase
                .from('events')
                .select(`*, event_djs (id, dj_name, dj_description, is_resident)`)
                .eq('id', parseInt(id))
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Event not found' });
                }
                throw error;
            }

            return res.status(200).json({ ...event, djs: event.event_djs || [] });
        }

        // Get all events
        const { data: events, error } = await supabase
            .from('events')
            .select(`*, event_djs (id, dj_name, dj_description, is_resident)`)
            .order('event_date', { ascending: true });

        if (error) {
            throw error;
        }

        const transformedEvents = events?.map(event => {
            const djs = event.event_djs || [];
            if (event.id === 30 || event.event_date === '2026-08-06') {
                return {
                    ...event,
                    title: (!event.title || event.title === 'ILHH Weekly') ? 'Independence Day Celebration' : event.title,
                    theme: (!event.theme || event.theme === 'I Luv Hip Hop Thursdays') ? 'Celebrating Jay-Z The Black Album' : event.theme,
                    sub_theme: (!event.sub_theme || event.sub_theme === 'Details TBA') ? 'Dirt Off Your Shoulders' : event.sub_theme,
                    flyer_url: event.flyer_url || '/flyers/aug-week1-independence.jpg',
                    description: event.description || 'Jamaica Independence Day Special celebrating Jay-Z The Black Album (20 Years of Greatness). Cover charge: $1,000 General / At The Gate. $500 with RSVP. FREE in full black with RSVP.',
                    is_featured: true,
                    is_special: true,
                    djs: djs.length > 0 ? djs : [
                        { id: 101, dj_name: 'Troy Finzi', dj_description: 'Main DJ', is_resident: 0 },
                        { id: 102, dj_name: 'DJ Steamaz', dj_description: 'Resident DJ', is_resident: 1 },
                        { id: 103, dj_name: 'Andre Millwood', dj_description: 'Resident DJ', is_resident: 1 },
                    ]
                };
            }
            return {
                ...event,
                djs,
            };
        });

        return res.status(200).json(transformedEvents || []);
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
