
CREATE TABLE rss_feeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  last_fetched_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imported_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rss_feed_id INTEGER NOT NULL,
  external_url TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_at DATETIME,
  imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_imported_articles_feed_id ON imported_articles(rss_feed_id);
CREATE INDEX idx_imported_articles_published ON imported_articles(published_at);
