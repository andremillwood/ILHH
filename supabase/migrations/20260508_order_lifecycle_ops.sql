DO $$ BEGIN
  CREATE TYPE merch_order_status AS ENUM (
    'pending_payment',
    'paid',
    'submitted_to_printful',
    'in_fulfillment',
    'shipped',
    'delivered',
    'cancelled',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_event_level AS ENUM ('info', 'warning', 'error');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE merch_orders
  ADD COLUMN IF NOT EXISTS public_id UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS status_v2 merch_order_status,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address JSONB,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT,
  ADD COLUMN IF NOT EXISTS carrier TEXT,
  ADD COLUMN IF NOT EXISTS support_notes TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS submitted_to_printful_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ;

UPDATE merch_orders
SET status_v2 = CASE
  WHEN status IN ('pending', 'pending_payment') THEN 'pending_payment'::merch_order_status
  WHEN status = 'paid' THEN 'paid'::merch_order_status
  WHEN status = 'submitted_to_printful' THEN 'submitted_to_printful'::merch_order_status
  WHEN status = 'in_fulfillment' THEN 'in_fulfillment'::merch_order_status
  WHEN status = 'shipped' THEN 'shipped'::merch_order_status
  WHEN status = 'delivered' THEN 'delivered'::merch_order_status
  WHEN status = 'cancelled' THEN 'cancelled'::merch_order_status
  WHEN status = 'failed' THEN 'failed'::merch_order_status
  ELSE 'pending_payment'::merch_order_status
END
WHERE status_v2 IS NULL;

ALTER TABLE merch_orders
  ALTER COLUMN status_v2 SET DEFAULT 'pending_payment',
  ALTER COLUMN status_v2 SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_merch_orders_public_id ON merch_orders(public_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_status_v2 ON merch_orders(status_v2);
CREATE INDEX IF NOT EXISTS idx_merch_orders_customer_email ON merch_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_merch_orders_created_at ON merch_orders(created_at DESC);

CREATE TABLE IF NOT EXISTS order_events (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES merch_orders(id) ON DELETE CASCADE,
  level order_event_level NOT NULL DEFAULT 'info',
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_level ON order_events(level);
CREATE INDEX IF NOT EXISTS idx_order_events_created_at ON order_events(created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(bucket, key, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup ON rate_limit_events(bucket, key, window_start DESC);

CREATE TABLE IF NOT EXISTS site_policies (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_policies (slug, title, body)
VALUES
  ('terms', 'Terms of Service', 'Purchases, RSVPs, memberships, and submissions are subject to review, availability, payment verification, fulfillment partner requirements, and applicable law. Do not submit false, abusive, infringing, or fraudulent information.'),
  ('privacy', 'Privacy Policy', 'We collect information you submit for memberships, RSVPs, event submissions, orders, payments, fulfillment, support, fraud prevention, and site operations. Payment data is processed by Stripe. Merch fulfillment data is shared with Printful as needed to produce and ship orders.'),
  ('refunds', 'Refund Policy', 'Merch is made to order. Contact support promptly if an item arrives damaged, misprinted, or incorrect. Refunds, replacements, and cancellations are reviewed case by case before fulfillment begins and may be limited once production has started.')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published policies are public"
  ON site_policies FOR SELECT
  USING (is_published = true);
