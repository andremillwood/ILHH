import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Music, Camera, FileText, Gift } from "lucide-react";
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

  const nextEvent = events[0];

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

          <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text-simple animate-glow-pulse">
            I LUV HIP HOP
          </h1>

          <p className="text-2xl md:text-3xl text-white mb-4 font-heading tracking-wide">
            The Original Thursday Night Hip Hop Experience
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-12 font-heading">
            Every Thursday • Dulce Lounge • Kingston, Jamaica
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
              RSVP Table Deals
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
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-4xl md:text-6xl text-white mb-4">
                    {nextEvent.sub_theme}
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 font-heading">
                    Theme: {nextEvent.theme}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-white">
                      <Calendar className="w-5 h-5 mr-3 text-neon-red" />
                      <span className="font-heading">{new Date(nextEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <MapPin className="w-5 h-5 mr-3 text-neon-red" />
                      <span className="font-heading">{nextEvent.venue_name} - {nextEvent.venue_address}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Link
                      to={`/rsvp/${nextEvent.id}`}
                      className="inline-block px-8 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
                    >
                      Reserve Your Table
                    </Link>
                    <ShareButtons
                      url={`/events`}
                      title={`${nextEvent.sub_theme} - I Luv Hip Hop`}
                      description={`Join us for ${nextEvent.theme} at ${nextEvent.venue_name}`}
                    />
                  </div>
                </div>

                <div className="space-y-6">
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
                            <span className="text-xs text-neon-red">ILHH RESIDENT</span>
                          )}
                        </div>
                      ))}
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
                  to="/mixtapes"
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
              Join the I Luv Hip Hop membership for 2-4-1 specials, priority RSVP, and exclusive perks
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
