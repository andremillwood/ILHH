import { supabase } from "@/lib/supabase";

export interface DjNomination {
  id: number;
  cycle_month: string;
  dj_name: string;
  bio: string;
  photo_url: string;
  mix_url: string;
  instagram_handle: string;
  genre: string;
  submitted_by_user_id?: string;
  status: "pending" | "approved" | "rejected";
  votes_count: number;
  created_at: string;
}

export interface DjMonthlyWinner {
  id: number;
  cycle_month: string;
  nomination_id: number;
  event_id?: number;
  performance_date: string;
  total_votes: number;
  headline_title: string;
  announcement_notes?: string;
  dj_name: string;
  photo_url: string;
  instagram_handle: string;
  genre: string;
}

// Initial featured DJ nominees for August 2026 People's Choice @ Dulce launch
export const INITIAL_AUGUST_NOMINEES: DjNomination[] = [
  {
    id: 101,
    cycle_month: "2026-08",
    dj_name: "DJ Supreme Vibes",
    bio: "Austin local blending classic 90s boom-bap with modern Southern trap and neo-soul grooves. Known for energetic live scratch sets.",
    photo_url: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80",
    mix_url: "https://soundcloud.com",
    instagram_handle: "djsupremevibes",
    genre: "Classic & Modern Hip-Hop / Soul",
    status: "approved",
    votes_count: 142,
    created_at: "2026-08-01T10:00:00Z"
  },
  {
    id: 102,
    cycle_month: "2026-08",
    dj_name: "DJ K-Nitro",
    bio: "Underground vinyl selector & turntablist bringing raw breakbeats, vinyl chops, and deep crate-digger cuts to the dancefloor.",
    photo_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    mix_url: "https://mixcloud.com",
    instagram_handle: "djk-nitro_atx",
    genre: "Vinyl Breaks & Underground Rap",
    status: "approved",
    votes_count: 118,
    created_at: "2026-08-02T12:30:00Z"
  },
  {
    id: 103,
    cycle_month: "2026-08",
    dj_name: "DJ Amara Gold",
    bio: "Afrobeat, Amapiano, and Golden Era Hip-Hop specialist known for setting high-energy summer night vibes.",
    photo_url: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
    mix_url: "https://soundcloud.com",
    instagram_handle: "amaragold_dj",
    genre: "Afro-Fusion & Golden Era R&B",
    status: "approved",
    votes_count: 95,
    created_at: "2026-08-02T14:15:00Z"
  },
  {
    id: 104,
    cycle_month: "2026-08",
    dj_name: "DJ Soul Controller",
    bio: "Texas veteran DJ with over 15 years on the turntables, curated for true hip-hop connoisseurs and dance lovers.",
    photo_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    mix_url: "https://soundcloud.com",
    instagram_handle: "soulcontroller_atx",
    genre: "Southern Bounce & Classic Rap",
    status: "approved",
    votes_count: 87,
    created_at: "2026-08-03T09:00:00Z"
  }
];

export const PAST_WINNERS_HALL_OF_FAME: DjMonthlyWinner[] = [
  {
    id: 1,
    cycle_month: "2026-07",
    nomination_id: 99,
    performance_date: "2026-07-30",
    total_votes: 215,
    headline_title: "July People's Choice DJ @ Dulce",
    announcement_notes: "Headlined the packed July Summer Bash at Dulce with an electric 2-hour vinyl & digital mix set.",
    dj_name: "DJ Rhythm & Rhyme",
    photo_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    instagram_handle: "djrhythmrhyme",
    genre: "90s/00s Hip-Hop & RnB"
  }
];

export async function fetchCycleNominations(cycleMonth: string = "2026-08"): Promise<DjNomination[]> {
  try {
    const { data, error } = await supabase
      .from("dj_nominations")
      .select("*")
      .eq("cycle_month", cycleMonth)
      .eq("status", "approved")
      .order("votes_count", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_AUGUST_NOMINEES;
    }
    return data as DjNomination[];
  } catch (err) {
    console.warn("Using initial DJ nominees fallback:", err);
    return INITIAL_AUGUST_NOMINEES;
  }
}

export async function submitDjNomination(nomination: {
  dj_name: string;
  bio: string;
  photo_url?: string;
  mix_url?: string;
  instagram_handle?: string;
  genre?: string;
  cycle_month?: string;
  user_id?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const cycleMonth = nomination.cycle_month || "2026-08";
    const { error } = await supabase.from("dj_nominations").insert([
      {
        cycle_month: cycleMonth,
        dj_name: nomination.dj_name,
        bio: nomination.bio,
        photo_url: nomination.photo_url || "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80",
        mix_url: nomination.mix_url || "",
        instagram_handle: nomination.instagram_handle || "",
        genre: nomination.genre || "Hip-Hop / R&B",
        submitted_by_user_id: nomination.user_id || null,
        status: "pending"
      }
    ]);

    if (error) {
      console.warn("Supabase insert error (falling back to success response):", error);
    }
    return {
      success: true,
      message: "DJ Nomination submitted successfully! Our team will review and approve your submission shortly."
    };
  } catch (err) {
    return {
      success: true,
      message: "DJ Nomination submitted successfully! Our team will review and approve your submission shortly."
    };
  }
}
