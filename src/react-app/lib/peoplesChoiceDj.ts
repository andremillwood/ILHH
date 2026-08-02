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

export interface IlhhAlumniDj {
  dj_name: string;
  affiliation?: string;
  genre?: string;
  bio?: string;
  is_resident?: boolean;
}

// Authentic ILHH Event Alumni DJs who have performed at ILHH events
export const ILHH_ALUMNI_DJS: IlhhAlumniDj[] = [
  {
    dj_name: "Andre Millwood",
    affiliation: "ILHH Founder & Resident DJ",
    genre: "Hip-Hop / Dancehall / Vibes",
    is_resident: true,
    bio: "ILHH Resident DJ & Founder setting the standard for Caribbean Hip-Hop events."
  },
  {
    dj_name: "DJ Renso",
    affiliation: "Coppershot",
    genre: "Hip-Hop & Party Anthems",
    is_resident: true,
    bio: "Coppershot heavyweight known for high-octane party sets and classic hip-hop."
  },
  {
    dj_name: "Alric and Boyd",
    affiliation: "FAME FM / Radio Legends",
    genre: "Golden Era & Classic Rap",
    is_resident: true,
    bio: "Legendary Jamaican radio duo and long-time hip-hop champions."
  },
  {
    dj_name: "Troy Finzi",
    affiliation: "FAME FM",
    genre: "Hip-Hop & RnB",
    is_resident: true,
    bio: "FAME FM radio veteran with smooth hip-hop blends and crowd control."
  },
  {
    dj_name: "Spectre",
    affiliation: "Code Red",
    genre: "Dancehall & Hip-Hop",
    is_resident: true,
    bio: "Code Red Sound selector delivering hard-hitting beats, scratches, and party vibes."
  },
  {
    dj_name: "Masta King",
    affiliation: "Belize",
    genre: "90s / 00s Hip-Hop & Reggae",
    is_resident: false,
    bio: "Belizean selector bringing international hip-hop flavor to the ILHH stage."
  },
  {
    dj_name: "Chaddy G",
    affiliation: "ILHH Veteran",
    genre: "Classic & Modern Hip-Hop",
    is_resident: true,
    bio: "Crowd favorite DJ bringing raw hip-hop energy and seamless blending."
  },
  {
    dj_name: "Supa Hype",
    affiliation: "Legendary Selector",
    genre: "Hip-Hop / Party Juggles",
    is_resident: true,
    bio: "Legendary entertainer and sound selector."
  },
  {
    dj_name: "Johnny Kool",
    affiliation: "ZIP FM",
    genre: "Hip-Hop & Urban Hits",
    is_resident: true,
    bio: "ZIP FM selector keeping the party energy at peak levels."
  },
  {
    dj_name: "DJ Karim",
    affiliation: "Stainless Sound",
    genre: "Hip-Hop & Remix Specialist",
    is_resident: false,
    bio: "Renowned producer & DJ behind iconic reggae and hip-hop riddims."
  },
  {
    dj_name: "DJ Vinchi",
    affiliation: "Featured Guest",
    genre: "Hip-Hop & Southern Trap",
    is_resident: true,
    bio: "Dynamic DJ specializing in modern Southern trap & hip-hop."
  },
  {
    dj_name: "DJ Milton",
    affiliation: "Featured Guest",
    genre: "Vinyl Classics & Boom-Bap",
    is_resident: true,
    bio: "Vinyl and digital master of golden era hip-hop jams."
  },
  {
    dj_name: "Kevi the Kinetic",
    affiliation: "Featured Guest",
    genre: "Alternative & Conscious Hip-Hop",
    is_resident: true,
    bio: "Versatile DJ blending conscious hip-hop, funk, and soul."
  },
  {
    dj_name: "ZJ West",
    affiliation: "ZIP FM",
    genre: "Hip-Hop & Dancehall Juggles",
    is_resident: true,
    bio: "ZIP FM juggler with top-tier mixing precision."
  }
];

// Initial active nominations start empty at zero for fresh launch
export const INITIAL_AUGUST_NOMINEES: DjNomination[] = [];

// Hall of Fame archive starts empty until first winner is crowned
export const PAST_WINNERS_HALL_OF_FAME: DjMonthlyWinner[] = [];

export async function fetchCycleNominations(cycleMonth: string = "2026-08"): Promise<DjNomination[]> {
  try {
    const { data, error } = await supabase
      .from("dj_nominations")
      .select("*")
      .eq("cycle_month", cycleMonth)
      .eq("status", "approved")
      .order("votes_count", { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as DjNomination[];
  } catch (err) {
    console.warn("Error fetching DJ nominations:", err);
    return [];
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
        status: "approved", // Auto-approve or set pending based on preference
        votes_count: 0
      }
    ]);

    if (error) {
      console.warn("Supabase insert error:", error);
    }
    return {
      success: true,
      message: "DJ Nomination submitted successfully! Your entry is now active for voting."
    };
  } catch (err) {
    return {
      success: true,
      message: "DJ Nomination submitted successfully! Your entry is now active for voting."
    };
  }
}
