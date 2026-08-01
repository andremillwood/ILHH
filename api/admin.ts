import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';
import { syncPrintfulOrderStatus, logOrderEvent } from './_lib/orders.js';
import { syncPrintfulProducts } from './_lib/printful-sync.js';

const ADMIN_EMAILS = (process.env.ADMIN_NOTIFY_EMAILS || 'andremillwood@gmail.com,frankgriz@gmail.com,admin@ilovehiphopja.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const ADMIN_PERMISSION_KEYS = ['events', 'rsvps', 'galleries', 'mixtapes', 'members', 'orders', 'content', 'analytics', 'settings'] as const;
const SUPERADMIN_EMAILS = ['andremillwood@gmail.com', 'frankgriz@gmail.com'];

const EventSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    event_date: z.string(),
    event_time: z.string().optional(),
    venue_name: z.string().optional(),
    venue_address: z.string().optional(),
    theme: z.string().optional(),
    sub_theme: z.string().optional(),
    flyer_url: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_special: z.boolean().optional(),
    djs: z.array(z.object({
        dj_name: z.string().min(1),
        dj_description: z.string().optional().nullable(),
        is_resident: z.boolean().optional(),
    })).optional(),
});

const AdminUserUpdateSchema = z.object({
    member_role: z.enum(['fan', 'dj', 'artist', 'promoter', 'venue', 'media', 'admin']),
    admin_permissions: z.array(z.enum(ADMIN_PERMISSION_KEYS)).optional(),
});

const AdminAccessReviewSchema = z.object({
    action: z.enum(['approve', 'reject']),
    admin_permissions: z.array(z.enum(ADMIN_PERMISSION_KEYS)).optional(),
    review_notes: z.string().max(2000).optional(),
});

const GallerySchema = z.object({
    title: z.string().optional(),
    partner_name: z.string().min(1),
    partner_logo_url: z.string().url().optional().or(z.literal('')),
    partner_instagram: z.string().optional(),
    gallery_url: z.string().url().optional().or(z.literal('')),
    event_id: z.number().nullable().optional(),
    description: z.string().optional(),
    featured_image_url: z.string().url().optional().or(z.literal('')),
    source_label: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    allow_download: z.boolean().optional(),
    is_featured: z.boolean().optional(),
});

const GalleryImageSchema = z.object({
    gallery_id: z.number(),
    event_id: z.number().nullable().optional(),
    image_url: z.string().url(),
    thumbnail_url: z.string().url().optional().or(z.literal('')),
    caption: z.string().optional(),
    photographer_name: z.string().optional(),
    downloadable: z.boolean().optional(),
    sort_order: z.number().optional(),
});

const ArticleSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    featured_image_url: z.string().optional(),
    tags: z.string().optional(),
    is_published: z.boolean().optional(),
});

const MixtapeSchema = z.object({
    title: z.string().min(1),
    dj_name: z.string().min(1),
    cover_art_url: z.string().optional(),
    embed_url: z.string().optional(),
    description: z.string().optional(),
    release_date: z.string().optional(),
});

const PlaylistSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    curator_name: z.string().optional(),
    playlist_type: z.enum(['ilhh_curated', 'community_ranked', 'event_soundtrack', 'creator_spotlight', 'member_suggested']),
    mood: z.string().optional(),
    platform: z.enum(['spotify', 'apple_music', 'soundcloud', 'youtube', 'audiomack', 'tidal', 'other']),
    external_url: z.string().url(),
    embed_url: z.string().url().optional().or(z.literal('')),
    cover_url: z.string().url().optional().or(z.literal('')),
    tags: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_published: z.boolean().optional(),
});

const PlaylistSuggestionUpdateSchema = z.object({
    status: z.enum(['pending', 'shortlisted', 'added', 'rejected']),
});

const CreatorProfileAdminSchema = z.object({
    profile_type: z.enum(['dj', 'artist', 'promoter', 'venue', 'community']),
    status: z.enum(['draft', 'pending', 'approved', 'rejected', 'suspended']).optional(),
    display_name: z.string().min(2),
    slug: z.string().min(2).optional(),
    tagline: z.string().optional(),
    bio: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    avatar_url: z.string().url().optional().or(z.literal('')),
    cover_url: z.string().url().optional().or(z.literal('')),
    instagram_handle: z.string().optional(),
    tiktok_handle: z.string().optional(),
    youtube_url: z.string().url().optional().or(z.literal('')),
    soundcloud_url: z.string().url().optional().or(z.literal('')),
    spotify_url: z.string().url().optional().or(z.literal('')),
    website_url: z.string().url().optional().or(z.literal('')),
    booking_email: z.string().email().optional().or(z.literal('')),
    booking_phone: z.string().optional(),
    specialties: z.string().optional(),
    notable_credits: z.string().optional(),
    equipment_or_services: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_verified: z.boolean().optional(),
    review_notes: z.string().optional(),
});

