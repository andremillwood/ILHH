ALTER TABLE mixtapes
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS download_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS genre TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT,
  ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS download_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

UPDATE mixtapes
SET slug = lower(regexp_replace(title || '-' || id::text, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mixtapes_slug ON mixtapes(slug);
CREATE INDEX IF NOT EXISTS idx_mixtapes_status ON mixtapes(status);
CREATE INDEX IF NOT EXISTS idx_mixtapes_uploaded_by ON mixtapes(uploaded_by);

INSERT INTO storage.buckets (id, name, public)
VALUES ('mixes', 'mixes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Mixes are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mixes');

CREATE POLICY "Authenticated users can upload mixes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'mixes');
