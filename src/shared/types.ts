import z from "zod";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  event_date: z.string(),
  event_time: z.string().nullable(),
  venue_name: z.string().nullable(),
  venue_address: z.string().nullable(),
  theme: z.string().nullable(),
  sub_theme: z.string().nullable(),
  flyer_url: z.string().nullable(),
  is_featured: z.number(),
  is_special: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const DJSchema = z.object({
  id: z.number(),
  dj_name: z.string(),
  dj_description: z.string().nullable(),
  is_resident: z.number(),
});

export const EventWithDJsSchema = EventSchema.extend({
  djs: z.array(DJSchema),
});

export const MemberSchema = z.object({
  id: z.number(),
  user_id: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  instagram_handle: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  favorite_songs: z.string().nullable(),
  favorite_albums: z.string().nullable(),
  favorite_lyrics: z.string().nullable(),
  favorite_djs: z.string().nullable(),
  favorite_genre: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const RsvpSchema = z.object({
  id: z.number(),
  event_id: z.number(),
  member_id: z.number().nullable(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  package_type: z.string(),
  group_size: z.number().nullable(),
  bottle_selection: z.string().nullable(),
  special_notes: z.string().nullable(),
  status: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  author: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  tags: z.string().nullable(),
  is_published: z.number(),
  published_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const MixtapeSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullable().optional(),
  dj_name: z.string(),
  cover_art_url: z.string().nullable(),
  embed_url: z.string().nullable(),
  audio_url: z.string().nullable().optional(),
  download_url: z.string().nullable().optional(),
  description: z.string().nullable(),
  release_date: z.string().nullable(),
  duration_seconds: z.number().nullable().optional(),
  genre: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  is_downloadable: z.union([z.number(), z.boolean()]).optional(),
  play_count: z.number(),
  download_count: z.number().optional(),
  uploaded_by: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GallerySchema = z.object({
  id: z.number(),
  partner_name: z.string(),
  partner_logo_url: z.string().nullable(),
  partner_instagram: z.string().nullable(),
  gallery_url: z.string().nullable(),
  event_id: z.number().nullable(),
  description: z.string().nullable(),
  featured_image_url: z.string().nullable(),
  is_featured: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const HappyHourCouponSchema = z.object({
  id: z.number(),
  member_id: z.number().nullable(),
  coupon_code: z.string(),
  event_id: z.number().nullable(),
  is_redeemed: z.number(),
  redeemed_at: z.string().nullable(),
  valid_from: z.string(),
  valid_until: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const EventSubmissionSchema = z.object({
  id: z.number(),
  event_title: z.string(),
  event_date: z.string(),
  event_time: z.string().nullable(),
  venue_name: z.string(),
  venue_address: z.string().nullable(),
  city_country: z.string(),
  event_type: z.string(),
  lineup: z.string().nullable(),
  promoter_name: z.string(),
  promoter_email: z.string(),
  promoter_phone: z.string().nullable(),
  instagram_handle: z.string().nullable(),
  flyer_url: z.string().nullable(),
  event_url: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.string(),
  reviewed_at: z.string().nullable(),
  created_event_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Event = z.infer<typeof EventSchema>;
export type DJ = z.infer<typeof DJSchema>;
export type EventWithDJs = z.infer<typeof EventWithDJsSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Rsvp = z.infer<typeof RsvpSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Mixtape = z.infer<typeof MixtapeSchema>;
export type Gallery = z.infer<typeof GallerySchema>;
export type HappyHourCoupon = z.infer<typeof HappyHourCouponSchema>;
export type EventSubmission = z.infer<typeof EventSubmissionSchema>;
