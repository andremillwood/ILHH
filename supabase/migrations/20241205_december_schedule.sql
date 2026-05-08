-- Migration to add December events and recurring parties
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
  v_event_id integer;
BEGIN

  -- 1. The Blueprint (Dec 4 - Past)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('The Blueprint', '2024-12-04', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'Annual Jay-Z Birthday Celebration', false)
  RETURNING id INTO v_event_id;

  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'ZJ Rush', 'Code Red', false);
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'Troy Finzi', 'Fame FM', false);

  -- 2. Dipset Forever (Dec 11 - Upcoming)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Dipset Forever', '2024-12-11', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', NULL, true)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Mario', 'Suncity', false);

  -- 3. Wait Your Turn (Dec 18)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Wait Your Turn', '2024-12-18', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'Rihanna Highlight', false)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Mindless', NULL, false);

  -- 4. What Would Yeezus Do? (Dec 25)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('What Would Yeezus Do?', '2024-12-25', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'HIP HOP on the ROC', 'Christmas Special', false)
  RETURNING id INTO v_event_id;
  
  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, 'DJ Karim Stainless', 'Stainless', false);

  -- 5. Tropical Wednesdays (Next 3 weeks)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2024-12-11', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Every Wednesday', false);
  
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2024-12-18', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Every Wednesday', false);

  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Tropical Wednesdays', '2024-12-25', '9:00 PM', 'Dubwise Bar', 'Grounds of Kaya, Kingston', 'Reggae/Dancehall', 'Christmas Edition', false);

  -- 6. Own The Night (Dec 13, 27)
  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Own The Night', '2024-12-13', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'Nightlife', 'Every Other Saturday', false);

  INSERT INTO events (title, event_date, event_time, venue_name, venue_address, theme, sub_theme, is_featured)
  VALUES ('Own The Night', '2024-12-27', '10:00 PM', 'Dulce Lounge', 'Kingston, Jamaica', 'Nightlife', 'Last Saturday of 2024', false);

END $$;
