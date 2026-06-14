-- Creator and community profile foundation.
-- Apply in Supabase SQL Editor before deploying the profile UX.

CREATE TABLE IF NOT EXISTS creator_profiles (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  profile_type TEXT NOT NULL DEFAULT 'dj' CHECK (profile_type IN ('dj', 'artist', 'promoter', 'venue', 'community')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  bio TEXT,
  city TEXT,
  country TEXT DEFAULT 'Jamaica',
  avatar_url TEXT,
  cover_url TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_url TEXT,
  soundcloud_url TEXT,
  spotify_url TEXT,
  website_url TEXT,
  booking_email TEXT,
  booking_phone TEXT,
  specialties TEXT,
  notable_credits TEXT,
  equipment_or_services TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_status ON creator_profiles(status);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_profile_type ON creator_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_featured ON creator_profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_member_id ON creator_profiles(member_id);

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'members', 'private')),
  ADD COLUMN IF NOT EXISTS member_role TEXT DEFAULT 'fan' CHECK (member_role IN ('fan', 'dj', 'artist', 'promoter', 'venue', 'media', 'admin'));

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved creator profiles are viewable by everyone" ON creator_profiles;
CREATE POLICY "Approved creator profiles are viewable by everyone"
  ON creator_profiles FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Members can view own creator profiles" ON creator_profiles;
CREATE POLICY "Members can view own creator profiles"
  ON creator_profiles FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Members can create own creator profiles" ON creator_profiles;
CREATE POLICY "Members can create own creator profiles"
  ON creator_profiles FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Members can update own non-approved creator profiles" ON creator_profiles;
CREATE POLICY "Members can update own non-approved creator profiles"
  ON creator_profiles FOR UPDATE
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()) AND status IN ('draft', 'pending', 'rejected'));

DROP POLICY IF EXISTS "Users can view public member profiles" ON members;
CREATE POLICY "Users can view public member profiles"
  ON members FOR SELECT
  USING (first_name IS NOT NULL AND COALESCE(is_public, true) = true AND COALESCE(profile_visibility, 'public') = 'public');
