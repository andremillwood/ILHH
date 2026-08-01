import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { adminEmails, emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';
import { enforceRateLimit } from './_lib/rate-limit.js';
import { createServerClient, createUserClient } from './_lib/supabase.js';

const fallbackPolicies: Record<string, { title: string; body: string }> = {
    terms: {
        title: 'Terms of Service',
        body: `Welcome to This Is Hip Hop Caribbean. These Terms of Service explain the rules for using our website, attending or RSVP'ing for events, submitting community listings, joining membership experiences, purchasing merch, streaming or uploading mixtape content, and contacting our support team.

Our platform exists to connect Jamaica's hip hop community with events, music, creators, promoters, venues, culture, and commerce. By using the site, you agree to use it with respect for the community, the artists, the venues, and the people whose work appears here.

Accounts, memberships, RSVPs, event submissions, orders, and support requests must use accurate information. We may review, approve, reject, edit, suspend, or remove submissions, profiles, RSVPs, memberships, listings, uploads, comments, orders, or access when needed to protect the platform, prevent abuse, respond to legal obligations, or maintain the quality and safety of the experience.

Event details are provided for discovery and community coordination. Times, venues, lineups, admission policies, age restrictions, capacity, dress codes, and availability may change. Promoters and venues remain responsible for their own event operations, permissions, safety, ticketing, refunds, and compliance with applicable law.

Merch purchases are subject to payment verification, product availability, fulfillment partner requirements, production timing, shipping carrier performance, customs, and our refund and shipping policies. Payment processing is handled by Stripe. Made-to-order items may not be cancellable once production begins.

You may only submit or upload content that you have the right to share, including flyers, artist images, descriptions, audio, mixes, profile information, and event details. You keep ownership of your content, but you grant This Is Hip Hop Caribbean permission to display, promote, format, edit for clarity, distribute, and use it in connection with the platform and our community channels. Do not submit infringing, misleading, hateful, abusive, fraudulent, sexually exploitative, or unlawful content.

The This Is Hip Hop Caribbean platform name, design, logos, editorial copy, collections, and original materials are protected by intellectual property rights. I Luv Hip Hop is our signature event and merchandise brand. You may not copy, scrape, resell, impersonate, interfere with, or misuse the platform or its systems.

We may update these terms as the platform grows. Continued use after an update means you accept the revised terms. If you need help with an order, RSVP, membership, event listing, or content concern, contact support through the site.`,
    },
    privacy: {
        title: 'Privacy Policy',
        body: `This Is Hip Hop Caribbean collects information needed to operate a trusted cultural platform for events, memberships, merch, mixtapes, profiles, community submissions, and support. This policy explains what we collect, why we collect it, and how it is used.

We may collect information you provide directly, including your name, email address, phone number, membership details, RSVP details, event submissions, profile information, mixtape upload details, support messages, shipping information, and order-related information. We also collect basic technical and usage information such as pages visited, referral paths, session identifiers, device or browser details, and analytics events that help us understand platform performance.

We use this information to run the site, manage memberships and RSVPs, review event and profile submissions, process merch orders, provide support, send confirmations or operational messages, prevent fraud and abuse, improve the platform, understand community engagement, and comply with legal or payment obligations.

Payment information is processed by Stripe. We do not store full card numbers on our servers. Merch fulfillment information may be shared with Printful or another fulfillment partner when needed to produce, package, and ship your order. Email, hosting, analytics, database, and operational service providers may process limited information for the services they provide to us.

We do not sell personal information. We may share information when necessary to complete a transaction or request, operate the platform, protect users and partners, investigate abuse, comply with law, or enforce our terms.

Some parts of the platform are public by nature. Approved event listings, creator profiles, gallery materials, and community content may be visible to visitors and may be promoted through This Is Hip Hop Caribbean channels.

We keep information for as long as needed for platform operations, support, accounting, security, legal compliance, and community records. You may contact support to request review, correction, or deletion of personal information where applicable, subject to records we must retain for legitimate operational or legal reasons.

We use reasonable safeguards to protect information, but no online system is perfectly secure. Please use accurate contact information, protect your account access, and contact support if you believe your information has been used improperly.

This policy may be updated as our platform, vendors, and community features evolve. The latest version will be available on this page.`,
    },
    refunds: {
        title: 'Refund Policy',
        body: 'Merch is made to order. Contact support promptly if an item arrives damaged, misprinted, or incorrect. Refunds, replacements, and cancellations are reviewed case by case before fulfillment begins and may be limited once production has started.',
    },
    shipping: {
        title: 'Shipping Policy',
        body: 'Merch is produced on demand after payment confirmation. Production and delivery times vary by item, destination, customs, carrier conditions, and product availability. Tracking details are sent when available.',
    },
    'event-submissions': {
        title: 'Event Submission Terms',
        body: 'Submitted events are reviewed before publication. Submission does not guarantee approval, placement, promotion, or ticket sales. Promoters remain responsible for accurate details, submitted artwork rights, venue permissions, and legal compliance.',
    },
};

const SupportSchema = z.object({
    requestType: z.enum(['general', 'order_issue', 'refund_replacement']).default('general'),
    orderPublicId: z.string().uuid().optional().or(z.literal('')),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

const AdminAccessRequestSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    organization: z.string().optional(),
    requestedRole: z.enum(['admin']).default('admin'),
    requestedPermissions: z.array(z.enum(['events', 'rsvps', 'galleries', 'mixtapes', 'members', 'orders', 'content', 'analytics', 'settings'])).default([]),
    reason: z.string().min(10),
});

const AnalyticsSchema = z.object({
    eventName: z.enum(['merch_product_viewed', 'checkout_started', 'checkout_completed', 'rsvp_submitted', 'event_submitted', 'member_joined']),
    email: z.string().email().optional(),
    visitorId: z.string().max(128).optional(),
    sessionId: z.string().max(128).optional(),
    path: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
});

type MerchProductRow = {
    id: string;
    name: string;
    category: string;
    category_label: string;
    price: number | string;
    description: string | null;
    story: string | null;
    colors: string[];
    sizes: string[];
    image_class: string;
    images: unknown;
    badge: string | null;
    merch_product_variants?: Array<{
        id: string;
        size: string;
        color: string;
        printful_sync_variant_id: number | null;
        availability_status: string | null;
        is_active: boolean;
    }>;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const resource = String(req.query.resource || '');

    if (resource === 'engagement') {
        const targetType = String(req.query.targetType || req.body?.targetType || '');
        const targetId = String(req.query.targetId || req.body?.targetId || '');
        const engagementType = String(req.body?.engagementType || '');
        const validTarget = ['creator_profile', 'mixtape', 'article', 'event'].includes(targetType);
        if (!validTarget || !targetId) return res.status(400).json({ error: 'Valid targetType and targetId are required' });

        try {
            const supabase = createServerClient();
            const authHeader = req.headers.authorization;
            let user: { id: string } | null = null;
            let member: { id: number; is_public?: boolean; profile_visibility?: string } | null = null;
            if (authHeader) {
                const supabaseUser = createUserClient(authHeader);
                const userResult = await supabaseUser.auth.getUser();
                user = userResult.data.user ? { id: userResult.data.user.id } : null;
                if (user) {
                    const { data } = await supabase.from('members').select('id, is_public, profile_visibility').eq('user_id', user.id).maybeSingle();
                    member = data;
                }
            }

            if (req.method === 'GET') {
                const { data, error } = await supabase
                    .from('user_engagements')
                    .select('engagement_type, user_id, members(id, first_name, last_name, avatar_url, is_public, profile_visibility)')
                    .eq('target_type', targetType)
                    .eq('target_id', targetId);
                if (error) throw error;
                type EngagementRow = { engagement_type: string; user_id: string; members?: unknown };
                const rows = (data || []) as EngagementRow[];
                const counts = rows.reduce<Record<string, number>>((acc, row) => {
                    acc[row.engagement_type] = (acc[row.engagement_type] || 0) + 1;
                    return acc;
                }, {});
                const mine = user ? rows.filter((row) => row.user_id === user.id).map((row) => row.engagement_type) : [];
                return res.status(200).json({ counts, mine, publicMembers: [] });
            }

            if (!user || !member) return res.status(401).json({ error: 'Complete membership first' });
            if (!['like', 'save', 'follow', 'view', 'play', 'download', 'share'].includes(engagementType)) return res.status(400).json({ error: 'Invalid engagementType' });

            if (req.method === 'POST') {
                const { error } = await supabase.from('user_engagements').upsert({
                    user_id: user.id,
                    member_id: member.id,
                    target_type: targetType,
                    target_id: targetId,
                    engagement_type: engagementType,
                    is_public: Boolean(member.is_public && member.profile_visibility === 'public'),
                    metadata: {},
                    created_at: new Date().toISOString(),
                }, { onConflict: 'user_id,target_type,target_id,engagement_type' });
                if (error) throw error;
                return res.status(200).json({ success: true });
            }

            if (req.method === 'DELETE') {
                const { error } = await supabase
                    .from('user_engagements')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('target_type', targetType)
                    .eq('target_id', targetId)
                    .eq('engagement_type', engagementType);
                if (error) throw error;
                return res.status(200).json({ success: true });
            }
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Engagement request failed' });
        }
    }

    if (resource === 'playlists') {
        try {
            const supabase = createServerClient();
            if (req.method === 'GET') {
                const slug = String(req.query.slug || '');
                const type = String(req.query.type || '');
                const includeSuggestions = String(req.query.suggestions || '') === 'true';
                let query = supabase
                    .from('music_playlists')
                    .select('*')
                    .eq('is_published', true)
                    .order('is_featured', { ascending: false })
                    .order('published_at', { ascending: false });
                if (slug) query = query.eq('slug', slug).limit(1);
                if (type && type !== 'all') query = query.eq('playlist_type', type);
                const { data: playlists, error } = await query.limit(slug ? 1 : 60);
                if (error) throw error;
                let suggestions: unknown[] = [];
                if (includeSuggestions) {
                    const { data } = await supabase
                        .from('playlist_suggestions')
                        .select('*, members(first_name, last_name, instagram_handle)')
                        .in('status', ['pending', 'shortlisted', 'added'])
                        .order('vote_count', { ascending: false })
                        .order('created_at', { ascending: false })
                        .limit(80);
                    suggestions = data || [];
                }
                return res.status(200).json(slug ? { playlist: playlists?.[0] || null, suggestions } : { playlists: playlists || [], suggestions });
            }

            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).json({ error: 'Authorization required' });
            const supabaseUser = createUserClient(authHeader);
            const { data: { user } } = await supabaseUser.auth.getUser();
            if (!user) return res.status(401).json({ error: 'Unauthorized' });
            const { data: member } = await supabase.from('members').select('id').eq('user_id', user.id).maybeSingle();
            if (!member) return res.status(400).json({ error: 'Complete membership first' });

            if (req.query.action === 'vote') {
                const suggestionId = Number(req.query.suggestionId);
                if (!suggestionId) return res.status(400).json({ error: 'suggestionId required' });
                if (req.method === 'POST') {
                    const { error } = await supabase.from('playlist_votes').upsert({ member_id: member.id, suggestion_id: suggestionId }, { onConflict: 'member_id,suggestion_id' });
                    if (error) throw error;
                } else if (req.method === 'DELETE') {
                    const { error } = await supabase.from('playlist_votes').delete().eq('member_id', member.id).eq('suggestion_id', suggestionId);
                    if (error) throw error;
                }
                const { count } = await supabase.from('playlist_votes').select('id', { count: 'exact', head: true }).eq('suggestion_id', suggestionId);
                await supabase.from('playlist_suggestions').update({ vote_count: count || 0, updated_at: new Date().toISOString() }).eq('id', suggestionId);
                return res.status(200).json({ success: true, voteCount: count || 0 });
            }

            if (req.method === 'POST') {
                const data = req.body || {};
                if (!data.track_title || !data.artist_name) return res.status(400).json({ error: 'Track title and artist are required' });
                const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'playlist_suggestion', limit: 8, windowSeconds: 60 * 60 });
                if (!rateLimit.allowed) return res.status(429).json({ error: 'Too many suggestions. Try again later.' });
                const { data: suggestion, error } = await supabase.from('playlist_suggestions').insert({
                    member_id: member.id,
                    playlist_id: data.playlist_id || null,
                    track_title: data.track_title,
                    artist_name: data.artist_name,
                    platform_url: data.platform_url || null,
                    reason: data.reason || null,
                    suggested_for: data.suggested_for || null,
                }).select('*').single();
                if (error) throw error;
                return res.status(201).json({ success: true, suggestion });
            }
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Playlist request failed' });
        }
    }

    if (resource === 'profiles') {
        try {
            const supabase = createUserClient();
            const slug = String(req.query.slug || '');
            const type = String(req.query.type || '');
            const q = String(req.query.q || '').trim();
            let query = supabase
                .from('creator_profiles')
                .select('*')
                .eq('status', 'approved')
                .order('is_featured', { ascending: false })
                .order('display_name', { ascending: true });
            if (slug) query = query.eq('slug', slug).limit(1);
            if (type && type !== 'all') query = query.eq('profile_type', type);
            if (q.length >= 2) {
                const term = `%${q}%`;
                query = query.or(`display_name.ilike.${term},tagline.ilike.${term},bio.ilike.${term},city.ilike.${term},specialties.ilike.${term}`);
            }
            const { data, error } = await query.limit(slug ? 1 : 80);
            if (error) throw error;
            return res.status(200).json(slug ? data?.[0] || null : data || []);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load profiles' });
        }
    }

    if (req.method === 'POST' && resource === 'analytics') {
        const parseResult = AnalyticsSchema.safeParse(req.body);
        if (!parseResult.success) return res.status(400).json({ error: 'Invalid analytics payload' });
        try {
            const supabase = createServerClient();
            await trackAnalyticsEvent(supabase, req, {
                eventName: parseResult.data.eventName,
                email: parseResult.data.email,
                visitorId: parseResult.data.visitorId,
                sessionId: parseResult.data.sessionId,
                path: parseResult.data.path,
                referrer: parseResult.data.referrer,
                properties: parseResult.data.properties,
            });
        } catch (error) {
            console.error('Public analytics failed:', error);
        }
        return res.status(200).json({ success: true });
    }

    if (req.method === 'POST' && resource === 'support') {
        const parseResult = SupportSchema.safeParse(req.body);
        if (!parseResult.success) return res.status(400).json({ error: 'Invalid support request', details: parseResult.error.issues });

        try {
            const supabase = createServerClient();
            const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'support_request', limit: 5, windowSeconds: 60 * 60 });
            if (!rateLimit.allowed) return res.status(429).json({ error: 'Too many support requests. Try again later.' });

            const data = parseResult.data;
            const { data: request, error } = await supabase
                .from('support_requests')
                .insert({
                    request_type: data.requestType,
                    order_public_id: data.orderPublicId || null,
                    name: data.name,
                    email: data.email,
                    phone: data.phone || null,
                    subject: data.subject,
                    message: data.message,
                })
                .select('id')
                .single();
            if (error) throw error;

            await Promise.all([
                sendBrandedEmail({
                    to: data.email,
                    subject: 'Support request received | This Is Hip Hop Caribbean',
                    preview: 'We received your message and will review it.',
                    from: emailSenders.ops,
                    eyebrow: 'Support',
                    title: 'Request received',
                    intro: 'Thanks for reaching out. The team will review your request and respond from an official ILHH address.',
                    sections: [{ title: 'Request', rows: [['Reference', request.id], ['Type', data.requestType], ['Order', data.orderPublicId], ['Subject', data.subject]] }],
                    action: { label: 'Visit Site', url: siteUrl('/') },
                }),
                sendBrandedEmail({
                    to: adminEmails,
                    subject: `Support request: ${data.subject}`,
                    preview: `${data.name} submitted a ${data.requestType} request.`,
                    from: emailSenders.ops,
                    eyebrow: 'Support Alert',
                    title: 'New support request',
                    intro: 'A customer submitted a support request from the site.',
                    sections: [{ title: 'Details', rows: [['Reference', request.id], ['Type', data.requestType], ['Order', data.orderPublicId], ['Name', data.name], ['Email', data.email], ['Phone', data.phone], ['Message', data.message]] }],
                    replyTo: data.email,
                }),
            ]);

            return res.status(201).json({ success: true, id: request.id });
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Support request failed' });
        }
    }

    if (req.method === 'POST' && resource === 'admin_access_request') {
        const parseResult = AdminAccessRequestSchema.safeParse(req.body);
        if (!parseResult.success) return res.status(400).json({ error: 'Invalid admin access request', details: parseResult.error.issues });

        try {
            const supabase = createServerClient();
            const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'admin_access_request', limit: 3, windowSeconds: 60 * 60 });
            if (!rateLimit.allowed) return res.status(429).json({ error: 'Too many admin access requests. Try again later.' });

            const data = parseResult.data;
            const email = data.email.trim().toLowerCase();
            const { data: member } = await supabase
                .from('members')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            const { data: request, error } = await supabase
                .from('admin_access_requests')
                .insert({
                    name: data.name,
                    email,
                    phone: data.phone || null,
                    organization: data.organization || null,
                    requested_role: data.requestedRole,
                    requested_permissions: data.requestedPermissions,
                    reason: data.reason,
                    member_id: member?.id || null,
                    status: 'pending',
                })
                .select('id')
                .single();
            if (error) throw error;

            await Promise.all([
                sendBrandedEmail({
                    to: email,
                    subject: 'Admin access request received | This Is Hip Hop Caribbean',
                    preview: 'Your admin access request has been received for review.',
                    from: emailSenders.ops,
                    eyebrow: 'Admin Access',
                    title: 'Request received',
                    intro: 'Thanks for requesting platform admin access. A superadmin will review your request and follow up after approval.',
                    sections: [{ title: 'Request', rows: [['Reference', request.id], ['Name', data.name], ['Permissions', data.requestedPermissions.join(', ') || 'General admin'], ['Status', 'Pending review']] }],
                    action: { label: 'Visit Platform', url: siteUrl('/') },
                }),
                sendBrandedEmail({
                    to: adminEmails,
                    subject: `Admin access request: ${data.name}`,
                    preview: `${data.name} requested admin access.`,
                    from: emailSenders.ops,
                    eyebrow: 'Admin Access Alert',
                    title: 'New admin request',
                    intro: 'Someone requested admin access to the This Is Hip Hop Caribbean platform.',
                    sections: [{ title: 'Request', rows: [['Reference', request.id], ['Name', data.name], ['Email', email], ['Phone', data.phone], ['Organization', data.organization], ['Permissions', data.requestedPermissions.join(', ') || 'General admin'], ['Reason', data.reason], ['Existing member', member?.id ? `Yes #${member.id}` : 'No']] }],
                    action: { label: 'Review Admins', url: siteUrl('/admin') },
                    replyTo: email,
                }),
            ]);

            return res.status(201).json({ success: true, id: request.id });
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Admin access request failed' });
        }
    }

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    if (resource === 'merch') {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
        try {
            const supabase = createServerClient();
            const { data, error } = await supabase
                .from('merch_products')
                .select('*, merch_product_variants(*)')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const products = ((data || []) as MerchProductRow[]).map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category,
                categoryLabel: product.category_label,
                price: Number(product.price),
                description: product.description || '',
                story: product.story || product.description || '',
                colors: product.colors || [],
                sizes: product.sizes || [],
                imageClass: product.image_class,
                images: Array.isArray(product.images) ? product.images : [],
                badge: product.badge || undefined,
                variants: (product.merch_product_variants || [])
                    .filter((variant) => variant.is_active)
                    .map((variant) => ({
                        id: variant.id,
                        size: variant.size,
                        color: variant.color,
                        printfulVariantId: variant.printful_sync_variant_id || undefined,
                        availabilityStatus: variant.availability_status || undefined,
                        isActive: variant.is_active,
                    })),
            }));

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load merch products' });
        }
    }

    if (resource === 'search') {
        const q = req.query.q;
        if (!q || typeof q !== 'string' || q.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }

        const searchTerm = `%${q.trim().toLowerCase()}%`;

        try {
            const supabase = createUserClient();
            const [eventsResult, articlesResult, mixtapesResult, profilesResult, membersResult, playlistsResult] = await Promise.all([
                supabase
                    .from('events')
                    .select('id, title, theme, sub_theme, event_date, venue_name')
                    .or(`title.ilike.${searchTerm},theme.ilike.${searchTerm},sub_theme.ilike.${searchTerm},venue_name.ilike.${searchTerm}`)
                    .order('event_date', { ascending: true })
                    .limit(10),
                supabase
                    .from('articles')
                    .select('id, title, slug, excerpt')
                    .eq('is_published', true)
                    .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('mixtapes')
                    .select('id, title, slug, dj_name, description')
                    .or(`title.ilike.${searchTerm},dj_name.ilike.${searchTerm},description.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('creator_profiles')
                    .select('id, display_name, slug, profile_type, tagline, city')
                    .eq('status', 'approved')
                    .or(`display_name.ilike.${searchTerm},tagline.ilike.${searchTerm},bio.ilike.${searchTerm},city.ilike.${searchTerm},specialties.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('members')
                    .select('id, first_name, last_name, instagram_handle, location, member_role')
                    .eq('is_public', true)
                    .eq('profile_visibility', 'public')
                    .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},instagram_handle.ilike.${searchTerm},location.ilike.${searchTerm},favorite_djs.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('music_playlists')
                    .select('id, title, slug, playlist_type, platform, description')
                    .eq('is_published', true)
                    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},mood.ilike.${searchTerm},tags.ilike.${searchTerm},curator_name.ilike.${searchTerm}`)
                    .limit(10),
            ]);

            return res.status(200).json({
                events: eventsResult.data || [],
                articles: articlesResult.data || [],
                mixtapes: mixtapesResult.data || [],
                profiles: profilesResult.data || [],
                members: membersResult.data || [],
                playlists: playlistsResult.data || [],
                query: q,
            });
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Search failed' });
        }
    }

    if (resource === 'order-status') {
        const publicId = String(req.query.id || '');
        if (!publicId) return res.status(400).json({ error: 'Order ID is required' });

        try {
            const supabase = createServerClient();
            const { data: order, error } = await supabase
                .from('merch_orders')
                .select('public_id, customer_email, customer_name, total_cents, currency, status_v2, fulfillment_status, tracking_number, tracking_url, carrier, created_at, paid_at, submitted_to_printful_at, shipped_at, delivered_at, merch_order_items(product_name, color, size, quantity)')
                .eq('public_id', publicId)
                .single();

            if (error) return res.status(404).json({ error: 'Order not found' });
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load order status' });
        }
    }

    if (resource === 'policies') {
        const slug = String(req.query.slug || '');
        try {
            const supabase = createServerClient();
            let query = supabase.from('site_policies').select('slug, title, body, updated_at').eq('is_published', true);
            if (slug) query = query.eq('slug', slug);

            const { data, error } = await query.order('slug');
            if (error) throw error;
            return res.status(200).json(slug ? data?.[0] || fallbackPolicies[slug] : data);
        } catch {
            if (slug) return res.status(200).json({ slug, ...fallbackPolicies[slug] });
            return res.status(200).json(Object.entries(fallbackPolicies).map(([policySlug, policy]) => ({ slug: policySlug, ...policy })));
        }
    }

    return res.status(404).json({ error: 'Resource not found' });
}
