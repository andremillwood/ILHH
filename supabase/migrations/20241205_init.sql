-- Supabase Migration: I Luv Hip Hop
-- Converted from Cloudflare D1 (SQLite) to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram_handle TEXT,
  first_name TEXT,
  last_name TEXT,
  favorite_songs TEXT,
  favorite_albums TEXT,
  favorite_lyrics TEXT,
  favorite_djs TEXT,
  favorite_genre TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_email ON members(email);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  venue_name TEXT,
  venue_address TEXT,
  theme TEXT,
  sub_theme TEXT,
  flyer_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_special BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(event_date);

-- Event DJs table
CREATE TABLE event_djs (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  dj_name TEXT NOT NULL,
  dj_description TEXT,
  is_resident BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_djs_event_id ON event_djs(event_id);

-- RSVPs table
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package_type TEXT NOT NULL,
  group_size INTEGER,
  bottle_selection TEXT,
  special_notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_member_id ON rsvps(member_id);

-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  featured_image_url TEXT,
  tags TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published);

-- Mixtapes table
CREATE TABLE mixtapes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  dj_name TEXT NOT NULL,
  cover_art_url TEXT,
  embed_url TEXT,
  description TEXT,
  release_date DATE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mixtapes_dj ON mixtapes(dj_name);

-- Happy Hour Coupons table
CREATE TABLE happy_hour_coupons (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  coupon_code TEXT NOT NULL UNIQUE,
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_happy_hour_coupons_member_id ON happy_hour_coupons(member_id);
CREATE INDEX idx_happy_hour_coupons_code ON happy_hour_coupons(coupon_code);

-- Galleries table
CREATE TABLE galleries (
  id SERIAL PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_logo_url TEXT,
  partner_instagram TEXT,
  gallery_url TEXT,
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  description TEXT,
  featured_image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_galleries_event_id ON galleries(event_id);

-- Member saved items
CREATE TABLE member_saved_mixtapes (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  mixtape_id INTEGER NOT NULL REFERENCES mixtapes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, mixtape_id)
);

CREATE TABLE member_saved_galleries (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  gallery_id INTEGER NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, gallery_id)
);

CREATE INDEX idx_member_saved_mixtapes_member_id ON member_saved_mixtapes(member_id);
CREATE INDEX idx_member_saved_galleries_member_id ON member_saved_galleries(member_id);

-- RSS Feeds table
CREATE TABLE rss_feeds (
  id SERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imported Articles table
CREATE TABLE imported_articles (
  id SERIAL PRIMARY KEY,
  rss_feed_id INTEGER NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  external_url TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_imported_articles_feed_id ON imported_articles(rss_feed_id);
CREATE INDEX idx_imported_articles_published ON imported_articles(published_at);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixtapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE happy_hour_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_saved_mixtapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_saved_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_articles ENABLE ROW LEVEL SECURITY;

-- Public read policies (events, articles, mixtapes, galleries are public)
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Event DJs are viewable by everyone" ON event_djs FOR SELECT USING (true);
CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Mixtapes are viewable by everyone" ON mixtapes FOR SELECT USING (true);
CREATE POLICY "Galleries are viewable by everyone" ON galleries FOR SELECT USING (true);

-- Members policies
CREATE POLICY "Users can view public member profiles" ON members FOR SELECT USING (first_name IS NOT NULL);
CREATE POLICY "Users can insert their own profile" ON members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON members FOR UPDATE USING (auth.uid() = user_id);

-- RSVPs policies
CREATE POLICY "Anyone can create an RSVP" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own RSVPs" ON rsvps FOR SELECT USING (email = auth.email() OR member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- Happy Hour Coupons policies
CREATE POLICY "Users can view their own coupons" ON happy_hour_coupons FOR SELECT USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own coupons" ON happy_hour_coupons FOR INSERT WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- Community members policy
CREATE POLICY "Public member profiles are viewable" ON members FOR SELECT USING (first_name IS NOT NULL AND last_name IS NOT NULL);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_djs_updated_at BEFORE UPDATE ON event_djs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON rsvps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mixtapes_updated_at BEFORE UPDATE ON mixtapes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_happy_hour_coupons_updated_at BEFORE UPDATE ON happy_hour_coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON galleries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON rss_feeds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_imported_articles_updated_at BEFORE UPDATE ON imported_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
