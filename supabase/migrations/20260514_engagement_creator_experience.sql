-- Engagement, creator analytics, profile claims, and community editorial submissions.

CREATE TABLE IF NOT EXISTS user_engagements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('creator_profile', 'mixtape', 'article', 'event')),
  target_id TEXT NOT NULL,
  engagement_type TEXT NOT NULL CHECK (engagement_type IN ('like', 'save', 'follow', 'view', 'play', 'download', 'share')),
  is_public BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id, engagement_type)
);

CREATE INDEX IF NOT EXISTS idx_user_engagements_target ON user_engagements(target_type, target_id, engagement_type);
CREATE INDEX IF NOT EXISTS idx_user_engagements_user ON user_engagements(user_id);

CREATE TABLE IF NOT EXISTS content_submissions (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  creator_profile_id INTEGER REFERENCES creator_profiles(id) ON DELETE SET NULL,
  submission_type TEXT NOT NULL DEFAULT 'article' CHECK (submission_type IN ('article', 'pitch', 'review', 'scene_report', 'interview', 'photo_essay')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'needs_changes', 'approved', 'rejected', 'published')),
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,
  body TEXT NOT NULL,
  category TEXT,
  featured_image_url TEXT,
  tags TEXT,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT NOT NULL,
  review_notes TEXT,
  created_article_id INTEGER REFERENCES articles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_submissions_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_content_submissions_member ON content_submissions(member_id);

CREATE TABLE IF NOT EXISTS profile_claims (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  creator_profile_id INTEGER REFERENCES creator_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  evidence TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (member_id, creator_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_claims_status ON profile_claims(status);

ALTER TABLE user_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own engagement"
  ON user_engagements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public engagement counts are readable"
  ON user_engagements FOR SELECT
  USING (true);

CREATE POLICY "Members can view own content submissions"
  ON content_submissions FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can create own content submissions"
  ON content_submissions FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can view own profile claims"
  ON profile_claims FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can create own profile claims"
  ON profile_claims FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));
