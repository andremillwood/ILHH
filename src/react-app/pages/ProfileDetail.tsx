import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Calendar, Headphones, Instagram, Radio, Share2 } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";
import { formatEventDate, getEventProfileNames, slugify } from "@/react-app/lib/platform";

export default function ProfileDetail() {
  const { profileSlug } = useParams();
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const profiles = getEventProfileNames(events);
  const profile = profiles.find((item) => item.slug === profileSlug);
  const profileEvents = events.filter((event) =>
    event.djs.some((dj) => slugify(dj.dj_name) === profileSlug),
  );
  const resident = profileEvents.some((event) =>
    event.djs.some((dj) => slugify(dj.dj_name) === profileSlug && dj.is_resident === 1),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <h1 className="font-display text-5xl text-white mb-6">Profile Not Found</h1>
          <Link to="/profiles" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase">
            View Profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[340px_1fr] gap-10 items-center">
          <div className="neon-border bg-black/80 aspect-square flex items-center justify-center">
            <Headphones className="w-32 h-32 text-neon-red" />
          </div>
          <div>
            <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">
              {resident ? "Resident / Culture Profile" : "DJ / Promoter Profile"}
            </p>
            <h1 className="font-display text-7xl md:text-9xl neon-text-simple mb-5">{profile.name}</h1>
            <p className="text-xl text-gray-300 font-heading max-w-3xl mb-8">
              A This Is Hip Hop Caribbean culture profile connected to event lineups, promoted nights, and the wider Caribbean hip hop community.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-neon-red/40 p-5 bg-black/70">
                <Calendar className="w-7 h-7 text-neon-red mb-3" />
                <p className="font-display text-4xl text-white">{profile.eventCount}</p>
                <p className="text-gray-400 font-heading uppercase">Events</p>
              </div>
              <div className="border border-neon-red/40 p-5 bg-black/70">
                <Radio className="w-7 h-7 text-neon-red mb-3" />
                <p className="font-display text-4xl text-white">{profile.residentCount}</p>
                <p className="text-gray-400 font-heading uppercase">Resident Slots</p>
              </div>
              <div className="border border-neon-red/40 p-5 bg-black/70">
                <Share2 className="w-7 h-7 text-neon-red mb-3" />
                <p className="font-display text-4xl text-white">AFF</p>
                <p className="text-gray-400 font-heading uppercase">Referral Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="neon-border bg-black/80 p-8">
            <h2 className="font-display text-5xl text-white mb-8">EVENT HISTORY</h2>
            <div className="space-y-5">
              {profileEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`} className="block border border-neon-red/30 p-5 hover:bg-white/5 transition">
                  <h3 className="font-display text-3xl text-white">{event.title}</h3>
                  {event.sub_theme && <p className="text-neon-red font-heading">{event.sub_theme}</p>}
                  <p className="text-gray-400 font-heading">{formatEventDate(event.event_date)} • {event.venue_name}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="neon-border bg-black/80 p-8 h-fit">
            <Instagram className="w-9 h-9 text-neon-red mb-4" />
            <h2 className="font-display text-4xl text-white mb-4">BOOKING & PARTNERSHIP</h2>
            <p className="text-gray-300 font-heading mb-6">
              This profile can evolve into bookings, social embeds, mixes, affiliate codes, merch collaborations, and verified promoter dashboards.
            </p>
            <Link to="/submit-event" className="block px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Submit Event
            </Link>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
