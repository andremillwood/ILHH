CREATE TABLE IF NOT EXISTS admin_access_requests (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  requested_role TEXT NOT NULL DEFAULT 'admin',
  requested_permissions TEXT[] NOT NULL DEFAULT '{}',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  member_id BIGINT REFERENCES members(id) ON DELETE SET NULL,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_access_requests_email ON admin_access_requests(lower(email));
CREATE INDEX IF NOT EXISTS idx_admin_access_requests_status ON admin_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_access_requests_created_at ON admin_access_requests(created_at DESC);