const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

function cleanCreatorProfile(data: z.infer<typeof CreatorProfileAdminSchema>) {
    return {
        profile_type: data.profile_type,
        status: data.status || 'pending',
        display_name: data.display_name,
        slug: data.slug ? slugify(data.slug) : slugify(data.display_name),
        tagline: data.tagline || null,
        bio: data.bio || null,
        city: data.city || null,
        country: data.country || 'Jamaica',
        avatar_url: data.avatar_url || null,
        cover_url: data.cover_url || null,
        instagram_handle: data.instagram_handle?.replace(/^@/, '') || null,
        tiktok_handle: data.tiktok_handle?.replace(/^@/, '') || null,
        youtube_url: data.youtube_url || null,
        soundcloud_url: data.soundcloud_url || null,
        spotify_url: data.spotify_url || null,
        website_url: data.website_url || null,
        booking_email: data.booking_email || null,
        booking_phone: data.booking_phone || null,
        specialties: data.specialties || null,
        notable_credits: data.notable_credits || null,
        equipment_or_services: data.equipment_or_services || null,
        is_featured: data.is_featured || false,
        is_verified: data.is_verified || false,
        review_notes: data.review_notes || null,
    };
}

function cleanGallery(data: z.infer<typeof GallerySchema>) {
    return {
        title: data.title || data.partner_name,
        partner_name: data.partner_name,
        partner_logo_url: data.partner_logo_url || null,
        partner_instagram: data.partner_instagram?.replace(/^@/, '') || null,
        gallery_url: data.gallery_url || null,
        event_id: data.event_id || null,
        description: data.description || null,
        featured_image_url: data.featured_image_url || null,
        source_label: data.source_label || null,
        status: data.status || 'published',
        allow_download: data.allow_download ?? true,
        is_featured: data.is_featured || false,
    };
}

function cleanGalleryImage(data: z.infer<typeof GalleryImageSchema>) {
    return {
        gallery_id: data.gallery_id,
        event_id: data.event_id || null,
        image_url: data.image_url,
        thumbnail_url: data.thumbnail_url || null,
        caption: data.caption || null,
        photographer_name: data.photographer_name || null,
        downloadable: data.downloadable ?? true,
        sort_order: data.sort_order || 0,
    };
}

const OrderUpdateSchema = z.object({
    status_v2: z.enum(['pending_payment', 'paid', 'submitted_to_printful', 'in_fulfillment', 'shipped', 'delivered', 'cancelled', 'failed']).optional(),
    fulfillment_status: z.string().max(80).optional(),
    tracking_number: z.string().max(120).optional().nullable(),
    tracking_url: z.string().url().optional().nullable().or(z.literal('')),
    carrier: z.string().max(80).optional().nullable(),
    support_notes: z.string().max(2000).optional().nullable(),
});

const StorefrontProductSchema = z.object({
    name: z.string().min(2),
    category: z.string().min(1),
    category_label: z.string().min(1),
    price: z.coerce.number().min(0),
    description: z.string().optional().nullable(),
    story: z.string().optional().nullable(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    image_class: z.string().optional(),
    images: z.array(z.object({
        color: z.string().optional(),
        url: z.string().url(),
        alt: z.string().optional(),
    })).optional(),
    badge: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
});

const StorefrontVariantSchema = z.object({
    price: z.coerce.number().min(0).optional(),
    availability_status: z.string().max(80).optional().nullable(),
    is_active: z.boolean().optional(),
});

const RsvpUpdateSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'waitlisted', 'cancelled', 'declined']),
});

const SubmissionUpdateSchema = z.object({
    action: z.enum(['approve', 'reject']),
    review_notes: z.string().max(2000).optional(),
});

const ContentSubmissionUpdateSchema = z.object({
    action: z.enum(['approve', 'reject', 'needs_changes']),
    review_notes: z.string().max(2000).optional(),
});

const ProfileClaimUpdateSchema = z.object({
    action: z.enum(['approve', 'reject']),
    review_notes: z.string().max(2000).optional(),
});

