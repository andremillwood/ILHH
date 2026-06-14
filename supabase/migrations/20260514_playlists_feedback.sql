-- ILHH playlist hub and community feedback/suggestion system.

CREATE TABLE IF NOT EXISTS music_playlists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  curator_name TEXT DEFAULT 'I Luv Hip Hop',
  playlist_type TEXT NOT NULL DEFAULT 'ilhh_curated' CHECK (playlist_type IN ('ilhh_curated', 'community_ranked', 'event_soundtrack', 'creator_spotlight', 'member_suggested')),
  mood TEXT,
  platform TEXT NOT NULL DEFAULT 'spotify' CHECK (platform IN ('spotify', 'apple_music', 'soundcloud', 'youtube', 'audiomack', 'tidal', 'other')),
  external_url TEXT NOT NULL,
  embed_url TEXT,
  cover_url TEXT,
  tags TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_music_playlists_published ON music_playlists(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_music_playlists_type ON music_playlists(playlist_type);

CREATE TABLE IF NOT EXISTS playlist_suggestions (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  playlist_id INTEGER REFERENCES music_playlists(id) ON DELETE SET NULL,
  track_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  platform_url TEXT,
  reason TEXT,
  suggested_for TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'added', 'rejected')),
  vote_count INTEGER DEFAULT 0,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playlist_suggestions_status ON playlist_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_playlist_suggestions_playlist ON playlist_suggestions(playlist_id);

CREATE TABLE IF NOT EXISTS playlist_votes (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  suggestion_id INTEGER REFERENCES playlist_suggestions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (member_id, suggestion_id)
);

ALTER TABLE music_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published playlists are public"
  ON music_playlists FOR SELECT
  USING (is_published = true);

CREATE POLICY "Published suggestions are public"
  ON playlist_suggestions FOR SELECT
  USING (status IN ('pending', 'shortlisted', 'added'));

CREATE POLICY "Members can create playlist suggestions"
  ON playlist_suggestions FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can vote on playlist suggestions"
  ON playlist_votes FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can remove own playlist votes"
  ON playlist_votes FOR DELETE
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Playlist votes are countable"
  ON playlist_votes FOR SELECT
  USING (true);
