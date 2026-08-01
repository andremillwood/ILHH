import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, BarChart3, Bookmark, Calendar, MapPin, Mic2, Music, Camera, FileText, Gift, LayoutDashboard, PenLine, Radio, Ticket, Users, ShoppingBag, Flame, Sparkles, Shirt, Headphones, Newspaper } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import CountdownTimer from "@/react-app/components/CountdownTimer";
import ShareButtons from "@/react-app/components/ShareButtons";
import SocialCtas from "@/react-app/components/SocialCtas";
import { useAuth } from "@/lib/AuthContext";
import type { EventWithDJs, Mixtape, Article } from "@/shared/types";
import { useMerchCatalog } from "@/react-app/lib/useMerchCatalog";
import { merchCategories } from "@/react-app/lib/merchProducts";
import { isDesignatedRsvpEvent } from "@/react-app/lib/platform";
import { normalizeImageUrl } from "@/react-app/lib/imageUrls";

interface Gallery {
  id: number;
  partner_name: string;
  featured_image_url: string | null;
}

const memberStudioActions = [
  { to: "/home", label: "Home", text: "Feed, saved items, creator stats, submissions, and claims.", icon: LayoutDashboard },
  { to: "/membership", label: "My Profile", text: "Edit member info and submit a creator profile.", icon: Users },
  { to: "/directory", label: "Directory", text: "Follow, save, and claim DJ/artist/promoter profiles.", icon: Mic2 },
  { to: "/submit-article", label: "Submit Story", text: "Send reviews, recaps, interviews, or scene reports.", icon: PenLine },
  { to: "/playlists", label: "Playlists", text: "Suggest tracks and vote on community rankings.", icon: Music },
  { to: "/music", label: "Music Library", text: "Like and save mixes for your personal library.", icon: Bookmark },
  { to: "/admin", label: "Admin", text: "Review submissions, claims, events, and playlists.", icon: BarChart3 },
];

