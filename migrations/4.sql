
ALTER TABLE members ADD COLUMN favorite_genre TEXT;
ALTER TABLE members ADD COLUMN bio TEXT;
ALTER TABLE members ADD COLUMN location TEXT;

CREATE TABLE member_saved_mixtapes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  mixtape_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE member_saved_galleries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  gallery_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_member_saved_mixtapes_member_id ON member_saved_mixtapes(member_id);
CREATE INDEX idx_member_saved_galleries_member_id ON member_saved_galleries(member_id);
