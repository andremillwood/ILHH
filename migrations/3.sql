
CREATE TABLE galleries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_name TEXT NOT NULL,
  partner_logo_url TEXT,
  partner_instagram TEXT,
  gallery_url TEXT,
  event_id INTEGER,
  description TEXT,
  featured_image_url TEXT,
  is_featured BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_galleries_event_id ON galleries(event_id);