const safeJson = async <T,>(request: Promise<Response>, fallback: T) => {
  try {
    const response = await request;
    if (!response.ok) return fallback;
    const data = await response.json();
    return Array.isArray(data) ? data as T : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const eventDateValue = (event: EventWithDJs) => {
  const [y, m, d] = event.event_date.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatEventDate = (event: EventWithDJs) =>
  eventDateValue(event).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function Home() {
  const { user } = useAuth();
  const { products: merchProducts } = useMerchCatalog();
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    Promise.all([
      safeJson<EventWithDJs[]>(fetch("/api/events"), []),
      safeJson<Mixtape[]>(fetch("/api/mixtapes"), []),
      safeJson<Gallery[]>(fetch("/api/galleries"), []),
      safeJson<Article[]>(fetch("/api/articles"), []),
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
    return eventDateValue(event) >= now;
  }).slice(0, 6);

  const nextEvent = upcomingEvents.find((event) => isDesignatedRsvpEvent(event)) || upcomingEvents[0];
  const otherEvent = upcomingEvents.find((event) => event.id !== nextEvent?.id);
  const featuredProduct = merchProducts[0];
  const newProducts = merchProducts.slice(0, 4);
  const hotProducts = [...merchProducts]
    .sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.price - a.price)
    .slice(0, 3);
  const featuredMixtape = mixtapes[0];
  const featuredArticle = articles[0];
  const latestMixtapes = mixtapes.slice(0, 4);
  const latestArticles = articles.slice(0, 4);
  const heroSlides = [
    {
      key: "merch",
      eyebrow: "Official Merch",
      title: "WEAR THE MOVEMENT",
      body: featuredProduct
        ? `${featuredProduct.name} is the current weekly drop, available in ${featuredProduct.colors.join(", ")}.`
        : "Shop official This Is Hip Hop Caribbean apparel and member-linked drops.",
      to: featuredProduct ? `/merch/product/${featuredProduct.id}` : "/merch",
      cta: "Shop Merch",
      image: featuredProduct?.images[0]?.url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png",
      meta: featuredProduct ? `$${featuredProduct.price.toFixed(2)} / Made to order` : "Official store",
      icon: ShoppingBag,
    },
    {
      key: "ilhh-weekly",
      eyebrow: "I Luv Hip Hop Weekly",
      title: nextEvent?.title || "I LUV HIP HOP THURSDAYS",
      body: nextEvent?.description || "Become an ILHH member, RSVP for complimentary shots and drink specials, and reserve your table for Thursday night.",
      to: nextEvent ? `/rsvp/${nextEvent.id}` : "/events",
      cta: nextEvent ? "RSVP Now" : "Find Events",
      image: nextEvent?.flyer_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/hero-event-bg.png",
      meta: nextEvent ? `${nextEvent.event_date} / ${nextEvent.venue_name || "Venue TBA"}` : "Every Thursday / Dulce Lounge",
      icon: Ticket,
    },
    {
      key: "events",
      eyebrow: "More Events",
      title: otherEvent?.title || "DISCOVER THE CALENDAR",
      body: otherEvent?.theme || "Track promoted hip hop events, trusted rooms, DJ nights, and cultural moments across the platform.",
      to: otherEvent ? `/events/${otherEvent.id}` : "/events",
      cta: "View Events",
      image: otherEvent?.flyer_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/hero-event-bg.png",
      meta: otherEvent ? `${otherEvent.event_date} / ${otherEvent.venue_name || "Venue TBA"}` : `${upcomingEvents.length} upcoming listings`,
      icon: Calendar,
    },
    {
      key: "mixtapes",
      eyebrow: "Music",
      title: featuredMixtape?.title || "NEW MIXES IN ROTATION",
      body: featuredMixtape?.description || "Stream DJ sets, event recordings, and new mixes connected to the Caribbean hip hop community.",
      to: featuredMixtape ? `/music/${featuredMixtape.slug || featuredMixtape.id}` : "/music",
      cta: "Play Music",
      image: featuredMixtape?.cover_art_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png",
      meta: featuredMixtape ? `DJ ${featuredMixtape.dj_name}` : "Featured DJ sets",
      icon: Music,
    },
    {
      key: "articles",
      eyebrow: "Culture & Features",
      title: featuredArticle?.title || "READ THE LATEST",
      body: featuredArticle?.excerpt || "Catch new stories, event recaps, culture coverage, and updates from This Is Hip Hop Caribbean.",
      to: featuredArticle ? `/stories/${featuredArticle.slug}` : "/stories",
      cta: "Read Stories",
      image: featuredArticle?.featured_image_url || "https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/hero-event-bg.png",
      meta: featuredArticle?.author ? `By ${featuredArticle.author}` : "Platform updates",
      icon: FileText,
    },
  ];
  const activeSlide = heroSlides[activeHero] || heroSlides[0];
  const HeroIcon = activeSlide.icon;

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] overflow-hidden border-b-8 border-neon-red pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={activeSlide.image}
            alt=""
            className="w-full h-full object-cover opacity-35 grayscale contrast-125 transition-opacity duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/55 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-0" />

        <div className="relative z-10 mx-auto grid min-h-[calc(92vh-5rem)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] sm:px-6 lg:px-8">
          <div className="relative">
            <p className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.35em] text-gray-300">Kingston / Jamaica / Est. 2025</p>
            <div className="press-label mb-6 gap-3">
              <HeroIcon className="h-5 w-5 text-black" />
              <span>{activeSlide.eyebrow}</span>
            </div>

            <h1 className="mb-6 max-w-4xl font-display text-5xl uppercase leading-[0.88] text-white sm:text-7xl md:text-8xl lg:text-9xl">
              {activeSlide.title}
            </h1>

            <p className="max-w-2xl border-l-4 border-neon-red pl-5 font-heading text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              Hip hop lives here. Kingston sets the temperature.
            </p>

            <p className="mb-8 mt-5 max-w-2xl font-body text-base leading-7 text-gray-300 md:text-lg">
              {activeSlide.body}
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={activeSlide.to}
                className="press-button"
              >
                {activeSlide.cta}
              </Link>
              <Link
                to={user ? "/dashboard" : "/membership"}
                className="press-button-secondary"
              >
                {user ? "Open Home" : "Join Membership"}
              </Link>
            </div>

            <div className="grid max-w-2xl grid-cols-2 gap-px border border-white/20 bg-white/20 sm:grid-cols-5">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.key}
                  type="button"
                  onClick={() => setActiveHero(index)}
                  className={`min-h-16 p-3 text-left transition ${index === activeHero ? "bg-neon-red text-black" : "bg-black text-white hover:bg-white hover:text-black"}`}
                  aria-label={`Show ${slide.eyebrow}`}
                >
                  <slide.icon className={`mb-2 h-4 w-4 ${index === activeHero ? "text-black" : "text-neon-red"}`} />
                  <span className="block font-heading text-xs uppercase leading-tight">{slide.eyebrow}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="press-panel rotate-1 p-3 md:p-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img src={activeSlide.image} alt={activeSlide.title} className="h-full w-full object-cover" />
                <span className="absolute left-0 top-6 bg-neon-red px-4 py-2 font-heading text-xl font-black uppercase text-black">This week</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading text-sm uppercase text-neon-red">{activeSlide.meta}</p>
                  <p className="mt-1 text-gray-300 font-heading">Featured on This Is Hip Hop Caribbean</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveHero((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-white hover:border-neon-red hover:text-neon-red transition"
                    aria-label="Previous hero slide"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHero((current) => (current + 1) % heroSlides.length)}
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-white hover:border-neon-red hover:text-neon-red transition"
                    aria-label="Next hero slide"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {user && (
        <section className="py-12 px-4 bg-black">
          <div className="max-w-7xl mx-auto neon-border bg-black/90 p-6 md:p-8">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 items-center">
              <div>
                <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-3">You are signed in</p>
                <h2 className="font-display text-5xl md:text-7xl text-white mb-4">MEMBER STUDIO</h2>
                <p className="text-gray-300 font-heading text-lg">
                  Your logged-in experience lives here: saved culture, creator stats, profile claims, article submissions, playlist suggestions, and member profile tools.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {memberStudioActions.map((action) => (
                  <Link key={action.to} to={action.to} className="border border-white/10 bg-white/[0.03] p-4 hover:border-neon-red hover:bg-neon-red/10 transition">
                    <action.icon className="w-7 h-7 text-neon-red mb-3" />
                    <h3 className="font-heading text-white uppercase tracking-wider">{action.label}</h3>
                    <p className="text-gray-400 text-sm mt-1">{action.text}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brand Expansion */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-neon-red/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="neon-border bg-black/80 p-8">
              <Ticket className="w-10 h-10 text-neon-red mb-4" />
              <h2 className="font-display text-4xl text-white mb-4">I Luv Hip Hop Weekly</h2>
              <p className="text-gray-300 font-heading">
                I Luv Hip Hop Weekly continues as the home base for dedicated hip hop nights, table reservations, and member access at Dulce Lounge, 22 Barbican Road.
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
              <Link to="/directory" className="inline-block mt-5 text-neon-red hover:text-white transition font-heading uppercase tracking-wider">
                View Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* People's Choice DJ @ Dulce Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-950/40 via-black to-purple-950/40 border-y-4 border-amber-500/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Starting August 2026 • Monthly DJ Feature @ Dulce
              </div>
              <h2 className="font-display text-5xl md:text-7xl text-white leading-tight">
                {"PEOPLE'S CHOICE"} <span className="text-amber-400">DJ SHOWCASE</span>
              </h2>
              <p className="text-gray-300 font-heading text-lg max-w-2xl">
                Every last Thursday of the month, ILHH features the DJ voted #1 by our community at Dulce Lounge. Nominate your favorite DJ, cast your daily vote, and decide who takes the stage!
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/peoples-choice-dj"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-heading font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Headphones className="w-5 h-5" />
                  Vote / Nominate a DJ
                </Link>
                <Link
                  to="/peoples-choice-dj"
                  className="px-6 py-3.5 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-heading font-bold text-sm uppercase tracking-wider transition"
                >
                  View Leaderboard & Rules
                </Link>
              </div>
            </div>
            <div className="border-2 border-amber-500/40 bg-black/90 p-6 md:p-8 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-black px-3 py-1 font-heading text-xs uppercase font-black">
                Featured Night
              </div>
              <p className="font-heading text-xs uppercase tracking-[0.2em] text-amber-400">Dulce Event Integration</p>
              <h3 className="font-display text-3xl text-white">LAST THURSDAY SHOWCASE</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The winning DJ gets prime 2-hour set booking, official event flyer spotlight, radio promo, and VIP table perks at Dulce Lounge.
              </p>
              <div className="pt-2 text-xs text-amber-300 font-mono border-t border-white/10 flex justify-between">
                <span>August Cycle: Active</span>
                <span>Location: Dulce Lounge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storefront Dispatch */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="press-label mb-5">Storefront dispatch</span>
              <h2 className="font-display text-5xl uppercase leading-[0.9] text-white md:text-8xl">
                New Drops. Hot Picks. Category Doors.
              </h2>
            </div>
            <div className="border-l-4 border-neon-red pl-5">
              <p className="font-body text-lg leading-8 text-gray-300">
                The home page now behaves like a shop window: latest products first, a tighter hot-products lane, and quick category routes for people who already know what they want.
              </p>
              <Link to="/merch" className="mt-5 inline-flex items-center gap-2 font-heading text-neon-red uppercase tracking-wider hover:text-white">
                <ShoppingBag className="h-5 w-5" />
                Open full store
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border-t-8 border-neon-red bg-[#e9e4da] p-5 text-black md:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#8f0710]">New products</p>
                  <h3 className="font-display text-4xl uppercase leading-none md:text-5xl">Fresh on the Rack</h3>
                </div>
                <Sparkles className="h-9 w-9 text-neon-red" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {newProducts.map((product) => (
                  <Link key={product.id} to={`/merch/product/${product.id}`} className="group grid grid-cols-[110px_1fr] gap-4 border border-black/15 bg-white/45 p-3 transition hover:border-neon-red hover:bg-white">
                    <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.imageClass}`}>
                      {product.badge && <span className="absolute left-2 top-2 z-10 bg-neon-red px-2 py-1 font-heading text-[10px] uppercase text-black">{product.badge}</span>}
                      {product.images[0]?.url ? (
                        <img src={normalizeImageUrl(product.images[0].url)} alt={product.images[0].alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black text-white">
                          <Shirt className="h-8 w-8 text-neon-red" />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col justify-between">
                      <div>
                        <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#8f0710]">{product.categoryLabel}</p>
                        <h4 className="mt-1 font-display text-2xl uppercase leading-none text-black group-hover:text-[#8f0710]">{product.name}</h4>
                      </div>
                      <p className="mt-3 font-heading text-xl font-bold">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="press-panel p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-xs uppercase tracking-[0.25em] text-neon-red">Hot products</p>
                    <h3 className="font-display text-4xl uppercase text-white">Moving Now</h3>
                  </div>
                  <Flame className="h-9 w-9 text-neon-red" />
                </div>
                <div className="space-y-3">
                  {hotProducts.map((product, index) => (
                    <Link key={product.id} to={`/merch/product/${product.id}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border border-white/10 bg-white/[0.03] p-3 transition hover:border-neon-red">
                      <span className="font-display text-3xl text-neon-red">{index + 1}</span>
                      <span>
                        <span className="block font-heading uppercase text-white">{product.name}</span>
                        <span className="block text-xs font-heading uppercase tracking-wider text-gray-500">{product.categoryLabel}</span>
                      </span>
                      <span className="font-heading text-white">${product.price.toFixed(0)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {merchCategories.map((category) => (
                  <Link key={category.id} to={`/merch/category/${category.id}`} className="border border-white/15 bg-black p-4 transition hover:border-neon-red hover:bg-neon-red hover:text-black">
                    <Shirt className="mb-4 h-6 w-6 text-neon-red" />
                    <p className="font-heading text-lg uppercase">{category.label}</p>
                    <p className="mt-1 text-xs font-heading uppercase tracking-wider text-gray-500">Explore</p>
                  </Link>
                ))}
                <Link to="/merch" className="border border-neon-red bg-neon-red p-4 text-black transition hover:bg-white">
                  <ShoppingBag className="mb-4 h-6 w-6" />
                  <p className="font-heading text-lg uppercase">All merch</p>
                  <p className="mt-1 text-xs font-heading uppercase tracking-wider text-black/60">Browse</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Board */}
      <section className="bg-[#111] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="press-label mb-5">Mini calendar</span>
              <h2 className="font-display text-5xl uppercase leading-none text-white md:text-8xl">The Next Rooms</h2>
            </div>
            <Link to="/weekly-lineup" className="press-button-secondary">Thursday Lineup</Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            {nextEvent && (
              <Link to={`/events/${nextEvent.id}`} className="group grid gap-5 border-t-8 border-neon-red bg-black p-5 md:grid-cols-[220px_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <img src={nextEvent.flyer_url || "/brand/ilhh-logo.png"} alt={`${nextEvent.title} flyer`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="mb-3 inline-flex bg-neon-red px-3 py-1 font-heading text-xs uppercase tracking-wider text-black">Next Thursday signal</p>
                    <h3 className="font-display text-4xl uppercase leading-none text-white md:text-6xl">{nextEvent.title}</h3>
                    {nextEvent.sub_theme && <p className="mt-2 font-heading text-2xl text-neon-red">{nextEvent.sub_theme}</p>}
                    <p className="mt-5 font-body text-gray-300">{nextEvent.description || nextEvent.theme || "RSVP, table reservations, happy hour energy, and the weekly hip hop home base."}</p>
                  </div>
                  <div className="mt-6 grid gap-3 font-heading text-white sm:grid-cols-2">
                    <p className="flex items-center"><Calendar className="mr-3 h-5 w-5 text-neon-red" />{formatEventDate(nextEvent)}</p>
                    <p className="flex items-center"><MapPin className="mr-3 h-5 w-5 text-neon-red" />{nextEvent.venue_name || "Dulce Lounge"}</p>
                  </div>
                </div>
              </Link>
            )}

            <div className="border border-white/15 bg-black">
              {upcomingEvents.slice(0, 5).map((event) => (
                <Link key={event.id} to={`/events/${event.id}`} className="grid grid-cols-[86px_1fr_auto] items-center gap-4 border-b border-white/10 p-4 transition last:border-b-0 hover:bg-white/[0.04]">
                  <span className="text-center">
                    <span className="block font-display text-4xl leading-none text-neon-red">{eventDateValue(event).getDate()}</span>
                    <span className="block font-heading text-xs uppercase tracking-wider text-gray-400">{eventDateValue(event).toLocaleDateString("en-US", { month: "short" })}</span>
                  </span>
                  <span>
                    <span className="block font-heading uppercase text-white">{event.title}</span>
                    <span className="block text-sm text-gray-500">{event.venue_name || "Venue TBA"}</span>
                  </span>
                  {isDesignatedRsvpEvent(event) ? <Ticket className="h-5 w-5 text-neon-red" /> : <Radio className="h-5 w-5 text-gray-500" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Rotation */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <span className="press-label mb-5">Latest rotation</span>
              <h2 className="font-display text-5xl uppercase leading-none text-white md:text-8xl">Mixes, Songs, Stories</h2>
              <p className="mt-4 max-w-3xl font-body text-lg leading-8 text-gray-300">
                Fresh audio and editorial should be visible from the front door, so the platform feels current before anyone taps into a section.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/music" className="press-button-secondary">Music</Link>
              <Link to="/stories" className="press-button-secondary">Articles</Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="press-panel p-5">
              <div className="mb-4 flex items-center gap-3">
                <Headphones className="h-8 w-8 text-neon-red" />
                <h3 className="font-display text-4xl uppercase text-white">Latest Mixtapes</h3>
              </div>
              <div className="space-y-3">
                {latestMixtapes.map((mixtape, index) => (
                  <Link key={mixtape.id} to={`/music/${mixtape.slug || mixtape.id}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border border-white/10 bg-white/[0.03] p-3 transition hover:border-neon-red">
                    <div className="aspect-square overflow-hidden bg-white/5">
                      {mixtape.cover_art_url ? <img src={mixtape.cover_art_url} alt={mixtape.title} className="h-full w-full object-cover" /> : <Music className="m-4 h-8 w-8 text-neon-red" />}
                    </div>
                    <span>
                      <span className="block font-heading uppercase text-white">{mixtape.title}</span>
                      <span className="block text-sm text-neon-red">DJ {mixtape.dj_name}</span>
                    </span>
                    <span className="font-display text-3xl text-gray-600">{index + 1}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t-8 border-neon-red bg-[#e9e4da] p-5 text-black">
              <div className="mb-4 flex items-center gap-3">
                <Newspaper className="h-8 w-8 text-neon-red" />
                <h3 className="font-display text-4xl uppercase">Latest Articles</h3>
              </div>
              <div className="space-y-3">
                {latestArticles.map((article) => (
                  <Link key={article.id} to={`/stories/${article.slug}`} className="grid gap-3 border border-black/15 bg-white/45 p-4 transition hover:border-neon-red hover:bg-white sm:grid-cols-[140px_1fr]">
                    <div className="aspect-video overflow-hidden bg-black">
                      {article.featured_image_url ? <img src={article.featured_image_url} alt={article.title} className="h-full w-full object-cover" /> : <FileText className="m-8 h-10 w-10 text-neon-red" />}
                    </div>
                    <span>
                      <span className="block font-heading text-xs uppercase tracking-wider text-[#8f0710]">{article.author || "This Is Hip Hop Caribbean"}</span>
                      <span className="mt-1 block font-display text-2xl uppercase leading-none">{article.title}</span>
                      {article.excerpt && <span className="mt-2 line-clamp-2 block text-sm leading-6 text-black/65">{article.excerpt}</span>}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
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
                        <span className="font-heading">{nextEvent.venue_name || "Dulce Lounge"}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <MapPin className="w-5 h-5 mr-3 text-neon-red opacity-0" />
                        <span className="font-heading text-gray-300">{nextEvent.venue_address || "22 Barbican Road"}</span>
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

      {/* Music Preview */}
      {mixtapes.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-5xl md:text-7xl neon-text-simple">
                MUSIC
              </h2>
              <Link
                to="/music"
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {mixtapes.map((mixtape) => (
                <Link
                  key={mixtape.id}
                  to={`/music/${mixtape.slug || mixtape.id}`}
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

      {/* Stories Preview */}
      {articles.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display text-5xl md:text-7xl neon-text-simple">
                STORIES
              </h2>
              <Link
                to="/stories"
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Read More
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/stories/${article.slug}`}
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
                      <span className="text-xs font-heading uppercase">Story</span>
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
                <Link to="/music" className="block text-gray-400 hover:text-neon-red transition font-heading">
                  Music
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
              <div className="mt-6">
                <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Connect</h3>
                <SocialCtas compact />
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-neon-red/30">
            <p className="text-sm text-gray-500">
              © 2026 This Is Hip Hop Caribbean. I Luv Hip Hop is our signature event and merchandise brand.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
