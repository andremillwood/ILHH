import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Filter, Radio, Ticket, Search, SlidersHorizontal, X } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";
import { isDesignatedRsvpEvent } from "@/react-app/lib/platform";

type EventFilter = "upcoming" | "past" | "all";
type EventTypeFilter = "all" | "ilhh" | "rsvp" | "promoted";
type EventSort = "date-asc" | "date-desc" | "title-asc";

const eventDateValue = (event: EventWithDJs) => {
  const [year, month, day] = event.event_date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const monthKey = (event: EventWithDJs) => event.event_date.slice(0, 7);

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function Events() {
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventFilter>("upcoming");
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<EventSort>("date-asc");
  const [query, setQuery] = useState("");

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

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(events.map(monthKey))).sort();
    return keys.map((key) => ({ key, label: formatMonthLabel(key) }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const search = query.trim().toLowerCase();

    return events
      .filter((event) => {
        const eventDate = eventDateValue(event);
        if (filter === "upcoming" && eventDate < now) return false;
        if (filter === "past" && eventDate >= now) return false;
        if (monthFilter !== "all" && monthKey(event) !== monthFilter) return false;

        const isDesignated = isDesignatedRsvpEvent(event);
        const isIlhh = [event.title, event.theme, event.sub_theme, event.venue_name].filter(Boolean).join(" ").toLowerCase().includes("ilhh")
          || [event.title, event.theme, event.sub_theme].filter(Boolean).join(" ").toLowerCase().includes("i luv hip hop")
          || isDesignated;

        if (typeFilter === "rsvp" && !isDesignated) return false;
        if (typeFilter === "promoted" && isDesignated) return false;
        if (typeFilter === "ilhh" && !isIlhh) return false;

        if (!search) return true;
        const searchable = [
          event.title,
          event.theme,
          event.sub_theme,
          event.description,
          event.venue_name,
          event.venue_address,
          ...event.djs.map((dj) => `${dj.dj_name} ${dj.dj_description || ""}`),
        ].filter(Boolean).join(" ").toLowerCase();

        return searchable.includes(search);
      })
      .sort((a, b) => {
        if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
        const diff = eventDateValue(a).getTime() - eventDateValue(b).getTime();
        return sortOrder === "date-desc" ? -diff : diff;
      });
  }, [events, filter, monthFilter, now, query, sortOrder, typeFilter]);

  const upcomingCount = events.filter((e) => {
    return eventDateValue(e) >= now;
  }).length;
  const pastCount = events.filter((e) => {
    return eventDateValue(e) < now;
  }).length;
  const clearFilters = () => {
    setFilter("upcoming");
    setTypeFilter("all");
    setMonthFilter("all");
    setSortOrder("date-asc");
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="px-4 pb-20 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-b-8 border-neon-red pb-8">
            <span className="press-label mb-5">Kingston night calendar</span>
            <h1 className="max-w-5xl font-display text-6xl uppercase leading-[0.88] text-white md:text-9xl">The Thursday Programme</h1>
            <p className="mt-6 max-w-3xl font-body text-lg leading-8 text-gray-300">Flyers, lineups and rooms carrying hip hop culture across Kingston and the wider Caribbean. RSVP first, reach early, stay for the pull-up.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/submit-event" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Submit Event
            </Link>
            <Link to="/profiles" className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center">
              View DJ & Promoter Profiles
            </Link>
          </div>

          <section className="mb-10 border border-white/15 bg-black/85 p-4 shadow-[10px_10px_0_rgba(255,0,0,0.22)] md:p-6" aria-label="Event calendar filters">
            <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-heading text-xs uppercase tracking-[0.35em] text-neon-red">Find the room</p>
                <h2 className="mt-2 font-display text-4xl uppercase text-white md:text-5xl">Filter the Calendar</h2>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-3 font-heading text-sm uppercase tracking-wider text-white transition hover:border-neon-red hover:text-neon-red"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="mb-5 grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-gray-400">
                  <Search className="h-4 w-4 text-neon-red" />
                  Search
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search theme, DJ, venue, perks..."
                  className="w-full border border-white/15 bg-white/[0.04] px-4 py-3 font-heading text-white outline-none transition placeholder:text-gray-600 focus:border-neon-red"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-gray-400">
                  <Calendar className="h-4 w-4 text-neon-red" />
                  Month
                </span>
                <select
                  value={monthFilter}
                  onChange={(event) => setMonthFilter(event.target.value)}
                  className="w-full border border-white/15 bg-black px-4 py-3 font-heading text-white outline-none transition focus:border-neon-red"
                >
                  <option value="all">All months</option>
                  {monthOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-gray-400">
                  <Ticket className="h-4 w-4 text-neon-red" />
                  Event Type
                </span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as EventTypeFilter)}
                  className="w-full border border-white/15 bg-black px-4 py-3 font-heading text-white outline-none transition focus:border-neon-red"
                >
                  <option value="all">All types</option>
                  <option value="ilhh">ILHH Weekly</option>
                  <option value="rsvp">RSVP perks</option>
                  <option value="promoted">Promoted only</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-gray-400">
                  <SlidersHorizontal className="h-4 w-4 text-neon-red" />
                  Order
                </span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as EventSort)}
                  className="w-full border border-white/15 bg-black px-4 py-3 font-heading text-white outline-none transition focus:border-neon-red"
                >
                  <option value="date-asc">Soonest first</option>
                  <option value="date-desc">Latest first</option>
                  <option value="title-asc">A to Z</option>
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="neon-border bg-black/80 backdrop-blur-md inline-flex overflow-x-auto">
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition ${filter === "upcoming"
                  ? "bg-neon-red text-black"
                  : "text-white hover:text-neon-red"
                  }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition border-l border-neon-red/30 ${filter === "past"
                  ? "bg-neon-red text-black"
                  : "text-white hover:text-neon-red"
                  }`}
              >
                Past Events ({pastCount})
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition border-l border-neon-red/30 ${filter === "all"
                  ? "bg-neon-red text-black"
                  : "text-white hover:text-neon-red"
                  }`}
              >
                All Events ({events.length})
              </button>
              </div>
              <p className="font-heading text-sm uppercase tracking-[0.2em] text-gray-400">
                Showing <span className="text-white">{filteredEvents.length}</span> of <span className="text-white">{events.length}</span> listings
              </p>
            </div>
          </section>

          {loading ? (
            <div className="text-center text-white font-heading">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg">
                  {filter === "upcoming"
                    ? "No upcoming events scheduled yet. Check back soon!"
                    : "No past events to display."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              {filteredEvents.map((event) => {
                const eventDate = eventDateValue(event);
                const isPast = eventDate < now;
                const isDesignated = isDesignatedRsvpEvent(event);

                return (
                  <div
                    key={event.id}
                    className={`group border-t border-white/30 bg-black pt-6 transition ${isPast ? "opacity-60" : ""
                      }`}
                  >
                    <div className="grid gap-7 md:grid-cols-[260px_1fr_120px] lg:grid-cols-[320px_1fr_140px]">
                      <Link to={`/events/${event.id}`} className="relative block aspect-[2/3] overflow-hidden bg-white/5">
                        <img src={event.flyer_url || '/ilhh_logo1.png'} alt={`${event.title} flyer`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                        {isPast && <span className="absolute left-0 top-5 bg-black px-4 py-2 font-heading text-sm font-bold uppercase tracking-widest text-white">Archive</span>}
                      </Link>
                      <div>
                        <div className="mb-4">
                          {isPast && (
                            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-xs font-heading uppercase tracking-wider mb-2">
                              Past Event
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 bg-black border border-neon-red/50 text-neon-red text-xs font-heading uppercase tracking-wider mb-2">
                            {isDesignated ? (
                              <>
                                <Ticket className="w-3 h-3 mr-2" />
                                Designated RSVP Event
                              </>
                            ) : (
                              <>
                                <Radio className="w-3 h-3 mr-2" />
                                Promoted Hip Hop Event
                              </>
                            )}
                          </span>
                          {isDesignated && (
                            <span className="ml-2 inline-flex items-center px-3 py-1 bg-neon-red/10 border border-neon-red/40 text-neon-red text-xs font-heading uppercase tracking-wider">
                              RSVP perks, drink deals and table bookings
                            </span>
                          )}
                          <h2 className="mb-2 font-display text-4xl uppercase leading-none text-white md:text-6xl">
                            <Link to={`/events/${event.id}`} className="hover:text-neon-red transition">
                              {event.title}
                            </Link>
                          </h2>
                          {event.sub_theme && (
                            <h3 className="font-heading text-2xl text-neon-red mb-2">
                              {event.sub_theme}
                            </h3>
                          )}
                          <p className="font-heading text-lg font-bold uppercase tracking-wider text-gray-400">
                            {event.theme}
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-white">
                            <Calendar className="w-5 h-5 mr-3 text-neon-red" />
                            <span className="font-heading">
                              {eventDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className={`border p-4 ${isDesignated ? "border-neon-red bg-neon-red/10" : "border-white/10 bg-white/[0.03]"}`}>
                            <div className="flex items-start text-white">
                              <MapPin className="w-6 h-6 mr-3 mt-1 text-neon-red flex-shrink-0" />
                              <div>
                                <p className="text-xs font-heading uppercase tracking-[0.25em] text-neon-red mb-1">Venue</p>
                                <p className="font-heading text-2xl text-white">{event.venue_name || (isDesignated ? "Dulce Lounge" : "Venue TBA")}</p>
                                <p className="font-heading text-gray-300">{event.venue_address || (isDesignated ? "22 Barbican Road" : "Address TBA")}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-heading text-lg text-neon-red mb-3 flex items-center">
                            <Mic2 className="w-5 h-5 mr-2" />
                            DJ LINEUP
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {event.djs.length > 0 ? event.djs.map((dj) => (
                              <div key={dj.id} className="border-l-2 border-neon-red/50 pl-3">
                                <p className="font-heading text-white">{dj.dj_name}</p>
                                {dj.dj_description && (
                                  <p className="text-sm text-gray-400">{dj.dj_description}</p>
                                )}
                                {Boolean(dj.is_resident) && (
                                  <span className="text-xs text-neon-red">RESIDENT</span>
                                )}
                              </div>
                            )) : (
                              <div className="border-l-2 border-white/20 pl-3">
                                <p className="font-heading text-white">Lineup TBA</p>
                                <p className="text-sm text-gray-400">Artwork and DJs can be added from admin.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {!isPast && isDesignated && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to={`/events/${event.id}`}
                              className="press-button-secondary"
                            >
                              Event Details
                            </Link>
                            <Link
                              to={`/rsvp/${event.id}`}
                              className="press-button"
                            >
                              RSVP & Reserve Table
                            </Link>
                          </div>
                        )}
                        {!isPast && !isDesignated && (
                          <div>
                            <Link
                              to={`/events/${event.id}`}
                              className="inline-block px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center mb-3"
                            >
                              Event Details
                            </Link>
                            <p className="text-sm text-gray-500 font-heading">
                              Listed for discovery. RSVP and table reservations are available on designated I Luv Hip Hop events.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-start border-l border-white/20 pl-5 md:justify-center">
                        <div className="text-left md:text-center">
                          <div className="mb-1 font-display text-7xl leading-none text-neon-red md:text-8xl">
                            {eventDate.getDate()}
                          </div>
                          <div className="text-xl font-heading text-white uppercase">
                            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-lg font-heading text-gray-400">
                            {eventDate.getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
