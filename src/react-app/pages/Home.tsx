import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Music, Camera, FileText, Gift, Radio, Ticket, Users, ShoppingBag } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import CountdownTimer from "@/react-app/components/CountdownTimer";
import ShareButtons from "@/react-app/components/ShareButtons";
import type { EventWithDJs, Mixtape, Article } from "@/shared/types";

interface Gallery {
  id: number;
  partner_name: string;
  featured_image_url: string | null;
}

export default function Home() {
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((res) => res.json()),
      fetch("/api/mixtapes").then((res) => res.json()),
      fetch("/api/galleries").then((res) => res.json()),
      fetch("/api/articles").then((res) => res.json()),
    ])
      .then(([eventsData, mixtapesData, galleriesData, articlesData]) => {
        setEvents(eventsData);
        setMixtapes(mixtapesData.slice(0, 3));
        setGalleries(galleriesData.slice(0, 6));
        setArticles(articlesData.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(event => {
    const [y, m, d] = event.event_date.split('-').map(Number);
    const eventDate = new Date(y, m - 1, d);
    return eventDate >= now;
  });

  const isFlagshipEvent = (title: string) => title.toLowerCase().includes("i luv hip hop");
  const nextEvent = upcomingEvents.find(e => isFlagshipEvent(e.title)) || upcomingEvents[0];

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/hero-event-bg.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black z-0" />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 animate-float">
            <img
              src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png"
              alt="I Luv Hip Hop"
              className="w-64 h-64 mx-auto neon-glow"
            />
          </div>

          <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">
            I Luv Hip Hop presents
          </p>

          <h1 className="font-display text-6xl md:text-9xl mb-6 neon-text-simple animate-glow-pulse">
            THIS IS HIP HOP CARIBBEAN
          </h1>

          <p className="text-2xl md:text-3xl text-white mb-4 font-heading tracking-wide">
            The Caribbean hub for events, DJs, promoters, culture, and community.
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-12 font-heading max-w-2xl mx-auto">
            I Luv Hip Hop remains our flagship weekly event while the platform expands to promote every room where hip hop is properly represented.
            <br />
            Flagship Thursdays • Dulce Lounge • Kingston, Jamaica
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/membership"
              className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider neon-glow"
            >
              Join Membership
            </Link>
            <Link
              to="/events"
              className="px-8 py-4 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading text-xl uppercase tracking-wider"
            >
              Find Events & RSVP
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Expansion */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-neon-red/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="neon-border bg-black/80 p-8">
              <Ticket className="w-10 h-10 text-neon-red mb-4" />
              <h2 className="font-display text-4xl text-white mb-4">Flagship Weekly</h2>
              <p className="text-gray-300 font-heading">
                I Luv Hip Hop continues as the weekly home base for dedicated hip hop nights, table reservations, and member access.
              </p>
            </div>
            <div className="neon-border bg-black/80 p-8">
              <Radio className="w-10 h-10 text-neon-red mb-4" />
              <h2 className="font-display text-4xl text-white mb-4">Promoted Events</h2>
              <p className="text-gray-300 font-heading">
                We highlight trusted DJs and promoters across Jamaica and the Caribbean when hip hop is represented with intent.
              </p>
              <Link to="/submit-event" className="inline-block mt-5 text-neon-red hover:text-white transition font-heading uppercase tracking-wider">
                Submit Event
              </Link>
            </div>
            <div className="neon-border bg-black/80 p-8">
              <Users className="w-10 h-10 text-neon-red mb-4" />
              <h2 className="font-display text-4xl text-white mb-4">Newsletter & Members</h2>
              <p className="text-gray-300 font-heading">
                Members get the newsletter, first notice on designated RSVP events, happy hour perks, and community updates.
              </p>
              <Link to="/profiles" className="inline-block mt-5 text-neon-red hover:text-white transition font-heading uppercase tracking-wider">
                View Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Merch Spotlight */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto neon-border bg-black/80 p-8 md:p-12">
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
            <ShoppingBag className="w-16 h-16 text-neon-red" />
            <div>
              <h2 className="font-display text-5xl md:text-7xl text-white mb-3">
                OFFICIAL MERCH
              </h2>
              <p className="text-xl text-gray-300 font-heading">
                Build the culture beyond the event with t-shirts, hats, polo shirts, jackets, and limited member drops.
              </p>
            </div>
            <Link
              to="/merch"
              className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider text-center"
            >
              Shop Merch
            </Link>
          </div>
        </div>
      </section>

      {/* This Week's Energy */}
      {!loading && nextEvent && (
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-5xl md:text-7xl text-center mb-6 neon-text-simple">
              THIS WEEK'S ENERGY
            </h2>

            {/* Countdown Timer */}
            <div className="mb-12">
              <CountdownTimer eventDate={nextEvent.event_date} eventTime={nextEvent.event_time || undefined} />
            </div>

            <div className="glass-panel p-8 md:p-12">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Flyer Image */}
                <div className="md:col-span-4">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden relative shadow-2xl neon-border">
                    <img
                      src={nextEvent.title.includes("Dipset") ? "/flyers/dipset_forever.jpg" : (nextEvent.flyer_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png")}
                      alt={nextEvent.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div className="md:col-span-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight">
                      {nextEvent.title}
                      {nextEvent.sub_theme && <span className="block text-2xl text-neon-red mt-2">{nextEvent.sub_theme}</span>}
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 font-heading">
                      Theme: {nextEvent.theme}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-white">
                        <Calendar className="w-5 h-5 mr-3 text-neon-red" />
                        <span className="font-heading">{new Date(new Date(nextEvent.event_date).getTime() + new Date(nextEvent.event_date).getTimezoneOffset() * 60000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <MapPin className="w-5 h-5 mr-3 text-neon-red" />
                        <span className="font-heading">{nextEvent.venue_name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <Link
                        to={`/events/${nextEvent.id}`}
                        className="inline-block px-8 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
                      >
                        Event Details
                      </Link>
                      <ShareButtons
                        url={`/events`}
                        title={`${nextEvent.sub_theme} - I Luv Hip Hop`}
                        description={`Join us for ${nextEvent.theme} at ${nextEvent.venue_name}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 border-l border-white/10 pl-6 hidden md:block">
                    <div>
                      <h4 className="font-heading text-xl text-neon-red mb-4 flex items-center">
                        <Mic2 className="w-5 h-5 mr-2" />
                        DJ LINEUP
                      </h4>
                      <div className="space-y-3">
                        {nextEvent.djs.map((dj) => (
                          <div key={dj.id} className="border-l-2 border-neon-red pl-4">
                            <p className="font-heading text-lg text-white">{dj.dj_name}</p>
                            {dj.dj_description && (
                              <p className="text-sm text-gray-400">{dj.dj_description}</p>
                            )}
                            {dj.is_resident === 1 && (
                              <span className="text-xs text-neon-red">RESIDENT</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Happy Hour Spotlight */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-neon-red/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel p-12">
            <Gift className="w-16 h-16 text-neon-red mx-auto mb-6" />
            <h2 className="font-display text-5xl md:text-7xl mb-6 text-white">
              HAPPY HOUR
            </h2>
            <p className="text-2xl text-neon-red mb-4 font-heading">
              8:00 PM - 10:30 PM Every Thursday
            </p>
            <p className="text-xl text-white mb-8 font-heading">
              Member-exclusive 2-4-1 drink specials. Get there early.
            </p>
            <Link
              to="/happy-hour"
              className="inline-block px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider neon-glow"
            >
              Get Your Coupon
            </Link>
          </div>
        </div>
      </section>

      {/* Mixtape Preview */}
      {mixtapes.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-5xl md:text-7xl neon-text-simple">
                MIXTAPE VAULT
              </h2>
              <Link
                to="/mixtapes"
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {mixtapes.map((mixtape) => (
                <Link
                  key={mixtape.id}
                  to={`/mixtapes/${mixtape.slug || mixtape.id}`}
                  className="group glass-panel overflow-hidden card-hover"
                >
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-neon-red/20 to-black">
                    {mixtape.cover_art_url ? (
                      <img
                        src={mixtape.cover_art_url}
                        alt={mixtape.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-24 h-24 text-neon-red opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-white mb-2 group-hover:text-neon-red transition">
                      {mixtape.title}
                    </h3>
                    <p className="text-neon-red font-heading">DJ {mixtape.dj_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {galleries.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-black to-neon-red/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-5xl md:text-7xl neon-text-simple">
                CAPTURED MOMENTS
              </h2>
              <Link
                to="/gallery"
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                View Gallery
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  to="/gallery"
                  className="group aspect-square overflow-hidden neon-border bg-black/80"
                >
                  {gallery.featured_image_url ? (
                    <img
                      src={gallery.featured_image_url}
                      alt={gallery.partner_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-red/20 to-black">
                      <Camera className="w-16 h-16 text-neon-red opacity-50" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Preview */}
      {articles.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-5xl md:text-7xl neon-text-simple">
                CULTURE & FEATURES
              </h2>
              <Link
                to="/articles"
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Read More
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group neon-border bg-black/80 backdrop-blur-md overflow-hidden hover:neon-glow transition"
                >
                  {article.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-neon-red mb-2">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-xs font-heading uppercase">Article</span>
                    </div>
                    <h3 className="font-heading text-xl text-white group-hover:text-neon-red transition line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership Teaser */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-neon-red/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="neon-border bg-black p-12 chrome-text-card">
            <h2 className="font-display text-5xl md:text-7xl mb-6 chrome-text">
              UNLOCK EXCLUSIVE ACCESS
            </h2>
            <p className="text-xl text-white mb-8 font-heading">
              Subscribe to the This Is Hip Hop Caribbean newsletter and join membership for event alerts, priority RSVP, table reservations, and exclusive perks.
            </p>
            <Link
              to="/membership"
              className="inline-block px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider neon-glow"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-neon-red/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img
                src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png"
                alt="I Luv Hip Hop"
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-400 font-heading">
                The Original Thursday Night Hip Hop Experience
              </p>
            </div>
            <div>
              <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/events" className="block text-gray-400 hover:text-neon-red transition font-heading">
                  Events Calendar
                </Link>
                <Link to="/membership" className="block text-gray-400 hover:text-neon-red transition font-heading">
                  Membership
                </Link>
                <Link to="/mixtapes" className="block text-gray-400 hover:text-neon-red transition font-heading">
                  Mixtapes
                </Link>
                <Link to="/community" className="block text-gray-400 hover:text-neon-red transition font-heading">
                  Community
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Visit Us</h3>
              <p className="text-gray-400 font-heading mb-2">
                Every Thursday • 8:00 PM onwards
              </p>
              <p className="text-gray-400 font-heading">
                Dulce Lounge<br />
                22 Barbican Road<br />
                Kingston, Jamaica
              </p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-neon-red/30">
            <p className="text-sm text-gray-500">
              © 2025 I Luv Hip Hop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