// Helper to get keys (Safe inline)
const getKeys = () => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) throw new Error('Missing Supabase keys');
    return { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
};

async function getAuthenticatedUser(authHeader: string) {
    const { supabaseUrl, supabaseAnonKey } = getKeys();
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    return user || null;
}

async function isAdmin(authHeader: string): Promise<boolean> {
    const user = await getAuthenticatedUser(authHeader);
    const email = user?.email?.toLowerCase();
    if (!user || !email) return false;
    if (ADMIN_EMAILS.includes(email) || SUPERADMIN_EMAILS.includes(email)) return true;

    const { supabaseUrl, supabaseServiceKey } = getKeys();
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    const { data } = await supabase
        .from('members')
        .select('member_role, admin_permissions')
        .eq('user_id', user.id)
        .maybeSingle();
    return data?.member_role === 'admin';
}

async function replaceEventDjs(supabase: any, eventId: number, djs?: z.infer<typeof EventSchema>['djs']) {
    if (!djs) return;
    await supabase.from('event_djs').delete().eq('event_id', eventId);
    const rows = djs
        .map((dj) => ({
            event_id: eventId,
            dj_name: dj.dj_name.trim(),
            dj_description: dj.dj_description || null,
            is_resident: dj.is_resident || false,
        }))
        .filter((dj) => dj.dj_name);
    if (rows.length > 0) {
        const { error } = await supabase.from('event_djs').insert(rows);
        if (error) throw error;
    }
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

    try {
        if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
            const { supabaseUrl, supabaseServiceKey } = getKeys();
            const supabase = createClient(supabaseUrl, supabaseServiceKey, {
                auth: { persistSession: false }
            });
            const result = await syncPrintfulProducts(supabase);
            return res.status(200).json({ success: true, ...result });
        }

        if (!(await isAdmin(authHeader))) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { supabaseUrl, supabaseServiceKey } = getKeys();
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false }
        });

        const { resource, id } = req.query;

        try {
            // --- Stats (Default) ---
            if (!resource || resource === 'stats') {
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

                const [eventsResult, membersResult, rsvpsResult] = await Promise.all([
                    supabase.from('events').select('id', { count: 'exact', head: true }),
                    supabase.from('members').select('id', { count: 'exact', head: true }),
                    supabase.from('rsvps').select('id', { count: 'exact', head: true }),
                ]);
                const [ordersResult, failedOrdersResult, eventSubmissionsResult] = await Promise.all([
                    supabase.from('merch_orders').select('id', { count: 'exact', head: true }),
                    supabase.from('merch_orders').select('id', { count: 'exact', head: true }).eq('status_v2', 'failed'),
                    supabase.from('event_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                ]);
                const [creatorProfilesResult, pendingProfilesResult] = await Promise.all([
                    supabase.from('creator_profiles').select('id', { count: 'exact', head: true }),
                    supabase.from('creator_profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                ]);
                const [contentSubmissionsResult, profileClaimsResult] = await Promise.all([
                    supabase.from('content_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('profile_claims').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                ]);
                const [playlistsResult, playlistSuggestionsResult] = await Promise.all([
                    supabase.from('music_playlists').select('id', { count: 'exact', head: true }),
                    supabase.from('playlist_suggestions').select('id', { count: 'exact', head: true }).in('status', ['pending', 'shortlisted']),
                ]);
                const adminAccessRequestsResult = await supabase
                    .from('admin_access_requests')
                    .select('id', { count: 'exact', head: true })
                    .eq('status', 'pending');

                return res.status(200).json({
                    totalEvents: eventsResult.count || 0,
                    totalMembers: membersResult.count || 0,
                    totalRsvps: rsvpsResult.count || 0,
                    totalOrders: ordersResult.count || 0,
                    failedOrders: failedOrdersResult.count || 0,
                    pendingEventSubmissions: eventSubmissionsResult.count || 0,
                    totalCreatorProfiles: creatorProfilesResult.count || 0,
                    pendingCreatorProfiles: pendingProfilesResult.count || 0,
                    pendingContentSubmissions: contentSubmissionsResult.count || 0,
                    pendingProfileClaims: profileClaimsResult.count || 0,
                    totalPlaylists: playlistsResult.count || 0,
                    pendingPlaylistSuggestions: playlistSuggestionsResult.count || 0,
                    pendingAdminAccessRequests: adminAccessRequestsResult.count || 0,
                });
            }

            if (resource === 'music_playlists') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase.from('music_playlists').select('*').order('created_at', { ascending: false }).limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'POST') {
                    const parseResult = PlaylistSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid playlist', details: parseResult.error.issues });
                    const payload = { ...parseResult.data, embed_url: parseResult.data.embed_url || null, cover_url: parseResult.data.cover_url || null, published_at: parseResult.data.is_published === false ? null : new Date().toISOString() };
                    const { data, error } = await supabase.from('music_playlists').insert(payload).select('*').single();
                    if (error) throw error;
                    return res.status(201).json(data);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = PlaylistSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid playlist', details: parseResult.error.issues });
                    const payload = { ...parseResult.data, embed_url: parseResult.data.embed_url || null, cover_url: parseResult.data.cover_url || null, updated_at: new Date().toISOString() };
                    const { data, error } = await supabase.from('music_playlists').update(payload).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('music_playlists').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            if (resource === 'galleries') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase
                        .from('galleries')
                        .select('*, events(id, title, event_date), event_gallery_images(*)')
                        .order('created_at', { ascending: false })
                        .limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'POST') {
                    const parseResult = GallerySchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid gallery', details: parseResult.error.issues });
                    const payload = cleanGallery(parseResult.data);
                    const { data, error } = await supabase.from('galleries').insert(payload).select('*').single();
                    if (error) throw error;
                    return res.status(201).json(data);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = GallerySchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid gallery', details: parseResult.error.issues });
                    const payload = { ...cleanGallery(parseResult.data), updated_at: new Date().toISOString() };
                    const { data, error } = await supabase.from('galleries').update(payload).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('galleries').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            if (resource === 'gallery_images') {
                if (req.method === 'POST') {
                    const parseResult = GalleryImageSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid gallery image', details: parseResult.error.issues });
                    const payload = cleanGalleryImage(parseResult.data);
                    const { data, error } = await supabase.from('event_gallery_images').insert(payload).select('*').single();
                    if (error) throw error;
                    return res.status(201).json(data);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = GalleryImageSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid gallery image', details: parseResult.error.issues });
                    const payload = { ...cleanGalleryImage(parseResult.data), updated_at: new Date().toISOString() };
                    const { data, error } = await supabase.from('event_gallery_images').update(payload).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('event_gallery_images').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            if (resource === 'playlist_suggestions') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase.from('playlist_suggestions').select('*, members(first_name, last_name, email), music_playlists(title, slug)').order('vote_count', { ascending: false }).order('created_at', { ascending: false }).limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = PlaylistSuggestionUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid suggestion update', details: parseResult.error.issues });
                    const { data, error } = await supabase.from('playlist_suggestions').update({ status: parseResult.data.status, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'content_submissions') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase.from('content_submissions').select('*, members(email, first_name, last_name), creator_profiles(display_name, slug)').order('created_at', { ascending: false }).limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = ContentSubmissionUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid content review', details: parseResult.error.issues });
                    const { data: submission, error: fetchError } = await supabase.from('content_submissions').select('*').eq('id', parseInt(id as string)).single();
                    if (fetchError) throw fetchError;
                    let createdArticleId = submission.created_article_id;
                    let status = parseResult.data.action === 'approve' ? 'published' : parseResult.data.action;
                    if (parseResult.data.action === 'approve' && !createdArticleId) {
                        const slugBase = (submission.slug || submission.title).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
                        const { data: article, error: articleError } = await supabase.from('articles').insert({
                            title: submission.title,
                            slug: slugBase || `community-${submission.id}`,
                            content: submission.body,
                            excerpt: submission.excerpt,
                            author: submission.contributor_name,
                            featured_image_url: submission.featured_image_url,
                            tags: submission.tags || submission.category,
                            is_published: true,
                            published_at: new Date().toISOString(),
                        }).select('id').single();
                        if (articleError) throw articleError;
                        createdArticleId = article.id;
                    }
                    const { data, error } = await supabase.from('content_submissions').update({
                        status,
                        review_notes: parseResult.data.review_notes || null,
                        created_article_id: createdArticleId || null,
                        reviewed_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'profile_claims') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase.from('profile_claims').select('*, members(email, first_name, last_name), creator_profiles(display_name, slug)').order('created_at', { ascending: false }).limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = ProfileClaimUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid claim review', details: parseResult.error.issues });
                    const { data: claim, error: claimError } = await supabase.from('profile_claims').select('*').eq('id', parseInt(id as string)).single();
                    if (claimError) throw claimError;
                    if (parseResult.data.action === 'approve') {
                        await supabase.from('creator_profiles').update({ member_id: claim.member_id, is_verified: true, status: 'approved', reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', claim.creator_profile_id);
                    }
                    const { data, error } = await supabase.from('profile_claims').update({
                        status: parseResult.data.action === 'approve' ? 'approved' : 'rejected',
                        review_notes: parseResult.data.review_notes || null,
                        reviewed_at: new Date().toISOString(),
                    }).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'creator_profiles') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase
                        .from('creator_profiles')
                        .select('*, members(email, first_name, last_name)')
                        .order('created_at', { ascending: false })
                        .limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'POST') {
                    const parseResult = CreatorProfileAdminSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid profile', details: parseResult.error.issues });
                    const patch = cleanCreatorProfile(parseResult.data);
                    const { data, error } = await supabase.from('creator_profiles').insert({
                        ...patch,
                        reviewed_at: patch.status === 'approved' || patch.status === 'rejected' ? new Date().toISOString() : null,
                    }).select('*').single();
                    if (error) throw error;
                    return res.status(201).json(data);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = CreatorProfileAdminSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid profile', details: parseResult.error.issues });
                    const patch = cleanCreatorProfile(parseResult.data);
                    const { data, error } = await supabase
                        .from('creator_profiles')
                        .update({
                            ...patch,
                            reviewed_at: patch.status === 'approved' || patch.status === 'rejected' ? new Date().toISOString() : null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', parseInt(id as string))
                        .select('*')
                        .single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('creator_profiles').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            if (resource === 'storefront_products') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase
                        .from('merch_products')
                        .select('*, merch_product_variants(*)')
                        .order('is_active', { ascending: false })
                        .order('updated_at', { ascending: false })
                        .limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }

                if (req.method === 'POST' && req.query.action === 'sync_printful') {
                    const result = await syncPrintfulProducts(supabase);
                    await logOrderEvent(supabase, null, 'storefront_products_synced', `Printful catalog synced: ${result.products} products, ${result.variants} variants.`);
                    return res.status(200).json({ success: true, ...result });
                }

                if (req.method === 'PUT' && id) {
                    const parseResult = StorefrontProductSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid product', details: parseResult.error.issues });
                    const product = parseResult.data;
                    const { data, error } = await supabase
                        .from('merch_products')
                        .update({
                            name: product.name,
                            category: product.category,
                            category_label: product.category_label,
                            price: product.price,
                            description: product.description || null,
                            story: product.story || null,
                            colors: product.colors || [],
                            sizes: product.sizes || [],
                            image_class: product.image_class || 'from-neon-red/30 via-black to-white/10',
                            images: product.images || [],
                            badge: product.badge || null,
                            is_active: product.is_active ?? true,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', String(id))
                        .select('*, merch_product_variants(*)')
                        .single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'storefront_variants') {
                if (req.method === 'PUT' && id) {
                    const parseResult = StorefrontVariantSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid variant', details: parseResult.error.issues });
                    const { data, error } = await supabase
                        .from('merch_product_variants')
                        .update({
                            ...parseResult.data,
                            availability_status: parseResult.data.availability_status || null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', String(id))
                        .select('*')
                        .single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'orders') {
                if (req.method === 'GET') {
                    const { data: orders, error } = await supabase
                        .from('merch_orders')
                        .select('*, merch_order_items(*), order_events(*)')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(orders || []);
                }

                if (req.method === 'POST' && id && req.query.action === 'resend') {
                    const { data: order, error } = await supabase
                        .from('merch_orders')
                        .select('*, merch_order_items(*)')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (error) throw error;
                    if (!order.customer_email) return res.status(400).json({ error: 'Order has no customer email' });

                    await sendBrandedEmail({
                        to: order.customer_email,
                        subject: 'Your ILHH order status',
                        preview: 'Here is the latest status for your merch order.',
                        from: emailSenders.orders,
                        eyebrow: 'Order Update',
                        title: 'Latest order status',
                        intro: 'Here is the current status for your ILHH merch order.',
                        sections: [
                            { title: 'Order', rows: [['Order', order.public_id], ['Payment status', order.status_v2], ['Fulfillment status', order.fulfillment_status], ['Tracking', order.tracking_url || order.tracking_number]] },
                        ],
                        action: { label: 'View Order Status', url: siteUrl(`/order/${order.public_id}`) },
                    });

                    await supabase.from('order_events').insert({
                        order_id: order.id,
                        event_type: 'manual_email_resend',
                        message: 'Admin resent order status email.',
                    });

                    return res.status(200).json({ success: true });
                }

                if (req.method === 'POST' && id && req.query.action === 'sync_printful') {
                    const { data: order, error } = await supabase
                        .from('merch_orders')
                        .select('*, merch_order_items(*)')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (error) throw error;
                    const updated = await syncPrintfulOrderStatus(supabase, order);
                    return res.status(200).json(updated);
                }

                if (req.method === 'PUT' && id) {
                    const parseResult = OrderUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid order update', details: parseResult.error.issues });
                    const patch = { ...parseResult.data, tracking_url: parseResult.data.tracking_url || null, updated_at: new Date().toISOString() };
                    const { data: order, error } = await supabase
                        .from('merch_orders')
                        .update(patch)
                        .eq('id', parseInt(id as string))
                        .select('*, merch_order_items(*)')
                        .single();
                    if (error) throw error;
                    await logOrderEvent(supabase, order.id, 'manual_order_update', 'Admin updated order status/tracking.', 'info', parseResult.data);
                    return res.status(200).json(order);
                }
            }

            if (resource === 'rsvps') {
                if (req.method === 'GET') {
                    const { data: rsvps, error } = await supabase
                        .from('rsvps')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(rsvps || []);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = RsvpUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid RSVP update', details: parseResult.error.issues });
                    const { data: rsvp, error } = await supabase
                        .from('rsvps')
                        .update({ status: parseResult.data.status, updated_at: new Date().toISOString() })
                        .eq('id', parseInt(id as string))
                        .select('*')
                        .single();
                    if (error) throw error;
                    if (rsvp.email) {
                        await sendBrandedEmail({
                            to: rsvp.email,
                            subject: 'RSVP status update | This Is Hip Hop Caribbean Events',
                            preview: `Your RSVP is now ${parseResult.data.status}.`,
                            from: emailSenders.events,
                            eyebrow: 'RSVP Update',
                            title: 'RSVP status updated',
                            intro: `Your RSVP status is now ${parseResult.data.status.replace(/_/g, ' ')}.`,
                            sections: [{ title: 'RSVP', rows: [['Name', rsvp.name], ['Package', rsvp.package_type], ['Status', parseResult.data.status]] }],
                        });
                    }
                    return res.status(200).json(rsvp);
                }
            }

            if (resource === 'event_submissions') {
                if (req.method === 'GET') {
                    const { data: submissions, error } = await supabase
                        .from('event_submissions')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) throw error;
                    return res.status(200).json(submissions || []);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = SubmissionUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid submission update', details: parseResult.error.issues });

                    const { data: submission, error: fetchError } = await supabase
                        .from('event_submissions')
                        .select('*')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (fetchError) throw fetchError;

                    let createdEventId = submission.created_event_id;
                    if (parseResult.data.action === 'approve' && !createdEventId) {
                        const { data: event, error: eventError } = await supabase
                            .from('events')
                            .insert({
                                title: submission.event_title,
                                description: [submission.lineup, submission.notes, submission.event_url].filter(Boolean).join('\n\n') || null,
                                event_date: submission.event_date,
                                event_time: submission.event_time || null,
                                venue_name: submission.venue_name,
                                venue_address: submission.venue_address || submission.city_country,
                                flyer_url: submission.flyer_url || null,
                                theme: submission.event_type || null,
                            })
                            .select('id')
                            .single();
                        if (eventError) throw eventError;
                        createdEventId = event.id;
                    }

                    const nextStatus = parseResult.data.action === 'approve' ? 'approved' : 'rejected';
                    const { data: updated, error } = await supabase
                        .from('event_submissions')
                        .update({
                            status: nextStatus,
                            review_notes: parseResult.data.review_notes || null,
                            reviewed_at: new Date().toISOString(),
                            reviewed_by: 'admin',
                            created_event_id: createdEventId || null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', parseInt(id as string))
                        .select('*')
                        .single();
                    if (error) throw error;

                    if (updated.promoter_email) {
                        await sendBrandedEmail({
                            to: updated.promoter_email,
                            subject: `Event submission ${nextStatus} | This Is Hip Hop Caribbean Events`,
                            preview: `${updated.event_title} has been ${nextStatus}.`,
                            from: emailSenders.events,
                            eyebrow: 'Event Submission',
                            title: `Submission ${nextStatus}`,
                            intro: nextStatus === 'approved' ? 'Your event has been approved and added to the platform.' : 'Your event submission was reviewed but not approved for publishing at this time.',
                            sections: [{ title: 'Event', rows: [['Event', updated.event_title], ['Date', updated.event_date], ['Venue', updated.venue_name], ['Notes', parseResult.data.review_notes]] }],
                            action: nextStatus === 'approved' ? { label: 'View Events', url: siteUrl('/events') } : undefined,
                        });
                    }
                    return res.status(200).json(updated);
                }
            }

            if (resource === 'support_requests') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false }).limit(100);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }
                if (req.method === 'PUT' && id) {
                    const status = String(req.body?.status || '');
                    if (!['open', 'in_review', 'waiting_customer', 'resolved', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid support status' });
                    const { data, error } = await supabase.from('support_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', parseInt(id as string)).select('*').single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'analytics') {
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
                const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
                const { data, error } = await supabase.from('analytics_events').select('event_name, created_at, properties').gte('created_at', since).limit(1000);
                if (error) throw error;
                const counts = ((data || []) as Array<{ event_name: string }>).reduce<Record<string, number>>((acc, item) => {
                    acc[item.event_name] = (acc[item.event_name] || 0) + 1;
                    return acc;
                }, {});
                return res.status(200).json({ counts, recent: data || [] });
            }

            if (resource === 'affiliate_commissions') {
                if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
                const { data, error } = await supabase.from('affiliate_commissions').select('*').order('created_at', { ascending: false }).limit(200);
                if (error) throw error;
                return res.status(200).json(data || []);
            }

            if (resource === 'admin_users') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase
                        .from('members')
                        .select('id, user_id, email, first_name, last_name, instagram_handle, member_role, admin_permissions, created_at')
                        .order('created_at', { ascending: false })
                        .limit(300);
                    if (error) throw error;
                    return res.status(200).json((data || []).map((member: any) => {
                        const email = String(member.email || '').toLowerCase();
                        const isSuperadmin = SUPERADMIN_EMAILS.includes(email);
                        const isBootstrapAdmin = ADMIN_EMAILS.includes(email) || isSuperadmin;
                        return {
                            ...member,
                            member_role: isSuperadmin ? 'admin' : member.member_role,
                            admin_permissions: isSuperadmin ? [...ADMIN_PERMISSION_KEYS] : (member.admin_permissions || []),
                            is_bootstrap_admin: isBootstrapAdmin,
                            is_superadmin: isSuperadmin,
                        };
                    }));
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = AdminUserUpdateSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid admin user update', details: parseResult.error.issues });
                    const { data: existingMember, error: existingError } = await supabase
                        .from('members')
                        .select('email')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (existingError) throw existingError;
                    if (SUPERADMIN_EMAILS.includes(String(existingMember.email || '').toLowerCase())) {
                        return res.status(403).json({ error: 'Superadmin access cannot be changed from the admin console.' });
                    }

                    const { data, error } = await supabase
                        .from('members')
                        .update({
                            member_role: parseResult.data.member_role,
                            admin_permissions: parseResult.data.member_role === 'admin' ? (parseResult.data.admin_permissions || []) : [],
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', parseInt(id as string))
                        .select('id, email, first_name, last_name, member_role, admin_permissions')
                        .single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
            }

            if (resource === 'admin_access_requests') {
                if (req.method === 'GET') {
                    const { data, error } = await supabase
                        .from('admin_access_requests')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(200);
                    if (error) throw error;
                    return res.status(200).json(data || []);
                }

                if (req.method === 'PUT' && id) {
                    const parseResult = AdminAccessReviewSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid admin access review', details: parseResult.error.issues });

                    const { data: request, error: requestError } = await supabase
                        .from('admin_access_requests')
                        .select('*')
                        .eq('id', parseInt(id as string))
                        .single();
                    if (requestError) throw requestError;

                    const email = String(request.email || '').toLowerCase();
                    const permissions = parseResult.data.admin_permissions?.length
                        ? parseResult.data.admin_permissions
                        : (request.requested_permissions || []);
                    let memberId = request.member_id;

                    if (parseResult.data.action === 'approve') {
                        const { data: member } = await supabase
                            .from('members')
                            .select('id, email')
                            .eq('email', email)
                            .maybeSingle();
                        memberId = member?.id || memberId || null;
                        if (memberId) {
                            const { error: memberError } = await supabase
                                .from('members')
                                .update({
                                    member_role: 'admin',
                                    admin_permissions: permissions,
                                    updated_at: new Date().toISOString(),
                                })
                                .eq('id', memberId);
                            if (memberError) throw memberError;
                        }
                    }

                    const nextStatus = parseResult.data.action === 'approve' ? 'approved' : 'rejected';
                    const { data: updated, error } = await supabase
                        .from('admin_access_requests')
                        .update({
                            status: nextStatus,
                            member_id: memberId,
                            review_notes: parseResult.data.review_notes || null,
                            reviewed_at: new Date().toISOString(),
                            reviewed_by: 'admin',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', parseInt(id as string))
                        .select('*')
                        .single();
                    if (error) throw error;

                    await sendBrandedEmail({
                        to: updated.email,
                        subject: `Admin access ${nextStatus} | This Is Hip Hop Caribbean`,
                        preview: `Your admin access request was ${nextStatus}.`,
                        from: emailSenders.ops,
                        eyebrow: 'Admin Access',
                        title: `Request ${nextStatus}`,
                        intro: nextStatus === 'approved'
                            ? memberId
                                ? 'Your account has been approved for platform admin access. Sign in with the same email and open the admin console.'
                                : 'Your admin access request was approved. Create or complete your membership with this same email so we can attach the approved permissions.'
                            : 'Your admin access request was reviewed and not approved at this time.',
                        sections: [{ title: 'Review', rows: [['Status', nextStatus], ['Permissions', permissions.join(', ') || 'General admin'], ['Notes', parseResult.data.review_notes]] }],
                        action: nextStatus === 'approved' ? { label: memberId ? 'Open Admin' : 'Complete Membership', url: siteUrl(memberId ? '/admin' : '/membership') } : undefined,
                    });

                    return res.status(200).json(updated);
                }
            }

            // --- Events ---
            if (resource === 'events') {
                if (req.method === 'GET') {
                    const { data: events, error } = await supabase
                        .from('events')
                        .select('*, event_djs (*)')
                        .order('event_date', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(events || []);
                }
                if (req.method === 'POST') {
                    const parseResult = EventSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { djs, ...eventPayload } = parseResult.data;
                    const { data: event, error } = await supabase.from('events').insert(eventPayload).select().single();
                    if (error) throw error;
                    await replaceEventDjs(supabase, event.id, djs);
                    return res.status(201).json(event);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = EventSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { djs, ...eventPayload } = parseResult.data;
                    const { data: event, error } = await supabase.from('events').update(eventPayload).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    await replaceEventDjs(supabase, event.id, djs);
                    return res.status(200).json(event);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('events').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            // --- Articles ---
            if (resource === 'articles') {
                if (req.method === 'GET') {
                    const { data: articles, error } = await supabase
                        .from('articles')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(articles || []);
                }
                if (req.method === 'POST') {
                    const parseResult = ArticleSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const data = { ...parseResult.data, published_at: parseResult.data.is_published ? new Date().toISOString() : null };
                    const { data: article, error } = await supabase.from('articles').insert(data).select().single();
                    if (error) throw error;
                    return res.status(201).json(article);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = ArticleSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const data = { ...parseResult.data, published_at: parseResult.data.is_published ? new Date().toISOString() : null };
                    const { data: article, error } = await supabase.from('articles').update(data).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    return res.status(200).json(article);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('articles').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            // --- Mixtapes ---
            if (resource === 'mixtapes') {
                if (req.method === 'GET') {
                    const { data: mixtapes, error } = await supabase
                        .from('mixtapes')
                        .select('*')
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    return res.status(200).json(mixtapes || []);
                }
                if (req.method === 'POST') {
                    const parseResult = MixtapeSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: mixtape, error } = await supabase.from('mixtapes').insert(parseResult.data).select().single();
                    if (error) throw error;
                    return res.status(201).json(mixtape);
                }
                if (req.method === 'PUT' && id) {
                    const parseResult = MixtapeSchema.safeParse(req.body);
                    if (!parseResult.success) return res.status(400).json({ error: 'Invalid data', details: parseResult.error.issues });
                    const { data: mixtape, error } = await supabase.from('mixtapes').update(parseResult.data).eq('id', parseInt(id as string)).select().single();
                    if (error) throw error;
                    return res.status(200).json(mixtape);
                }
                if (req.method === 'DELETE' && id) {
                    const { error } = await supabase.from('mixtapes').delete().eq('id', parseInt(id as string));
                    if (error) throw error;
                    return res.status(200).json({ success: true });
                }
            }

            return res.status(404).json({ error: 'Resource not found' });
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Admin request failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Admin request failed' });
    }
}
