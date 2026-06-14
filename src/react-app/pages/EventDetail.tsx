import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Calendar, Camera, Download, ExternalLink, MapPin, Mic2, Share2, Ticket, Users } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import ShareButtons from "@/react-app/components/ShareButtons";
import EngagementBar from "@/react-app/components/EngagementBar";
import type { EventWithDJs } from "@/shared/types";
import { formatEventDate, isDesignatedRsvpEvent, slugify } from "@/react-app/lib/platform";

interface EventGallery {
  id: number;
  title?: string | null;
  partner_name: string;
  gallery_url?: string | null;
  featured_image_url?: string | null;
  allow_download?: boolean | null;
  event_gallery_images?: Array<{ id: number; image_url: string; thumbnail_url?: string | null; caption?: string | null; downloadable?: boolean | null }>;
}

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventWithDJs | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventWithDJs[]>([]);
  const [galleries, setGalleries] = useState<EventGallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    Promise.all([
      fetch(`/api/events?id=${eventId}`).then((res) => res.json()),
      fetch("/api/events").then((res) => res.json()),
      fetch(`/api/galleries?event_id=${eventId}`).then((res) => res.json()),
    ])
      .then(([eventData, eventsData, galleryData]) => {
        setEvent(eventData);
        setRelatedEvents((eventsData as EventWithDJs[]).filter((item) => String(item.id) !== eventId).slice(0, 3));
        setGalleries(Array.isArray(galleryData) ? galleryData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <h1 className="font-display text-5xl text-white mb-6">Event Not Found</h1>
          <button onClick={() => navigate("/events")} className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase">
            Back To Events
          </button>
        </div>
      </div>
    );
  }

  const designated = isDesignatedRsvpEvent(event);

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={event.flyer_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/hero-event-bg.png"}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <div className="neon-border bg-black/80 overflow-hidden">
            <div className="aspect-[4/5]">
              <img
                src={event.flyer_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center px-4 py-2 bg-neon-red text-black font-heading uppercase tracking-wider text-sm mb-5">
              <Ticket className="w-4 h-4 mr-2" />
              {designated ? "Designated RSVP Event" : "Promoted Hip Hop Event"}
            </span>
            <h1 className="font-display text-6xl md:text-9xl neon-text-simple mb-4">
              {event.title}
            </h1>
            {event.sub_theme && (
              <p className="text-3xl text-neon-red font-heading mb-4">{event.sub_theme}</p>
            )}
            <p className="text-xl text-gray-300 font-heading mb-8 max-w-3xl">
              {event.description || event.theme || "A This Is Hip Hop Caribbean event listing for the DJs, promoters, and community carrying hip hop culture forward."}
            </p>
            {designated && (
              <div className="mb-8 border border-neon-red/50 bg-neon-red/10 p-4">
                <p className="text-neon-red font-heading uppercase text-sm mb-1">RSVP Perk</p>
                <p className="text-gray-200 font-heading">Complimentary shots plus selected 2-for-1 Wray & Nephew or Kingston 62 deals. Book a table and receive a complimentary hookah on orders of J$15,000 or more.</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-neon-red/40 bg-black/70 p-5">
                <Calendar className="w-7 h-7 text-neon-red mb-3" />
                <p className="text-white font-heading">{formatEventDate(event.event_date)}</p>
                {event.event_time && <p className="text-gray-400 font-heading">{event.event_time}</p>}
              </div>
              <div className="border border-neon-red/40 bg-black/70 p-5">
                <MapPin className="w-7 h-7 text-neon-red mb-3" />
                <p className="text-xs font-heading uppercase tracking-[0.25em] text-neon-red mb-2">Venue</p>
                <p className="text-2xl text-white font-heading">{event.venue_name || (designated ? "Dulce Lounge" : "Venue TBA")}</p>
                <p className="text-gray-300 font-heading">{event.venue_address || (designated ? "22 Barbican Road" : "Address TBA")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {designated && (
                <Link to={`/rsvp/${event.id}`} className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider text-center">
                  RSVP & Reserve Table
                </Link>
              )}
              <ShareButtons
                url={`/events/${event.id}`}
                title={`${event.title} - This Is Hip Hop Caribbean`}
                description={event.description || event.theme || event.title}
              />
            </div>
            <div className="mt-6">
              <EngagementBar targetType="event" targetId={event.id} modes={["like", "save"]} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="neon-border bg-black/80 p-8">
            <h2 className="font-display text-5xl text-white mb-6">LINEUP & CULTURE NOTES</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {event.djs.map((dj) => (
                <Link key={dj.id} to={`/profiles/${slugify(dj.dj_name)}`} className="border-l-2 border-neon-red pl-5 py-2 hover:bg-white/5 transition">
                  <Mic2 className="w-6 h-6 text-neon-red mb-2" />
                  <h3 className="font-heading text-2xl text-white">{dj.dj_name}</h3>
                  {dj.dj_description && <p className="text-gray-400 font-heading">{dj.dj_description}</p>}
                  {dj.is_resident === 1 && <p className="text-neon-red font-heading text-xs uppercase mt-2">Resident DJ</p>}
                </Link>
              ))}
            </div>
          </div>

          <aside className="neon-border bg-black/80 p-8 h-fit">
            <Share2 className="w-9 h-9 text-neon-red mb-4" />
            <h2 className="font-display text-4xl text-white mb-4">PROMOTE THIS EVENT</h2>
            <p className="text-gray-300 font-heading mb-6">
              DJs, promoters, creators, and members can share events with their own affiliate or referral code as the platform grows.
            </p>
            <Link to="/submit-event" className="block px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center">
              Submit An Event
            </Link>
          </aside>
        </div>
      </section>

      {galleries.length > 0 && (
        <section className="py-16 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-neon-red font-heading uppercase tracking-[0.3em] mb-2">Event Photos</p>
                <h2 className="font-display text-5xl text-white">GALLERIES</h2>
              </div>
              <Link to="/gallery" className="px-5 py-3 border border-white/20 text-white hover:text-neon-red font-heading uppercase">All Galleries</Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {galleries.map((gallery) => (
                <div key={gallery.id} className="neon-border bg-black/80 p-5">
                  <div className="flex flex-wrap justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-heading text-2xl text-white">{gallery.title || gallery.partner_name}</h3>
                      <p className="text-gray-400 text-sm">{gallery.partner_name}</p>
                    </div>
                    {gallery.gallery_url && (
                      <a href={gallery.gallery_url} target="_blank" rel="noreferrer" className="text-neon-red hover:text-white font-heading uppercase flex items-center gap-2">
                        Off-platform <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {gallery.event_gallery_images && gallery.event_gallery_images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {gallery.event_gallery_images.slice(0, 8).map((image) => (
                        <a key={image.id} href={image.image_url} target="_blank" rel="noreferrer" className="group block">
                          <span className="block aspect-square overflow-hidden border border-white/10 bg-black group-hover:border-neon-red">
                            <img src={image.thumbnail_url || image.image_url} alt={image.caption || gallery.partner_name} className="w-full h-full object-cover" />
                          </span>
                          {(gallery.allow_download !== false && image.downloadable !== false) && (
                            <span className="mt-2 flex items-center gap-1 text-xs text-neon-red font-heading uppercase"><Download className="w-3 h-3" /> Download</span>
                          )}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video border border-white/10 bg-white/[0.03] flex items-center justify-center">
                      {gallery.featured_image_url ? <img src={gallery.featured_image_url} alt={gallery.partner_name} className="w-full h-full object-cover" /> : <Camera className="w-12 h-12 text-neon-red" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedEvents.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-black to-neon-red/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl text-white mb-8">MORE EVENTS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedEvents.map((item) => (
                <Link key={item.id} to={`/events/${item.id}`} className="neon-border bg-black/80 p-6 hover:neon-glow transition">
                  <Users className="w-8 h-8 text-neon-red mb-4" />
                  <h3 className="font-display text-3xl text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 font-heading">{formatEventDate(item.event_date)}</p>
                  <div className="mt-4 border border-neon-red/30 bg-neon-red/10 p-3">
                    <p className="text-xs font-heading uppercase tracking-[0.2em] text-neon-red mb-1">Venue</p>
                    <p className="text-white font-heading">{item.venue_name || "Venue TBA"}</p>
                    {item.venue_address && <p className="text-gray-300 font-heading text-sm">{item.venue_address}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
