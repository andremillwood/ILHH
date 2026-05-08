import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Headphones, Radio, Users } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";
import { getEventProfileNames } from "@/react-app/lib/platform";

export default function Profiles() {
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

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Culture Directory</p>
          <h1 className="font-display text-7xl md:text-9xl neon-text-simple mb-6">DJS & PROMOTERS</h1>
          <p className="text-xl text-gray-300 font-heading max-w-3xl mx-auto">
            Profiles for the people representing hip hop through lineups, events, mixes, promotion, and community influence.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white font-heading text-xl">Loading profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="neon-border bg-black/80 p-12 text-center">
              <Users className="w-16 h-16 text-neon-red mx-auto mb-4" />
              <p className="text-gray-400 font-heading">Profiles appear once event lineups are added.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Link key={profile.slug} to={`/profiles/${profile.slug}`} className="neon-border bg-black/80 p-6 hover:neon-glow transition">
                  <Headphones className="w-10 h-10 text-neon-red mb-4" />
                  <h2 className="font-display text-4xl text-white mb-3">{profile.name}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-neon-red/30 p-3">
                      <p className="font-display text-3xl text-neon-red">{profile.eventCount}</p>
                      <p className="text-gray-400 font-heading text-xs uppercase">Events</p>
                    </div>
                    <div className="border border-neon-red/30 p-3">
                      <Radio className="w-6 h-6 text-neon-red mb-1" />
                      <p className="text-gray-400 font-heading text-xs uppercase">
                        {profile.residentCount > 0 ? "Resident" : "Profile"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
