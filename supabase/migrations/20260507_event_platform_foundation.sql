CREATE TABLE IF NOT EXISTS event_submissions (
  id BIGSERIAL PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  city_country TEXT NOT NULL,
  event_type TEXT NOT NULL,
  lineup TEXT,
  promoter_name TEXT NOT NULL,
  promoter_email TEXT NOT NULL,
  promoter_phone TEXT,
  instagram_handle TEXT,
  flyer_url TEXT,
  event_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  created_event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_submissions_status ON event_submissions(status);
CREATE INDEX IF NOT EXISTS idx_event_submissions_event_date ON event_submissions(event_date);
CREATE INDEX IF NOT EXISTS idx_event_submissions_promoter_email ON event_submissions(promoter_email);

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event submissions can be inserted publicly"
  ON event_submissions FOR INSERT
  WITH CHECK (true);
