CREATE TABLE IF NOT EXISTS merch_products (
  id TEXT PRIMARY KEY,
  printful_sync_product_id BIGINT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'apparel',
  category_label TEXT NOT NULL DEFAULT 'Apparel',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  story TEXT,
  colors TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  image_class TEXT NOT NULL DEFAULT 'from-neon-red/30 via-black to-white/10',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  source TEXT NOT NULL DEFAULT 'printful',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  raw_product JSONB,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merch_product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES merch_products(id) ON DELETE CASCADE,
  printful_sync_variant_id BIGINT UNIQUE,
  printful_catalog_variant_id BIGINT,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  availability_status TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  raw_variant JSONB,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merch_products_category ON merch_products(category);
CREATE INDEX IF NOT EXISTS idx_merch_products_active ON merch_products(is_active);
CREATE INDEX IF NOT EXISTS idx_merch_product_variants_product_id ON merch_product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_merch_product_variants_active ON merch_product_variants(is_active);
