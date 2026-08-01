import { Link, useLocation } from "react-router";
import { BarChart3, Bookmark, CalendarDays, ChevronDown, FileText, LayoutDashboard, Menu, Mic2, Minus, Music, PenLine, Plus, Search, ShoppingBag, Tag, Trash2, UserCircle, Users, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import SearchBar from "@/react-app/components/SearchBar";
import { useCart } from "@/react-app/lib/CartContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `text-white hover:text-neon-red transition font-heading uppercase tracking-wider text-sm ${isActive(path) ? "text-neon-red" : ""
    }`;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-4 border-neon-red bg-black/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png"
                alt="This Is Hip Hop Caribbean"
                className="h-12 w-auto"
              />
            </Link>
            <span className="ml-3 hidden xl:block border-l border-white/30 pl-3 font-heading text-white uppercase tracking-[0.16em] text-xs leading-tight">
              <span className="text-neon-red">This Is Hip Hop Caribbean</span><br />
              Kingston, Jamaica<br />
              <Link to="/weekly-lineup" className="hover:text-neon-red transition">
                Every Thursday
              </Link>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsMegaOpen((open) => !open)}
                className={`inline-flex items-center gap-1 text-white hover:text-neon-red transition font-heading uppercase tracking-wider text-sm ${isActive("/events") || isActive("/music") || isActive("/mixtapes") || isActive("/stories") || isActive("/articles") || isActive("/directory") || isActive("/profiles") ? "text-neon-red" : ""}`}
                aria-expanded={isMegaOpen}
              >
                Explore
                <ChevronDown className="h-4 w-4" />
              </button>
              {isMegaOpen && <MegaMenu />}
            </div>
            <Link to="/merch" className={linkClass("/merch")}>
              Merch
            </Link>
            <Link to="/community" className={linkClass("/community")}>
              Community
            </Link>
            <Link to="/peoples-choice-dj" className={`relative ${linkClass("/peoples-choice-dj")}`}>
              DJ Vote
              <span className="ml-1 text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">NEW</span>
            </Link>
            <Link to={user ? "/home" : "/membership"} className={linkClass(user ? "/home" : "/membership")}>
              {user ? "Home" : "Membership"}
            </Link>
            <Link to="/submit-event" className={linkClass("/submit-event")}>
              Submit
            </Link>

            {/* Search */}
            <SearchBar />

            <HeaderCartDropdown isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

            {loading ? (
              <div className="w-20 h-8 bg-gray-800 animate-pulse rounded"></div>
            ) : user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsStudioOpen(true)}
                onMouseLeave={() => setIsStudioOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsStudioOpen((open) => !open)}
                  className="flex items-center gap-2 border border-neon-red/60 bg-neon-red px-4 py-2 text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
                  aria-expanded={isStudioOpen}
                >
                  <UserCircle className="w-5 h-5" />
                  Studio
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isStudioOpen && (
                  <div className="absolute right-0 top-full w-[340px] pt-4">
                    <div className="border border-neon-red/40 bg-black/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
                      <p className="mb-3 border-b border-white/10 pb-3 text-xs text-gray-400">{user.email}</p>
                      <div className="space-y-2">
                        {studioLinks.map((item) => (
                          <Link key={item.to} to={item.to} className="flex gap-3 border border-white/10 bg-white/[0.03] p-3 hover:border-neon-red hover:bg-neon-red/10 transition" onClick={() => setIsStudioOpen(false)}>
                            <item.icon className="mt-1 h-5 w-5 text-neon-red" />
                            <span>
                              <span className="block font-heading text-sm uppercase tracking-wider text-white">{item.label}</span>
                              <span className="block text-xs leading-5 text-gray-400">{item.text}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="mt-3 w-full border border-white/20 px-4 py-2 text-white hover:border-neon-red hover:text-neon-red transition font-heading uppercase tracking-wider"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-neon-red/30 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 py-6 space-y-5">
            <Link
              to="/"
              className={`block ${linkClass("/")}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {mobileMenuLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border border-white/10 bg-white/[0.03] p-3 text-white hover:border-neon-red hover:text-neon-red transition"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mb-2 h-5 w-5 text-neon-red" />
                  <span className="font-heading text-sm uppercase tracking-wider">{item.label}</span>
                </Link>
              ))}
            </div>
            <Link
              to="/merch"
              className={`block ${linkClass("/merch")}`}
              onClick={() => setIsOpen(false)}
            >
              Merch
            </Link>
            <Link
              to="/community"
              className={`block ${linkClass("/community")}`}
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/membership"
              className={`block ${linkClass("/membership")}`}
              onClick={() => setIsOpen(false)}
            >
              Membership
            </Link>
            {user && (
              <div className="border border-neon-red/40 bg-neon-red/10 p-4">
                <p className="mb-3 font-heading text-sm uppercase tracking-[0.25em] text-neon-red">Member Studio</p>
                <div className="grid gap-3">
                  {studioLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex gap-3 border border-white/10 bg-black/60 p-3 text-white hover:border-neon-red hover:text-neon-red transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-neon-red" />
                      <span>
                        <span className="block font-heading text-sm uppercase tracking-wider">{item.label}</span>
                        <span className="block text-xs text-gray-400">{item.text}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link
              to="/submit-event"
              className={`block ${linkClass("/submit-event")}`}
              onClick={() => setIsOpen(false)}
            >
              Submit Event
            </Link>
            <div className="border-t border-white/10 pt-5">
              <HeaderCartDropdown isOpen={true} setIsOpen={() => undefined} compact />
            </div>
            {loading ? (
              <div className="w-full h-8 bg-gray-800 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <div className="text-white text-sm py-2">{user.email}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-white hover:text-neon-red transition font-heading uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="w-full px-6 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const mobileMenuLinks = [
  { to: "/home", label: "Home", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/happy-hour", label: "Happy Hour", icon: Tag },
  { to: "/music", label: "Music", icon: Music },
  { to: "/stories", label: "Stories", icon: FileText },
  { to: "/directory", label: "Directory", icon: Mic2 },
  { to: "/gallery", label: "Gallery", icon: Search },
];

const studioLinks = [
  { to: "/home", label: "Home", text: "Your feed, saved items, stats, submissions, and claims.", icon: LayoutDashboard },
  { to: "/membership", label: "My Profile", text: "Edit membership and submit creator profiles.", icon: UserCircle },
  { to: "/submit-article", label: "Submit Story", text: "Pitch reviews, recaps, interviews, and scene reports.", icon: PenLine },
  { to: "/playlists", label: "Playlist Hub", text: "Suggest tracks and vote on community rankings.", icon: Music },
  { to: "/directory", label: "Directory", text: "Find, follow, save, or claim creator profiles.", icon: Mic2 },
  { to: "/music", label: "Music Library", text: "Like and save mixes for your library.", icon: Bookmark },
  { to: "/admin", label: "Admin", text: "Review profiles, stories, claims, events, and playlists.", icon: BarChart3 },
];

function MegaMenu() {
  const groups = [
    {
      title: "Events",
      icon: CalendarDays,
      links: [
        { to: "/events", label: "Event Calendar", text: "I Luv Hip Hop Weekly and promoted hip hop events." },
        { to: "/peoples-choice-dj", label: "DJ Vote @ Dulce", text: "Nominate & vote for People's Choice DJ featured every Last Thursday." },
        { to: "/happy-hour", label: "Happy Hour", text: "Member coupons and early-night perks." },
        { to: "/submit-event", label: "Submit Event", text: "Promoter and DJ event intake." },
      ],
    },
    {
      title: "Culture",
      icon: Music,
      links: [
        { to: "/music", label: "Music", text: "DJ sets, uploads, mixtapes, and featured mixes." },
        { to: "/playlists", label: "Playlist Hub", text: "ILHH playlists, community rankings, and streaming links." },
        { to: "/stories", label: "Stories", text: "Culture coverage, articles, recaps, and features." },
        { to: "/submit-article", label: "Submit Story", text: "Member pitches, reviews, recaps, and scene reports." },
        { to: "/gallery", label: "Gallery", text: "Event photography and captured moments." },
      ],
    },
    {
      title: "Community",
      icon: Users,
      links: [
        { to: "/directory", label: "Directory", text: "DJs, artists, promoters, venues, and creators." },
        { to: "/community", label: "Community", text: "Join the wider Caribbean hip hop network." },
        { to: "/membership", label: "Membership", text: "Newsletter, RSVP access, and perks." },
        { to: "/home", label: "Home", text: "Saved culture, creator stats, claims, and submissions." },
      ],
    },
  ];

  return (
    <div className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-6">
      <div className="border border-neon-red/40 bg-black/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-5">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-4 flex items-center gap-2 text-neon-red">
                <group.icon className="h-5 w-5" />
                <h3 className="font-heading uppercase tracking-wider">{group.title}</h3>
              </div>
              <div className="space-y-2">
                {group.links.map((item) => (
                  <Link key={item.to} to={item.to} className="block border border-white/10 bg-white/[0.03] p-3 hover:border-neon-red/70 hover:bg-neon-red/10 transition">
                    <span className="block font-heading text-white uppercase tracking-wider text-sm">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-400">{item.text}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-5 border-t border-white/10 pt-5">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.25em] text-neon-red">Official Store</p>
            <p className="mt-1 text-sm text-gray-300">Shop ILHH merch, then move straight into checkout or membership drop alerts.</p>
          </div>
          <Link to="/merch" className="inline-flex items-center gap-2 border border-neon-red bg-neon-red px-5 py-3 font-heading uppercase tracking-wider text-black hover:bg-black hover:text-neon-red transition">
            <ShoppingBag className="h-4 w-4" />
            Shop Merch
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeaderCartDropdown({ isOpen, setIsOpen, compact = false }: { isOpen: boolean; setIsOpen: (open: boolean) => void; compact?: boolean }) {
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const cart = useCart();

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items, affiliateCode: cart.affiliateCode }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is not available yet.");
      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout is not available yet.");
      setCheckingOut(false);
    }
  };

  const panel = (
    <div className={`${compact ? "" : "absolute right-0 top-full mt-4 w-[360px]"} border border-neon-red/40 bg-black/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg uppercase tracking-wider text-white">Shopping Cart</h2>
        <span className="font-heading text-sm text-neon-red">{cart.itemCount} items</span>
      </div>
      {cart.items.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.03] p-4">
          <p className="font-heading text-gray-300">Your cart is empty.</p>
          <Link to="/merch" onClick={() => setIsOpen(false)} className="mt-3 inline-flex items-center gap-2 text-neon-red hover:text-white transition font-heading uppercase tracking-wider text-sm">
            <ShoppingBag className="h-4 w-4" />
            Shop merch
          </Link>
        </div>
      ) : (
        <>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.variantId} className="border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.color} / {item.size} / ${item.price.toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => cart.removeItem(item.variantId)} className="text-gray-500 hover:text-neon-red" aria-label="Remove item">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <button type="button" onClick={() => cart.updateQuantity(item.variantId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center border border-white/20 text-neon-red" aria-label="Decrease quantity">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex h-8 w-10 items-center justify-center border-y border-white/20 text-sm font-heading text-white">{item.quantity}</span>
                    <button type="button" onClick={() => cart.updateQuantity(item.variantId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center border border-white/20 text-neon-red" aria-label="Increase quantity">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-heading text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-4 flex justify-between font-heading text-white">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            {checkoutError && <p className="mb-3 border border-neon-red/60 bg-neon-red/15 p-3 text-sm text-white">{checkoutError}</p>}
            <button type="button" onClick={handleCheckout} disabled={checkingOut} className="w-full border border-neon-red bg-neon-red px-5 py-3 font-heading uppercase tracking-wider text-black hover:bg-black hover:text-neon-red transition disabled:opacity-60">
              {checkingOut ? "Opening Checkout..." : "Checkout"}
            </button>
            <Link to="/merch#cart" onClick={() => setIsOpen(false)} className="mt-3 block text-center font-heading text-sm uppercase tracking-wider text-neon-red hover:text-white transition">
              View full cart
            </Link>
          </div>
        </>
      )}
    </div>
  );

  if (compact) return panel;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:border-neon-red hover:text-neon-red transition"
        aria-label="Open shopping cart"
        aria-expanded={isOpen}
      >
        <ShoppingBag className="h-5 w-5" />
        {cart.itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-red px-1 text-xs font-bold text-black">
            {cart.itemCount}
          </span>
        )}
      </button>
      {isOpen && panel}
    </div>
  );
}
