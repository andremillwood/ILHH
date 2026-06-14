import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { BadgeCheck, Building2, Headphones, MapPin, Mic2, Radio, Search, Sparkles, Users } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { CreatorProfile, EventWithDJs } from "@/shared/types";
import { getEventProfileNames } from "@/react-app/lib/platform";

const profileTypes = [
  { id: "all", label: "All" },
  { id: "dj", label: "DJs" },
  { id: "artist", label: "Artists" },
  { id: "promoter", label: "Promoters" },
  { id: "venue", label: "Venues" },
  { id: "community", label: "Community" },
];

const typeIcon = {
  dj: Headphones,
  artist: Mic2,
  promoter: Radio,
  venue: Building2,
  community: Users,
};

export default function Profiles() {
  const [profiles, setProfiles] = useState<CreatorProfile[]>([]);
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/public?resource=profiles").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/events").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([profileData, eventData]) => {
        setProfiles(profileData);
        setEvents(eventData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const legacyProfiles = useMemo(() => getEventProfileNames(events), [events]);
  const filteredProfiles = profiles.filter((profile) => {
    const matchesType = activeType === "all" || profile.profile_type === activeType;
    const search = query.toLowerCase().trim();
    const matchesSearch = !search || [profile.display_name, profile.tagline, profile.bio, profile.city, profile.specialties]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto">
          <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Culture Directory</p>
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-end">
            <div>
              <h1 className="font-display text-6xl md:text-9xl neon-text-simple mb-6">PROFILES</h1>
              <p className="text-xl text-gray-300 font-heading max-w-3xl">
                Discover DJs, artists, promoters, venues, and community builders carrying hip hop across Jamaica and the Caribbean.
              </p>
            </div>
            <Link to="/membership" className="neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition p-5 font-heading uppercase tracking-wider text-center">
              Submit / Claim Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_auto] gap-4">
          <div className="neon-border bg-black/80 p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-neon-red" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, cities, styles, services..."
              className="w-full bg-transparent text-white font-heading outline-none placeholder-gray-500"
            />
          </div>
          <div className="flex overflow-x-auto gap-2">
            {profileTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-4 py-3 border font-heading uppercase text-sm whitespace-nowrap transition ${activeType === type.id ? "bg-neon-red border-neon-red text-black" : "border-white/20 text-white hover:text-neon-red"}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white font-heading text-xl">Loading profiles...</div>
          ) : filteredProfiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => {
                const Icon = typeIcon[profile.profile_type] || Users;
                return (
                  <Link key={profile.id} to={`/profiles/${profile.slug}`} className="neon-border bg-black/80 p-6 hover:neon-glow transition flex flex-col min-h-[320px]">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="w-20 h-20 border border-neon-red/50 bg-neon-red/10 flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" /> : <Icon className="w-9 h-9 text-neon-red" />}
                      </div>
                      <div className="flex gap-2">
                        {profile.is_featured && <Sparkles className="w-5 h-5 text-neon-red" />}
                        {profile.is_verified && <BadgeCheck className="w-5 h-5 text-neon-red" />}
                      </div>
                    </div>
                    <p className="text-neon-red font-heading uppercase text-xs tracking-[0.2em] mb-2">{profile.profile_type}</p>
                    <h2 className="font-display text-4xl text-white mb-3">{profile.display_name}</h2>
                    <p className="text-gray-300 font-heading mb-5 line-clamp-3">{profile.tagline || profile.bio || "Approved culture profile."}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 text-sm font-heading">
                      <span className="text-gray-400 inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {profile.city || profile.country || "Caribbean"}
                      </span>
                      <span className="text-neon-red uppercase">View</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : legacyProfiles.length > 0 && activeType === "all" && !query ? (
            <div>
              <div className="neon-border bg-black/80 p-6 mb-8">
                <p className="text-gray-300 font-heading">
                  Approved creator profiles will appear here. Until then, this directory is showing lineup-generated DJ/promoter profiles from published events.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legacyProfiles.map((profile) => (
                  <Link key={profile.slug} to={`/profiles/${profile.slug}`} className="neon-border bg-black/80 p-6 hover:neon-glow transition">
                    <Headphones className="w-10 h-10 text-neon-red mb-4" />
                    <h2 className="font-display text-4xl text-white mb-3">{profile.name}</h2>
                    <p className="text-gray-400 font-heading">{profile.eventCount} event{profile.eventCount === 1 ? "" : "s"} connected</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="neon-border bg-black/80 p-12 text-center">
              <Users className="w-16 h-16 text-neon-red mx-auto mb-4" />
              <p className="text-gray-400 font-heading">No profiles match that search yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
