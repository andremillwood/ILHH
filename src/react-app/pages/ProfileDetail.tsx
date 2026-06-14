import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { BadgeCheck, Calendar, ExternalLink, Headphones, Instagram, Mail, MapPin, Mic2, Phone, Radio, Share2, Users } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import EngagementBar from "@/react-app/components/EngagementBar";
import { useAuthHeader } from "@/lib/AuthContext";
import type { CreatorProfile, EventWithDJs, Mixtape } from "@/shared/types";
import { formatEventDate, getEventProfileNames, slugify } from "@/react-app/lib/platform";

const typeCopy = {
  dj: { label: "DJ Profile", icon: Headphones, focus: "sets, selectors, rooms, mixtapes, residencies, and dance floor history" },
  artist: { label: "Artist Profile", icon: Mic2, focus: "releases, performances, collaborations, visuals, and artist development" },
  promoter: { label: "Promoter Profile", icon: Radio, focus: "events, audiences, venues, partnerships, ticketing, and cultural programming" },
  venue: { label: "Venue Profile", icon: MapPin, focus: "rooms, calendars, amenities, capacity, culture fit, and event opportunities" },
  community: { label: "Community Profile", icon: Users, focus: "community work, media, curation, support, and cultural impact" },
};

export default function ProfileDetail() {
  const { profileSlug } = useParams();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimText, setClaimText] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const authHeader = useAuthHeader();

  useEffect(() => {
    Promise.all([
      fetch(`/api/public?resource=profiles&slug=${profileSlug}`).then((res) => (res.ok ? res.json() : null)),
      fetch("/api/events").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/mixtapes").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([profileData, eventsData, mixtapesData]) => {
        setProfile(profileData);
        setEvents(eventsData);
        setMixtapes(mixtapesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [profileSlug]);

  const legacyProfiles = getEventProfileNames(events);
  const legacyProfile = legacyProfiles.find((item) => item.slug === profileSlug);
  const displayName = profile?.display_name || legacyProfile?.name || "";
  const relatedEvents = events.filter((event) => event.djs.some((dj) => slugify(dj.dj_name) === profileSlug || (profile && slugify(dj.dj_name) === slugify(profile.display_name))));
  const relatedMixtapes = mixtapes.filter((mix) => slugify(mix.dj_name) === profileSlug || (profile && slugify(mix.dj_name) === slugify(profile.display_name)));
  const typeInfo = profile ? typeCopy[profile.profile_type] : typeCopy.dj;
  const Icon = typeInfo.icon;

  const submitClaim = async () => {
    if (!profile) return;
    if (!authHeader) {
      window.location.href = "/membership";
      return;
    }
    const res = await fetch("/api/members?action=profile_claim", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ creator_profile_id: profile.id, evidence: claimText }),
    }).catch(() => null);
    setClaimMessage(res?.ok ? "Claim submitted for review." : "Claim failed. Add evidence and try again.");
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-heading text-xl">Loading profile...</div>;
  }

  if (!profile && !legacyProfile) {
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[360px_1fr] gap-10 items-center">
          <div className="neon-border bg-black/80 aspect-square flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" /> : <Icon className="w-32 h-32 text-neon-red" />}
          </div>
          <div>
            <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4 flex items-center gap-3">
              {typeInfo.label}
              {profile?.is_verified && <BadgeCheck className="w-6 h-6" />}
            </p>
            <h1 className="font-display text-6xl md:text-9xl neon-text-simple mb-5">{displayName}</h1>
            <p className="text-xl text-gray-300 font-heading max-w-3xl mb-8">
              {profile?.tagline || profile?.bio || `A culture profile connected to ${typeInfo.focus}.`}
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Metric icon={Calendar} value={relatedEvents.length} label="Events" />
              <Metric icon={Headphones} value={relatedMixtapes.length} label="Mixes" />
              <Metric icon={Share2} value={profile?.is_featured ? "Featured" : "Listed"} label="Status" />
            </div>
            {profile && (
              <div className="mt-6">
                <EngagementBar targetType="creator_profile" targetId={profile.id} modes={["follow", "like", "save"]} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-8">
          <main className="space-y-8">
            <div className="neon-border bg-black/80 p-8">
              <h2 className="font-display text-5xl text-white mb-6">PROFILE</h2>
              <p className="text-gray-300 font-heading whitespace-pre-wrap">
                {profile?.bio || "This profile is currently generated from event lineup data. The creator can claim it to add a full bio, booking info, socials, photos, mixtapes, and services."}
              </p>
              {profile?.specialties && <Field title="Specialties" value={profile.specialties} />}
              {profile?.notable_credits && <Field title="Credits" value={profile.notable_credits} />}
              {profile?.equipment_or_services && <Field title={profile.profile_type === "venue" ? "Venue Details" : "Services"} value={profile.equipment_or_services} />}
            </div>

            <div className="neon-border bg-black/80 p-8">
              <h2 className="font-display text-5xl text-white mb-8">EVENT HISTORY</h2>
              <div className="space-y-5">
                {relatedEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block border border-neon-red/30 p-5 hover:bg-white/5 transition">
                    <h3 className="font-display text-3xl text-white">{event.title}</h3>
                    {event.sub_theme && <p className="text-neon-red font-heading">{event.sub_theme}</p>}
                    <p className="text-gray-400 font-heading">{formatEventDate(event.event_date)} • {event.venue_name}</p>
                  </Link>
                ))}
                {relatedEvents.length === 0 && <p className="text-gray-400 font-heading">No connected events yet.</p>}
              </div>
            </div>

            {relatedMixtapes.length > 0 && (
              <div className="neon-border bg-black/80 p-8">
                <h2 className="font-display text-5xl text-white mb-8">MIXTAPES</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedMixtapes.map((mix) => (
                    <Link key={mix.id} to={`/mixtapes/${mix.slug || mix.id}`} className="border border-neon-red/30 p-5 hover:bg-white/5 transition">
                      <h3 className="font-heading text-xl text-white">{mix.title}</h3>
                      <p className="text-gray-400 text-sm">{mix.genre || "Mixtape"}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="space-y-6">
            <div className="neon-border bg-black/80 p-8">
              <h2 className="font-display text-4xl text-white mb-5">CONTACT</h2>
              {(profile?.city || profile?.country) && <ContactLine icon={MapPin} text={[profile.city, profile.country].filter(Boolean).join(", ")} />}
              {profile?.instagram_handle && <ContactLine icon={Instagram} text={`@${profile.instagram_handle}`} href={`https://instagram.com/${profile.instagram_handle}`} />}
              {profile?.booking_email && <ContactLine icon={Mail} text={profile.booking_email} href={`mailto:${profile.booking_email}`} />}
              {profile?.booking_phone && <ContactLine icon={Phone} text={profile.booking_phone} href={`tel:${profile.booking_phone}`} />}
              {profile?.website_url && <ContactLine icon={ExternalLink} text="Website" href={profile.website_url} />}
              {!profile?.booking_email && !profile?.instagram_handle && (
                <p className="text-gray-400 font-heading">Booking and social details can be added after profile approval.</p>
              )}
            </div>
            <Link to="/submit-event" className="block px-6 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Submit Event
            </Link>
            <Link to="/membership" className="block px-6 py-4 border border-white/20 text-white hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Claim / Update Profile
            </Link>
            {profile && !profile.member_id && (
              <div className="neon-border bg-black/80 p-6">
                <h2 className="font-display text-3xl text-white mb-3">CLAIM THIS PROFILE</h2>
                <textarea value={claimText} onChange={(event) => setClaimText(event.target.value)} rows={4} placeholder="Tell us how to verify this is you: social account, booking email, event history, links..." className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
                {claimMessage && <p className="text-gray-300 font-heading text-sm mt-3">{claimMessage}</p>}
                <button onClick={submitClaim} className="mt-4 w-full px-4 py-3 bg-neon-red text-black font-heading uppercase">Submit Claim</button>
              </div>
            )}
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Calendar; value: string | number; label: string }) {
  return (
    <div className="border border-neon-red/40 p-5 bg-black/70">
      <Icon className="w-7 h-7 text-neon-red mb-3" />
      <p className="font-display text-4xl text-white">{value}</p>
      <p className="text-gray-400 font-heading uppercase">{label}</p>
    </div>
  );
}

function Field({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-t border-neon-red/20 mt-6 pt-6">
      <p className="text-neon-red font-heading uppercase text-sm mb-2">{title}</p>
      <p className="text-white font-heading whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function ContactLine({ icon: Icon, text, href }: { icon: typeof MapPin; text: string; href?: string }) {
  const content = (
    <span className="flex items-center gap-3 text-gray-300 font-heading mb-3 hover:text-neon-red transition">
      <Icon className="w-5 h-5 text-neon-red" />
      {text}
    </span>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{content}</a> : content;
}
