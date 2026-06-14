-- Member onboarding and discovery preference state for role-based Home experiences.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS discovery_city TEXT,
  ADD COLUMN IF NOT EXISTS interest_tags TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_members_role_discovery
  ON members(member_role, discovery_city)
  WHERE is_public = true;
