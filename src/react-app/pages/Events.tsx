import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Filter } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";

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
    const eventDate = new Date(event.event_date);
    if (filter === "upcoming") {
      return eventDate >= now;
    } else if (filter === "past") {
      return eventDate < now;
    }
    return true;
  });

  const upcomingCount = events.filter((e) => new Date(e.event_date) >= now).length;
  const pastCount = events.filter((e) => new Date(e.event_date) < now).length;

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-6xl md:text-8xl text-center mb-4 neon-text-simple animate-glow-pulse">
            EVENTS CALENDAR
          </h1>
          <p className="text-center text-xl text-gray-400 mb-12 font-heading">
            Every Thursday Night at Dulce Lounge
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center mb-8">
            <div className="neon-border bg-black/80 backdrop-blur-md inline-flex">
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition ${
                  filter === "upcoming"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition border-l border-neon-red/30 ${
                  filter === "past"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                }`}
              >
                Past Events ({pastCount})
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 font-heading uppercase tracking-wider transition border-l border-neon-red/30 ${
                  filter === "all"
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
                const eventDate = new Date(event.event_date);
                const isPast = eventDate < now;
                
                return (
                  <div 
                    key={event.id} 
                    className={`neon-border bg-black/80 backdrop-blur-md p-8 md:p-10 hover:neon-glow transition ${
                      isPast ? "opacity-60" : ""
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
                          <h2 className="font-display text-4xl md:text-5xl text-white mb-2">
                            {event.sub_theme}
                          </h2>
                          <p className="text-lg text-neon-red font-heading">
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

                        {!isPast && (
                          <Link 
                            to={`/rsvp/${event.id}`}
                            className="inline-block px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
                          >
                            RSVP Now
                          </Link>
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
