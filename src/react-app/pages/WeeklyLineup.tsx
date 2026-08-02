import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Mic2, Ticket } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";
import { isDesignatedRsvpEvent } from "@/react-app/lib/platform";

const eventDateValue = (event: EventWithDJs) => {
  const [year, month, day] = event.event_date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function WeeklyLineup() {
  const [events, setEvents] = useState<EventWithDJs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const weeklyEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => eventDateValue(event) >= today)
      .filter((event) => {
        const text = [event.title, event.theme, event.sub_theme, event.description, event.venue_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return isDesignatedRsvpEvent(event) || text.includes("i luv hip hop") || text.includes("ilhh");
      })
      .sort((a, b) => eventDateValue(a).getTime() - eventDateValue(b).getTime());
  }, [events]);

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 border-b-8 border-neon-red pb-8">
            <span className="press-label mb-5">This Is Hip Hop Caribbean</span>
            <h1 className="max-w-5xl font-display text-6xl uppercase leading-[0.88] text-white md:text-9xl">
              Thursday Weekly Lineup
            </h1>
            <p className="mt-6 max-w-3xl font-body text-lg leading-8 text-gray-300">
              The weekly I Luv Hip Hop programme: upcoming themes, DJs, RSVP access, and table reservation links for Thursday nights in Kingston.
            </p>
          </div>

          {loading ? (
            <div className="text-center font-heading text-xl text-white">Loading lineup...</div>
          ) : weeklyEvents.length === 0 ? (
            <div className="neon-border bg-black/80 p-10 text-center">
              <p className="font-heading text-lg text-gray-300">The next Thursday lineup is being updated.</p>
              <Link to="/events" className="mt-5 inline-block press-button">View Full Calendar</Link>
            </div>
          ) : (
            <div className="space-y-8">
              {weeklyEvents.map((event, index) => {
                const eventDate = eventDateValue(event);
                const isIndependence = event.id === 30 || event.event_date === "2026-08-06";
                const eventLink = isIndependence ? "/independence" : `/events/${event.id}`;
                const eventFlyer = event.flyer_url || (isIndependence ? "/flyers/aug-week1-independence.jpg" : "/brand/ilhh-logo.png");

                return (
                  <article
                    key={event.id}
                    className={`grid gap-6 bg-black p-6 md:grid-cols-[200px_1fr_180px] transition ${
                      isIndependence
                        ? "border-t-8 border-amber-500 bg-gradient-to-r from-amber-950/40 via-black to-emerald-950/40 shadow-xl"
                        : "border-t border-white/25"
                    }`}
                  >
                    <Link to={eventLink} className="relative block aspect-[4/5] overflow-hidden bg-white/5 rounded">
                      <img src={eventFlyer} alt={`${event.title} flyer`} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
                      {isIndependence ? (
                        <span className="absolute left-0 top-3 bg-amber-400 font-black text-black px-3 py-1 font-heading text-xs uppercase tracking-widest">
                          🇯🇲 INDEPENDENCE SPECIAL
                        </span>
                      ) : index === 0 ? (
                        <span className="absolute left-0 top-3 bg-neon-red px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest text-black">
                          Next Up
                        </span>
                      ) : null}
                    </Link>

                    <div>
                      <p className={`mb-3 inline-flex items-center px-3 py-1 font-heading text-xs uppercase tracking-wider ${
                        isIndependence ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300" : "border border-neon-red/50 text-neon-red"
                      }`}>
                        <Ticket className="mr-2 h-3 w-3" />
                        {isIndependence ? "FREE Entry in Full Black w/ RSVP • $500 RSVP • $1,000 Gate" : "RSVP perks and table bookings"}
                      </p>
                      <h2 className="font-display text-4xl uppercase leading-none text-white md:text-6xl">
                        <Link to={eventLink} className="transition hover:text-amber-400">{event.title}</Link>
                      </h2>
                      {event.sub_theme && (
                        <p className={`mt-2 font-heading text-2xl ${isIndependence ? "text-amber-400" : "text-neon-red"}`}>
                          {event.sub_theme}
                        </p>
                      )}
                      <div className="mt-5 grid gap-3 text-white sm:grid-cols-2">
                        <p className="flex items-center font-heading">
                          <Calendar className={`mr-3 h-5 w-5 ${isIndependence ? "text-amber-400" : "text-neon-red"}`} />
                          {eventDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </p>
                        <p className="flex items-center font-heading">
                          <MapPin className={`mr-3 h-5 w-5 ${isIndependence ? "text-amber-400" : "text-neon-red"}`} />
                          {event.venue_name || "Dulce Lounge"}
                        </p>
                      </div>
                      <div className="mt-6">
                        <h3 className={`mb-3 flex items-center font-heading text-lg ${isIndependence ? "text-amber-400" : "text-neon-red"}`}>
                          <Mic2 className="mr-2 h-5 w-5" />
                          DJ Lineup
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {event.djs.length > 0 ? event.djs.map((dj) => (
                            <div key={dj.id} className={`border-l-2 pl-3 ${isIndependence ? "border-amber-400" : "border-neon-red/50"}`}>
                              <p className="font-heading text-white">{dj.dj_name}</p>
                              {dj.dj_description && <p className="text-sm text-gray-400">{dj.dj_description}</p>}
                            </div>
                          )) : (
                            <div className="border-l-2 border-white/20 pl-3">
                              <p className="font-heading text-white">Lineup TBA</p>
                              <p className="text-sm text-gray-400">Check back for the announced selectors.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:items-stretch md:justify-center">
                      <Link to={eventLink} className="press-button-secondary text-center">
                        {isIndependence ? "Special Landing Page" : "Details"}
                      </Link>
                      <Link
                        to={isIndependence ? "/independence#rsvp-form" : `/rsvp/${event.id}`}
                        className={`text-center transition font-display uppercase tracking-wider py-3 ${
                          isIndependence ? "bg-amber-500 hover:bg-amber-400 text-black" : "press-button"
                        }`}
                      >
                        RSVP FREE IN BLACK
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
