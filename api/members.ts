import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerClient, createUserClient } from './_lib/supabase.js';
import { z } from 'zod';
import { adminEmails, emailSenders, sendBrandedEmail, siteUrl } from './_lib/email.js';
import { enforceRateLimit } from './_lib/rate-limit.js';
import { trackAnalyticsEvent } from './_lib/analytics.js';

const MemberSchema = z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    instagram_handle: z.string().optional(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    favorite_songs: z.string().optional(),
    favorite_albums: z.string().optional(),
    favorite_lyrics: z.string().optional(),
    favorite_djs: z.string().optional(),
    favorite_genre: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    is_public: z.boolean().optional(),
    profile_visibility: z.enum(['public', 'members', 'private']).optional(),
    member_role: z.enum(['fan', 'dj', 'artist', 'promoter', 'venue', 'media', 'admin']).optional(),
    discovery_city: z.string().optional(),
    interest_tags: z.string().optional(),
    onboarding_completed: z.boolean().optional(),
});

const CreatorProfileSubmitSchema = z.object({
    profile_type: z.enum(['dj', 'artist', 'promoter', 'venue', 'community']),
    display_name: z.string().min(2),
    tagline: z.string().optional(),
    bio: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    avatar_url: z.string().optional(),
    cover_url: z.string().optional(),
    instagram_handle: z.string().optional(),
    tiktok_handle: z.string().optional(),
    youtube_url: z.string().optional(),
    soundcloud_url: z.string().optional(),
    spotify_url: z.string().optional(),
    website_url: z.string().optional(),
    booking_email: z.string().optional(),
    booking_phone: z.string().optional(),
    specialties: z.string().optional(),
    notable_credits: z.string().optional(),
    equipment_or_services: z.string().optional(),
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action } = req.query;
    const authHeader = req.headers.authorization;

    // GET /api/members?action=community - public community list
    if (req.method === 'GET' && action === 'community') {
        try {
            const supabase = createUserClient();
            const { data: members, error } = await supabase
                .from('members')
                .select('id, first_name, last_name, instagram_handle, location, bio, favorite_songs, favorite_albums, favorite_djs, avatar_url, member_role, created_at')
                .not('first_name', 'is', null)
                .eq('is_public', true)
                .eq('profile_visibility', 'public')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json(members || []);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // All other operations require auth
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }

    try {
        const supabaseUser = createUserClient(authHeader);
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const supabase = createServerClient();
        const { data: currentMember } = await supabase
            .from('members')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (req.method === 'GET' && action === 'dashboard') {
            if (!currentMember) return res.status(200).json({ member: null });
            const [engagements, profiles, contentSubmissions, claims, playlistSuggestions, featuredPlaylists] = await Promise.all([
                supabase.from('user_engagements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(200),
                supabase.from('creator_profiles').select('*').eq('member_id', currentMember.id).order('created_at', { ascending: false }),
                supabase.from('content_submissions').select('*').eq('member_id', currentMember.id).order('created_at', { ascending: false }).limit(20),
                supabase.from('profile_claims').select('*, creator_profiles(display_name, slug)').eq('member_id', currentMember.id).order('created_at', { ascending: false }).limit(20),
                supabase.from('playlist_suggestions').select('*').eq('member_id', currentMember.id).order('created_at', { ascending: false }).limit(20),
                supabase.from('music_playlists').select('*').eq('is_published', true).order('is_featured', { ascending: false }).order('published_at', { ascending: false }).limit(6),
            ]);
            const creatorProfileIds = (profiles.data || []).map((profile) => String(profile.id));
            let creatorEngagements: Array<{ target_id: string; engagement_type: string; created_at: string }> = [];
            if (creatorProfileIds.length > 0) {
                const { data } = await supabase
                    .from('user_engagements')
                    .select('target_id, engagement_type, created_at')
                    .eq('target_type', 'creator_profile')
                    .in('target_id', creatorProfileIds)
                    .order('created_at', { ascending: false });
                creatorEngagements = data || [];
            }
            const statsByProfile = creatorProfileIds.reduce<Record<string, Record<string, number>>>((acc, id) => {
                acc[id] = {};
                return acc;
            }, {});
            creatorEngagements.forEach((row) => {
                statsByProfile[row.target_id][row.engagement_type] = (statsByProfile[row.target_id][row.engagement_type] || 0) + 1;
            });
            return res.status(200).json({
                member: currentMember,
                library: engagements.data || [],
                creatorProfiles: (profiles.data || []).map((profile) => ({ ...profile, stats: statsByProfile[String(profile.id)] || {} })),
                recentPublicFans: creatorEngagements.slice(0, 20),
                contentSubmissions: contentSubmissions.data || [],
                claims: claims.data || [],
                playlistSuggestions: playlistSuggestions.data || [],
                featuredPlaylists: featuredPlaylists.data || [],
            });
        }

        if (req.method === 'POST' && action === 'creator_profile') {
            if (!currentMember) return res.status(400).json({ error: 'Complete your membership profile first.' });
            const parseResult = CreatorProfileSubmitSchema.safeParse(req.body);
            if (!parseResult.success) return res.status(400).json({ error: 'Invalid profile', details: parseResult.error.issues });
            const data = parseResult.data;
            const slugBase = slugify(data.display_name) || `profile-${Date.now()}`;
            let slug = slugBase;
            let suffix = 2;
            while (true) {
                const { data: existing } = await supabase.from('creator_profiles').select('id').eq('slug', slug).maybeSingle();
                if (!existing) break;
                slug = `${slugBase}-${suffix}`;
                suffix += 1;
            }
            const { data: profile, error } = await supabase.from('creator_profiles').insert({
                member_id: currentMember.id,
                status: 'pending',
                profile_type: data.profile_type,
                display_name: data.display_name,
                slug,
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
            }).select('*').single();
            if (error) throw error;
            return res.status(201).json({ success: true, profile });
        }

        if (req.method === 'POST' && action === 'content_submission') {
            if (!currentMember) return res.status(400).json({ error: 'Complete membership first' });
            const data = req.body || {};
            if (!data.title || !data.body || !data.contributor_name || !data.contributor_email) return res.status(400).json({ error: 'Missing required fields' });
            const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'content_submission', limit: 6, windowSeconds: 60 * 60 });
            if (!rateLimit.allowed) return res.status(429).json({ error: 'Too many submissions. Try again later.' });
            const { data: submission, error } = await supabase.from('content_submissions').insert({
                member_id: currentMember.id,
                creator_profile_id: data.creator_profile_id || null,
                submission_type: data.submission_type || 'article',
                title: data.title,
                excerpt: data.excerpt || null,
                body: data.body,
                category: data.category || null,
                featured_image_url: data.featured_image_url || null,
                tags: data.tags || null,
                contributor_name: data.contributor_name,
                contributor_email: data.contributor_email,
            }).select('*').single();
            if (error) throw error;
            return res.status(201).json({ success: true, submission });
        }

        if (req.method === 'POST' && action === 'profile_claim') {
            if (!currentMember) return res.status(400).json({ error: 'Complete membership first' });
            const creatorProfileId = Number(req.body?.creator_profile_id);
            const evidence = String(req.body?.evidence || '');
            if (!creatorProfileId || evidence.length < 10) return res.status(400).json({ error: 'Profile and evidence are required' });
            const { data: claim, error } = await supabase.from('profile_claims').upsert({
                member_id: currentMember.id,
                creator_profile_id: creatorProfileId,
                evidence,
                status: 'pending',
            }, { onConflict: 'member_id,creator_profile_id' }).select('*, creator_profiles(display_name, slug)').single();
            if (error) throw error;
            return res.status(201).json({ success: true, claim });
        }

        // GET /api/members?action=me - get current user's profile
        if (req.method === 'GET' && action === 'me') {
            const { data: member, error } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json(member || null);
        }

        // PUT /api/members?action=me - update current user's profile
        if (req.method === 'PUT' && action === 'me') {
            const parseResult = MemberSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid request data', details: parseResult.error.issues });
            }

            const data = parseResult.data;
            await supabase
                .from('members')
                .update({
                    email: data.email,
                    phone: data.phone || null,
                    instagram_handle: data.instagram_handle || null,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    favorite_songs: data.favorite_songs || null,
                    favorite_albums: data.favorite_albums || null,
                    favorite_lyrics: data.favorite_lyrics || null,
                    favorite_djs: data.favorite_djs || null,
                    favorite_genre: data.favorite_genre || null,
                    bio: data.bio || null,
                    location: data.location || null,
                    is_public: data.is_public ?? true,
                    profile_visibility: data.profile_visibility || 'public',
                    member_role: data.member_role || 'fan',
                    discovery_city: data.discovery_city || data.location || null,
                    interest_tags: data.interest_tags || null,
                    onboarding_completed: data.onboarding_completed ?? false,
                    onboarding_completed_at: data.onboarding_completed ? new Date().toISOString() : null,
                })
                .eq('user_id', user.id);

            const { data: member } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            return res.status(200).json({ success: true, member });
        }

        // POST /api/members - create new member
        if (req.method === 'POST') {
            const parseResult = MemberSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(400).json({ error: 'Invalid request data', details: parseResult.error.issues });
            }

            const data = parseResult.data;

            const rateLimit = await enforceRateLimit(req, supabase, { bucket: 'membership_create', limit: 5, windowSeconds: 60 * 60 });
            if (!rateLimit.allowed) {
                return res.status(429).json({ error: 'Too many membership attempts. Try again later.' });
            }

            // Check if member already exists
            const { data: existing } = await supabase
                .from('members')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existing) {
                return res.status(400).json({ error: 'Membership already exists' });
            }

            const { data: member, error } = await supabase
                .from('members')
                .insert({
                    user_id: user.id,
                    email: data.email,
                    phone: data.phone || null,
                    instagram_handle: data.instagram_handle || null,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    favorite_songs: data.favorite_songs || null,
                    favorite_albums: data.favorite_albums || null,
                    favorite_lyrics: data.favorite_lyrics || null,
                    favorite_djs: data.favorite_djs || null,
                    favorite_genre: data.favorite_genre || null,
                    bio: data.bio || null,
                    location: data.location || null,
                    is_public: data.is_public ?? true,
                    profile_visibility: data.profile_visibility || 'public',
                    member_role: data.member_role || 'fan',
                    discovery_city: data.discovery_city || data.location || null,
                    interest_tags: data.interest_tags || null,
                    onboarding_completed: data.onboarding_completed ?? false,
                    onboarding_completed_at: data.onboarding_completed ? new Date().toISOString() : null,
                })
                .select('id')
                .single();

            if (error) return res.status(500).json({ error: error.message });

            await Promise.all([
                sendBrandedEmail({
                    to: data.email,
                    subject: 'Welcome to This Is Hip Hop Caribbean',
                    preview: 'Your member profile is live.',
                    from: emailSenders.membership,
                    eyebrow: 'Membership',
                    title: 'Welcome to the movement',
                    intro: 'Your member profile has been created. You can update your details, keep your favorites fresh, and stay close to upcoming drops and events.',
                    sections: [
                        {
                            title: 'Profile',
                            rows: [
                                ['Name', `${data.first_name} ${data.last_name}`],
                                ['Location', data.location],
                                ['Instagram', data.instagram_handle],
                                ['Favorite genre', data.favorite_genre],
                            ],
                        },
                    ],
                    action: { label: 'View Membership', url: siteUrl('/membership') },
                }),
                sendBrandedEmail({
                    to: adminEmails,
                    subject: `New member: ${data.first_name} ${data.last_name}`,
                    preview: `${data.first_name} ${data.last_name} joined the member community.`,
                    from: emailSenders.ops,
                    eyebrow: 'Admin Alert',
                    title: 'New member profile',
                    intro: 'A new member profile was created.',
                    sections: [
                        {
                            title: 'Member',
                            rows: [
                                ['Name', `${data.first_name} ${data.last_name}`],
                                ['Email', data.email],
                                ['Phone', data.phone],
                                ['Instagram', data.instagram_handle],
                                ['Location', data.location],
                            ],
                        },
                    ],
                    replyTo: data.email,
                }),
            ]);
            await trackAnalyticsEvent(supabase, req, {
                eventName: 'member_joined',
                email: data.email,
                userId: user.id,
                properties: { memberId: member.id, location: data.location || null },
            });

            return res.status(201).json({ success: true, id: member.id });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
