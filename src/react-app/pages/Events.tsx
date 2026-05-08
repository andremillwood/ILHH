import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Filter, Radio, Ticket } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";
import { isDesignatedRsvpEvent } from "@/react-app/lib/platform";

type EventFilter = "upcoming" | "past" | "all";

export default function Events() {
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventFilter>("upcoming");

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
  const filteredEvents = events.filter((event) => {
    const [y, m, d] = event.event_date.split('-').map(Number);
    const eventDate = new Date(y, m - 1, d);
    if (filter === "upcoming") {
      return eventDate >= now;
    } else if (filter === "past") {
      return eventDate < now;
    }
    return true;
  });

  const upcomingCount = events.filter((e) => {
    const [y, m, d] = e.event_date.split('-').map(Number);
    return new Date(y, m - 1, d) >= now;
  }).length;
  const pastCount = events.filter((e) => {
    const [y, m, d] = e.event_date.split('-').map(Number);
    return new Date(y, m - 1, d) < now;
  }).length;
  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-6xl md:text-8xl text-center mb-4 neon-text-simple animate-glow-pulse">
            HIP HOP EVENTS
          </h1>
          <p className="text-center text-xl text-gray-400 mb-12 font-heading max-w-3xl mx-auto">
            This Is Hip Hop Caribbean promotes the flagship I Luv Hip Hop weekly event and trusted nights where DJs and promoters are representing hip hop across the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/submit-event" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Submit Event
            </Link>
            <Link to="/profiles" className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center">
              View DJ & Promoter Profiles
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center mb-8">
            <div className="neon-border bg-black/80 backdrop-blur-md inline-flex">
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
          </div>

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
            <div className="space-y-8">
              {filteredEvents.map((event) => {
                const [y, m, d] = event.event_date.split('-').map(Number);
                const eventDate = new Date(y, m - 1, d);
                const isPast = eventDate < now;
                const isDesignated = isDesignatedRsvpEvent(event.title);

                return (
                  <div
                    key={event.id}
                    className={`neon-border bg-black/80 backdrop-blur-md p-8 md:p-10 hover:neon-glow transition ${isPast ? "opacity-60" : ""
                      }`}
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
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
                          <h2 className="font-display text-4xl md:text-5xl text-white mb-2">
                            <Link to={`/events/${event.id}`} className="hover:text-neon-red transition">
                              {event.title}
                            </Link>
                          </h2>
                          {event.sub_theme && (
                            <h3 className="font-heading text-2xl text-neon-red mb-2">
                              {event.sub_theme}
                            </h3>
                          )}
                          <p className="text-lg text-gray-400 font-heading">
                            Theme: {event.theme}
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
                          <div className="flex items-center text-white">
                            <MapPin className="w-5 h-5 mr-3 text-neon-red" />
                            <span className="font-heading">{event.venue_name} - {event.venue_address}</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-heading text-lg text-neon-red mb-3 flex items-center">
                            <Mic2 className="w-5 h-5 mr-2" />
                            DJ LINEUP
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {event.djs.map((dj) => (
                              <div key={dj.id} className="border-l-2 border-neon-red/50 pl-3">
                                <p className="font-heading text-white">{dj.dj_name}</p>
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

                        {!isPast && isDesignated && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to={`/events/${event.id}`}
                              className="inline-block px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center"
                            >
                              Event Details
                            </Link>
                            <Link
                              to={`/rsvp/${event.id}`}
                              className="inline-block px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center"
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

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-display text-neon-red mb-2">
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
