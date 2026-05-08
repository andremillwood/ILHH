-- Fix Schedule with CORRECT 2025 Dates and Content
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  v_event_id integer;
BEGIN

  -- Delete previous incorrect entries (optional, or just add new ones, but better to clean up)
  DELETE FROM events WHERE created_at > NOW() - INTERVAL '2 days'; -- Simple cleanup of recent inserts

  -- 1. I LUV HIP HOP: The Blueprint (Dec 4, 2025 - Past)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('I LUV HIP HOP', '2025-12-04', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'The Blueprint (Annual Jay-Z Bday Celebration)', false)
  RETURNING id INTO v_event_id;

  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'ZJ Rush', 'Code Red', false);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Troy Finzi', 'Fame FM', false);

  -- 2. I LUV HIP HOP: Dipset Forever (Dec 11, 2025 - Upcoming/Featured)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('I LUV HIP HOP', '2025-12-11', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'Dipset Forever', true)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Mario', 'Suncity', false);

  -- 3. I LUV HIP HOP: Wait Your Turn (Dec 18, 2025)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('I LUV HIP HOP', '2025-12-18', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'Wait Your Turn (Rihanna Highlight)', false)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Mindless', NULL, false);

  -- 4. I LUV HIP HOP: What Would Yeezus Do? (Dec 25, 2025)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('I LUV HIP HOP', '2025-12-25', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'What Would Yeezus Do? (Xmas Special)', false)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Karim Stainless', 'Stainless', false);

  -- 5. Tropical Wednesdays (Next 3 weeks - 2025)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2025-12-10', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Every Wednesday', false);
  
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2025-12-17', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Every Wednesday', false);

  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2025-12-24', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Christmas Eve Edition', false);

  -- 6. FAT Wednesdays (Usain Bolt Tracks)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('FAT Wednesdays', '2025-12-10', '9:00 PM', 'Usain Bolt Tracks & Records', 'Kingston', 'Food & Music', 'Every Wednesday', false);

  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('FAT Wednesdays', '2025-12-17', '9:00 PM', 'Usain Bolt Tracks & Records', 'Kingston', 'Food & Music', 'Every Wednesday', false);

  -- 7. Own The Night (Dec 13, 27 - 2025)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Own The Night', '2025-12-13', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'Nightlife', 'Every Other Saturday', false);

  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Own The Night', '2025-12-27', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'Nightlife', 'Last Saturday of 2025', false);

END $$;
