-- Production-safe event update for May 28 through June 25, 2026.
-- Run this entire file in the Supabase SQL Editor.
BEGIN;

INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at)
VALUES
  (17, 'Rave Mode', 'High-energy electronic, hip hop and bass culture experience closing out the Global Bass series.', '2026-05-28', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Global Bass', 'Rave Mode', '/flyers/may-week4.png', TRUE, TRUE, NOW()),
  (21, 'X-Files', 'I Luv Hip Hop''s one-year anniversary edition, Hotter Than Your X. RSVP guests receive a complimentary tequila shot.', '2026-06-04', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop 1 Year Anniversary', 'Hotter Than Your X', '/flyers/june-week1-anniversary.png', TRUE, TRUE, NOW()),
  (22, 'Road to the Cup', 'The anniversary celebration continued with World Cup energy, hip hop, dancehall and reggae. RSVP guests receive complimentary shots and access to selected 2-for-1 Wray & Nephew or Kingston 62 deals.', '2026-06-11', '8:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Road to the Cup Summer Kickoff Series', 'Hotter Than Your Ex', '/flyers/june-week2-road-to-cup.png', TRUE, TRUE, NOW()),
  (23, 'Road to the Cup', 'Matchday 3 of the anniversary summer series, featuring hip hop with dancehall, reggae and global remixes. RSVP guests receive complimentary shots and access to selected 2-for-1 Wray & Nephew or Kingston 62 deals. Table orders of J$15,000 or more receive a complimentary hookah.', '2026-06-18', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Road to the Cup', 'Matchday 3', '/flyers/june-week3-matchday3.png', TRUE, TRUE, NOW()),
  (24, 'Summer Champions', 'The final Thursday of June closes the Hotter Than Your Ex anniversary run with trophy-season hip hop energy. Become an ILHH member and RSVP to access complimentary tequila shots plus 2-for-1 Wray & Nephew and Kingston 62 flask specials.', '2026-06-25', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Hip Hop Summer Is Here', 'Only Winners Left', '/flyers/june-week4-summer-champions.png', TRUE, TRUE, NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time,
  venue_name = EXCLUDED.venue_name,
  venue_address = EXCLUDED.venue_address,
  theme = EXCLUDED.theme,
  sub_theme = EXCLUDED.sub_theme,
  flyer_url = EXCLUDED.flyer_url,
  is_featured = EXCLUDED.is_featured,
  is_special = EXCLUDED.is_special,
  updated_at = NOW();

DELETE FROM event_djs WHERE event_id IN (17, 21, 22, 23, 24);

INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident)
VALUES
  (17, 'ZJ West', NULL, TRUE),
  (17, 'Andre Millwood', NULL, FALSE),
  (21, 'DJ Narity', NULL, FALSE),
  (21, 'DJ Troy Finzi', NULL, FALSE),
  (21, 'Andre Millwood', 'Resident DJ', TRUE),
  (22, 'Karim Stainless', 'Special Guest DJ', FALSE),
  (22, 'Rockwildaz Sound', NULL, FALSE),
  (22, 'Andre Millwood', 'Resident DJ', TRUE),
  (23, 'DJ Barney', 'Featured Guest', FALSE),
  (23, 'Andre Millwood', 'Resident DJ', TRUE),
  (23, 'Vybz Ovadose', 'Resident DJ', TRUE),
  (24, 'Andre Millwood', 'Resident DJ', TRUE),
  (24, 'Alric & Boyd', 'Guest DJs', FALSE),
  (24, 'Supa Hype', 'Guest DJ', FALSE);

COMMIT;
