import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient } from '../_lib/supabase.js';
import { emailSenders, sendBrandedEmail, siteUrl } from '../_lib/email.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createServerClient();

        // Fetch all confirmed or pending RSVPs for Event ID 30
        const { data: rsvps, error } = await supabase
            .from('rsvps')
            .select('*')
            .eq('event_id', 30);

        if (error) {
            throw error;
        }

        if (!rsvps || rsvps.length === 0) {
            return res.status(200).json({ success: true, count: 0, message: 'No RSVPs found for Event #30' });
        }

        const emailPromises = rsvps.map((rsvp) => {
            return sendBrandedEmail({
                to: rsvp.email,
                subject: 'TOMORROW NIGHT 🇯🇲 ILHH Independence Day Special | Jay-Z Black Album Tribute',
                preview: 'Tomorrow night at Dulce Lounge! Wear Full Black for FREE entry.',
                from: emailSenders.events,
                eyebrow: 'Tomorrow Night • Thursday Aug 6',
                title: 'Get Ready: Dirt Off Your Shoulders!',
                intro: `Hey ${rsvp.name}, tomorrow night we celebrate Jamaica Independence and 20 Years of Jay-Z's Black Album at Dulce Lounge!`,
                sections: [
                    {
                        title: 'Event Reminder Details',
                        rows: [
                            ['Guest Name', rsvp.name],
                            ['Event', 'ILHH Independence Day Special: Dirt Off Your Shoulders'],
                            ['Date & Time', 'Thursday, August 6, 2026 @ 9:00 PM'],
                            ['Venue', 'Dulce Lounge (22 Barbican Road, Kingston)'],
                            ['Dress Code Reminder', 'Wear FULL BLACK to claim FREE Admission at the door!'],
                            ['Admission Rates', 'FREE in Full Black w/ RSVP • $500 w/ Standard RSVP • $1,000 Gate'],
                            ['Lineup', 'Main DJ Troy Finzi | Resident DJ Steamaz | Resident Andre Millwood'],
                            ['Group Size', rsvp.group_size || 1],
                        ],
                    },
                ],
                action: { label: 'View Event Details & Map', url: siteUrl('/independence') },
            });
        });

        await Promise.all(emailPromises);

        return res.status(200).json({
            success: true,
            count: rsvps.length,
            message: `Dispatched ${rsvps.length} Independence Day pre-event reminder email(s).`,
        });
    } catch (error) {
        console.error('Error sending Independence reminder emails:', error);
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to send reminders' });
    }
}
