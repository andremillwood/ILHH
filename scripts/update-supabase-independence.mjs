import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local manually
try {
  const envContent = fs.readFileSync(".env.local", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch (e) {}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://haowcgsjdpfmwkjapigf.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Connecting to Supabase:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("Updating Event #30 in Supabase...");

  const eventPayload = {
    id: 30,
    title: "Independence Day Celebration",
    description: "Jamaica Independence Day Special celebrating Jay-Z The Black Album (20 Years of Greatness). Cover charge: $1,000 General / At The Gate. $500 with RSVP. FREE in full black with RSVP. Music by Main DJ Troy Finzi and resident DJ Steamaz.",
    event_date: "2026-08-06",
    event_time: "9:00 PM - Late",
    venue_name: "Dulce Lounge",
    venue_address: "22 Barbican Road, Kingston, Jamaica",
    theme: "Celebrating Jay-Z The Black Album",
    sub_theme: "Dirt Off Your Shoulders",
    flyer_url: "/flyers/aug-week1-independence.jpg",
    is_featured: true,
    is_special: true,
  };

  const { data: updatedEvent, error: eventError } = await supabase
    .from("events")
    .upsert(eventPayload)
    .select()
    .single();

  if (eventError) {
    console.error("Error updating event #30:", eventError);
  } else {
    console.log("Successfully updated Event #30:", updatedEvent.title);
  }

  // Delete existing event_djs for event_id 30
  await supabase.from("event_djs").delete().eq("event_id", 30);

  // Insert DJs
  const djs = [
    { event_id: 30, dj_name: "Troy Finzi", dj_description: "Main DJ", is_resident: 0 },
    { event_id: 30, dj_name: "DJ Steamaz", dj_description: "Resident DJ", is_resident: 1 },
    { event_id: 30, dj_name: "Andre Millwood", dj_description: "Resident DJ", is_resident: 1 },
  ];

  const { data: insertedDjs, error: djError } = await supabase
    .from("event_djs")
    .insert(djs)
    .select();

  if (djError) {
    console.error("Error inserting DJs:", djError);
  } else {
    console.log("Successfully inserted DJs for Event #30:", insertedDjs.map(d => d.dj_name).join(", "));
  }

  console.log("Done updating Supabase!");
}

main().catch(console.error);
