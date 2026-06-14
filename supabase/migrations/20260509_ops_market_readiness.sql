ALTER TABLE event_submissions
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT;

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  user_id UUID,
  visitor_id TEXT,
  session_id TEXT,
  email TEXT,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_email ON analytics_events(email);

CREATE TABLE IF NOT EXISTS support_requests (
  id BIGSERIAL PRIMARY KEY,
  request_type TEXT NOT NULL DEFAULT 'general',
  order_public_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_email ON support_requests(email);
CREATE INDEX IF NOT EXISTS idx_support_requests_order_public_id ON support_requests(order_public_id);

CREATE TABLE IF NOT EXISTS promo_codes (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percent',
  discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_redemptions INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_partners (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.1000,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id BIGSERIAL PRIMARY KEY,
  affiliate_code TEXT NOT NULL,
  order_id BIGINT REFERENCES merch_orders(id) ON DELETE SET NULL,
  order_total_cents INTEGER NOT NULL DEFAULT 0,
  commission_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_code ON affiliate_commissions(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON affiliate_commissions(status);

INSERT INTO site_policies (slug, title, body, is_published)
VALUES
  ('shipping', 'Shipping Policy', 'Merch items are produced on demand through our fulfillment partner. Production commonly starts after payment confirmation, and shipping timelines depend on product availability, destination, customs, carrier performance, and the shipping method available at checkout. Tracking details are sent when available. Contact support if tracking stalls or the delivery address needs review before fulfillment begins.', true),
  ('event-submissions', 'Event Submission Terms', 'Submitted events are reviewed before publication. Submission does not guarantee approval, placement, promotion, or ticket sales. Promoters are responsible for accurate event details, rights to submitted artwork, venue permissions, refunds for their own event products, and all legal compliance. We may edit, reject, remove, or request clarification for listings at any time.', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
