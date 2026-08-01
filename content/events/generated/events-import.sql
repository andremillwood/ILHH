-- Generated from content/events/events.csv
-- Apply this file in the Supabase SQL Editor.
BEGIN;

-- Row 2: I Love Hip Hop
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (1, 'I Love Hip Hop', 'Weekly hip hop and dancehall experience featuring open format party selections and crowd engagement.', '2026-02-05', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Love Songs and Bad Decisions', 'Black, Bold & Desired', '/flyers/Feb-Week1.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Masta King', 'From Belize', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 3: I Love Hip Hop
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (2, 'I Love Hip Hop', 'Ladies-focused hip hop and dancehall nightlife experience with resident DJs and guest appearances.', '2026-02-12', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Love Songs and Bad Decisions', 'Love Songs & Bad Decisions', '/flyers/Feb-Week2.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Renso', 'Coppershot', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 4: I Love Hip Hop
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (3, 'I Love Hip Hop', 'Urban nightlife experience blending hip hop, dancehall and international party sounds.', '2026-02-19', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Love Songs and Bad Decisions', 'Pretty, Petty & Outside', '/flyers/Feb-Week3.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Alric and Boyd', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 5: I Love Hip Hop
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (4, 'I Love Hip Hop', 'Premium Thursday nightlife experience with heavy hip hop and dancehall rotation.', '2026-02-26', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Love Songs and Bad Decisions', 'Dangerously Fly', '/flyers/Feb-Week4.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Troy Finzi', 'FAME FM', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 6: Breeze & Bass
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (5, 'Breeze & Bass', 'Caribbean and hip hop fusion nightlife experience introducing the Breeze & Bass seasonal theme.', '2026-03-05', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Breeze & Bass', 'Fever', '/flyers/Mar-Week1.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Vinchi', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 7: Breeze & Bass
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (6, 'Breeze & Bass', 'Dancehall, afrobeats and hip hop crossover experience designed around spring nightlife energy.', '2026-03-12', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Breeze & Bass', 'Tropical Nights', '/flyers/Mar-Week2.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Spectre', 'Code Red', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 8: Breeze & Bass
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (7, 'Breeze & Bass', 'Weekly party series focused on sexy, melodic and high-energy club records.', '2026-03-19', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Breeze & Bass', 'Oceans and 808s', '/flyers/Mar-Week3.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Chaddy G', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 9: Breeze & Bass
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (8, 'Breeze & Bass', 'End-of-month Breeze & Bass experience featuring crowd favorites and crossover sounds.', '2026-03-26', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Breeze & Bass', 'Heat After Dark', '/flyers/Mar - Week 4.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Supa Hype', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 10: HIP-SO
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (9, 'HIP-SO', 'Hip hop meets soca with carnival-inspired energy and Caribbean party culture.', '2026-04-02', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'HIP-SO', 'Flag in the Air', '/flyers/apr-week1.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Troy Finzi', 'FAME FM', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 11: HIP-SO
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (10, 'HIP-SO', 'Fusion of soca, dancehall and hip hop with female-forward party selections.', '2026-04-09', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'HIP-SO', 'When The Road Calls', '/flyers/apr-week2.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Karim', NULL, FALSE);
END $$;

-- Row 12: HIP-SO
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (11, 'HIP-SO', 'High-energy carnival themed nightlife experience with Caribbean crossover sounds.', '2026-04-16', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'HIP-SO', 'Back to Yard', '/flyers/apr-week3.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Alric and Boyd', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Vybz Ovadose', NULL, FALSE);
END $$;

-- Row 13: HIP-SO
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (12, 'HIP-SO', 'Final HIP-SO edition before transition into Global Bass seasonal programming.', '2026-04-23', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'HIP-SO', 'Last Call', '/flyers/apr-week4.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Milton', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 14: HIP-SO
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (13, 'HIP-SO', 'Final HIP-SO edition before transition into Global Bass seasonal programming.', '2026-04-30', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'HIP-SO', 'Cyaan Kool', '/flyers/apr-week5.png', TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Johnny Kool', 'ZIP FM', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 15: Fuego
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (14, 'Fuego', 'Cinco de Mayo-inspired Global Bass edition featuring international club sounds.', '2026-05-07', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Global Bass', 'Fuego', '/flyers/may-week1.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Troy Finzi', 'FAME FM', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 16: Suave
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (15, 'Suave', 'Luxury Latin and hip hop nightlife experience with smooth crossover sounds.', '2026-05-14', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Global Bass', 'Suave', '/flyers/may-week2.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Kevi the Kinetic', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 17: Shutdown
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (16, 'Shutdown', 'UK grime, dancehall and hip hop focused nightlife experience.', '2026-05-21', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Global Bass', 'Shutdown', '/flyers/may-week3.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Chaddy G', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 18: Rave Mode
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (17, 'Rave Mode', 'High-energy electronic, hip hop and bass culture experience closing out the Global Bass series.', '2026-05-28', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Global Bass', 'Rave Mode', '/flyers/may-week4.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'ZJ West', NULL, TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', NULL, FALSE);
END $$;

-- Row 19: X-Files
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (21, 'X-Files', 'I Luv Hip Hop''s one-year anniversary edition, Hotter Than Your X. RSVP guests receive a complimentary tequila shot.', '2026-06-04', '10:00 PM - 3:00 AM', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop 1 Year Anniversary', 'Hotter Than Your X', '/flyers/june-week1-anniversary.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Narity', NULL, FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Troy Finzi', NULL, FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 20: Road to the Cup
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (22, 'Road to the Cup', 'The anniversary celebration continued with World Cup energy, hip hop, dancehall and reggae. RSVP guests receive complimentary shots and access to selected 2-for-1 Wray & Nephew or Kingston 62 deals.', '2026-06-11', '8:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Road to the Cup Summer Kickoff Series', 'Hotter Than Your Ex', '/flyers/june-week2-road-to-cup.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Karim Stainless', 'Special Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Rockwildaz Sound', NULL, FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 21: Road to the Cup
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (23, 'Road to the Cup', 'Matchday 3 of the anniversary summer series, featuring hip hop with dancehall, reggae and global remixes. RSVP guests receive complimentary shots and access to selected 2-for-1 Wray & Nephew or Kingston 62 deals. Table orders of J$15,000 or more receive a complimentary hookah.', '2026-06-18', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Road to the Cup', 'Matchday 3', '/flyers/june-week3-matchday3.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Barney', 'Featured Guest', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Vybz Ovadose', 'Resident DJ', TRUE);
END $$;

-- Row 22: Summer Champions
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (24, 'Summer Champions', 'The final Thursday of June closes the Hotter Than Your Ex anniversary run with trophy-season hip hop energy. Become an ILHH member and RSVP to access complimentary tequila shots plus 2-for-1 Wray & Nephew and Kingston 62 flask specials.', '2026-06-25', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Hip Hop Summer Is Here', 'Only Winners Left', '/flyers/june-week4-summer-champions.png', TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Alric & Boyd', 'Guest DJs', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Supa Hype', 'Guest DJ', FALSE);
END $$;

-- Row 23: Main Character Energy
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (25, 'Main Character Energy', 'I Luv Hip Hop Thursday edition featuring Main Character Energy theme with guest DJ ZJ West.', '2026-07-02', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Main Character Energy', 'Main Character Energy', NULL, TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'ZJ West', 'Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 24: New Blood
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (26, 'New Blood', 'I Luv Hip Hop Thursday edition featuring New Blood theme with DJs Blaxxtar and DJ X.', '2026-07-09', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'New Blood', 'New Blood', NULL, TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Blaxxtar', 'Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ X', 'Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 25: Player One
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (27, 'Player One', 'I Luv Hip Hop Thursday edition featuring Player One theme with DJ Mario.', '2026-07-16', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Player One', 'Player One', NULL, TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Mario', 'Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 26: Night Shift
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (28, 'Night Shift', 'I Luv Hip Hop Thursday edition featuring Night Shift theme with Johnny Kool and resident DJ Steamaz.', '2026-07-23', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Night Shift', 'Night Shift', NULL, TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Johnny Kool', 'ZIP FM', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Steamaz', 'Resident DJ', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 27: Therapy
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (29, 'Therapy', 'I Luv Hip Hop Thursday edition featuring Therapy theme with DJ Vinchi and resident DJ Steamaz.', '2026-07-30', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'Therapy', 'Therapy', NULL, TRUE, TRUE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Vinchi', 'Guest DJ', FALSE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Steamaz', 'Resident DJ', TRUE);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 28: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (30, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-08-06', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 29: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (31, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-08-13', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 30: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (32, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-08-20', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 31: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (33, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-08-27', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 32: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (34, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-09-03', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 33: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (35, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-09-10', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 34: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (36, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-09-17', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 35: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (37, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-09-24', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 36: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (38, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-10-01', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 37: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (39, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-10-08', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 38: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (40, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-10-15', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 39: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (41, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-10-22', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 40: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (42, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-10-29', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 41: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (43, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-11-05', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 42: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (44, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-11-12', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 43: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (45, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-11-19', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 44: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (46, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-11-26', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 45: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (47, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-12-03', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 46: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (48, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-12-10', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 47: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (49, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-12-17', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 48: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (50, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-12-24', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

-- Row 49: ILHH Weekly
DO $$
DECLARE
  v_event_id INTEGER;
BEGIN
  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (51, 'ILHH Weekly', 'Weekly I Luv Hip Hop Thursday placeholder. Theme, artwork, guest DJs, galleries and mix links can be filled in from admin as the programme locks.', '2026-12-31', '9:00 PM - Late', 'Dulce Lounge', '22 Barbican Road, Kingston, Jamaica', 'I Luv Hip Hop Thursdays', 'Details TBA', NULL, TRUE, FALSE, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;
  DELETE FROM event_djs WHERE event_id = v_event_id;
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Andre Millwood', 'Resident DJ', TRUE);
END $$;

COMMIT;
