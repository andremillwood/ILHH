-- Admin permissions for the This Is Hip Hop Caribbean operations console.
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS admin_permissions TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_members_admin_permissions
  ON members USING GIN (admin_permissions);
