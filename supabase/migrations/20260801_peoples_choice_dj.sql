-- Migration: People's Choice DJ Nomination & Voting System
-- Created for ILHH Dulce Last Thursday event integration

CREATE TABLE IF NOT EXISTS dj_nominations (
  id SERIAL PRIMARY KEY,
  cycle_month TEXT NOT NULL, -- e.g., '2026-08'
  dj_name TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  mix_url TEXT,
  instagram_handle TEXT,
  genre TEXT DEFAULT 'Hip-Hop / R&B / Vibes',
  submitted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dj_nominations_cycle ON dj_nominations(cycle_month);
CREATE INDEX IF NOT EXISTS idx_dj_nominations_status ON dj_nominations(status);

CREATE TABLE IF NOT EXISTS dj_votes (
  id SERIAL PRIMARY KEY,
  nomination_id INTEGER NOT NULL REFERENCES dj_nominations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_month TEXT NOT NULL,
  vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vote_weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, cycle_month, vote_date)
);

CREATE INDEX IF NOT EXISTS idx_dj_votes_nomination ON dj_votes(nomination_id);
CREATE INDEX IF NOT EXISTS idx_dj_votes_user_cycle ON dj_votes(user_id, cycle_month);

CREATE TABLE IF NOT EXISTS dj_monthly_winners (
  id SERIAL PRIMARY KEY,
  cycle_month TEXT NOT NULL UNIQUE,
  nomination_id INTEGER NOT NULL REFERENCES dj_nominations(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  performance_date DATE NOT NULL,
  total_votes INTEGER NOT NULL DEFAULT 0,
  headline_title TEXT DEFAULT 'People''s Choice DJ @ Dulce',
  announcement_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dj_winners_cycle ON dj_monthly_winners(cycle_month);

-- Enable RLS
ALTER TABLE dj_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_monthly_winners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- dj_nominations
CREATE POLICY "Public can view approved DJ nominations"
  ON dj_nominations FOR SELECT
  USING (status = 'approved' OR auth.uid() = submitted_by_user_id);

CREATE POLICY "Authenticated users can submit DJ nominations"
  ON dj_nominations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- dj_votes
CREATE POLICY "Authenticated users can view own votes"
  ON dj_votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can cast votes"
  ON dj_votes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- dj_monthly_winners
CREATE POLICY "Public can view monthly DJ winners"
  ON dj_monthly_winners FOR SELECT
  USING (true);
