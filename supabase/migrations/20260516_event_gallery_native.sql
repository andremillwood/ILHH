-- Native event galleries plus off-platform gallery links.

ALTER TABLE galleries
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  ADD COLUMN IF NOT EXISTS allow_download BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_galleries_status_event
  ON galleries(status, event_id);

CREATE TABLE IF NOT EXISTS event_gallery_images (
  id SERIAL PRIMARY KEY,
  gallery_id INTEGER REFERENCES galleries(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  photographer_name TEXT,
  downloadable BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_gallery_images_gallery
  ON event_gallery_images(gallery_id, sort_order, created_at);

CREATE INDEX IF NOT EXISTS idx_event_gallery_images_event
  ON event_gallery_images(event_id, sort_order, created_at);

ALTER TABLE event_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published native gallery images are public"
  ON event_gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = event_gallery_images.gallery_id
        AND COALESCE(galleries.status, 'published') = 'published'
    )
  );
