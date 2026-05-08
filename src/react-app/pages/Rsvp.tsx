import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, MapPin, Mic2, CheckCircle } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { EventWithDJs } from "@/shared/types";

export default function Rsvp() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventWithDJs | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package_type: "special",
    group_size: 2,
    bottle_selection: "",
    special_notes: "",
  });

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events?id=${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          setEvent(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          event_id: Number(eventId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setError("Failed to submit RSVP. Please try again.");
      setSubmitting(false);
    }
  };

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
          <h1 className="font-display text-4xl text-white mb-4">Event Not Found</h1>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="neon-border bg-black/80 backdrop-blur-md p-12 neon-glow">
              <CheckCircle className="w-20 h-20 text-neon-red mx-auto mb-6" />
              <h1 className="font-display text-5xl text-white mb-4">
                RSVP CONFIRMED!
              </h1>
              <p className="text-xl text-gray-300 mb-8 font-heading">
                We've received your RSVP and table reservation request for {event.sub_theme || event.title}.
              </p>
              <p className="text-gray-400 font-heading mb-8">
                You'll receive a confirmation email at {formData.email}
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-6xl md:text-8xl text-center mb-6 neon-text-simple animate-glow-pulse">
            RESERVE YOUR TABLE
          </h1>
          <p className="text-center text-xl text-gray-400 mb-10 font-heading max-w-3xl mx-auto">
            RSVP for designated I Luv Hip Hop events and request the table package that fits your group.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <div className="neon-border bg-black/80 backdrop-blur-md p-8">
              <h2 className="font-display text-4xl text-white mb-4">
                {event.sub_theme}
              </h2>
              <p className="text-lg text-neon-red mb-6 font-heading">
                Theme: {event.theme}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-white">
                  <Calendar className="w-5 h-5 mr-3 text-neon-red" />
                  <span className="font-heading">
                    {(() => {
                      const [y, m, d] = event.event_date.split('-').map(Number);
                      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      });
                    })()}
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <MapPin className="w-5 h-5 mr-3 text-neon-red" />
                  <span className="font-heading">{event.venue_name} - {event.venue_address}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-heading text-lg text-neon-red mb-4 flex items-center">
                  <Mic2 className="w-5 h-5 mr-2" />
                  DJ LINEUP
                </h3>
                <div className="space-y-3">
                  {event.djs.map((dj) => (
                    <div key={dj.id} className="border-l-2 border-neon-red pl-4">
                      <p className="font-heading text-white">{dj.dj_name}</p>
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

              <div className="space-y-4">
                <h3 className="font-heading text-lg text-white mb-3">TABLE PACKAGES</h3>
                <div className="border-l-2 border-neon-red/50 pl-4">
                  <p className="font-heading text-white">SPECIAL TABLE</p>
                  <p className="text-sm text-gray-400">Premium seating experience</p>
                </div>
                <div className="border-l-2 border-neon-red/50 pl-4">
                  <p className="font-heading text-white">VIP TABLE</p>
                  <p className="text-sm text-gray-400">Elevated VIP experience</p>
                </div>
                <div className="border-l-2 border-neon-red/50 pl-4">
                  <p className="font-heading text-white">MOGUL TABLE</p>
                  <p className="text-sm text-gray-400">Ultimate luxury experience</p>
                </div>
              </div>
            </div>

            {/* RSVP Form */}
            <div className="neon-border bg-black/80 backdrop-blur-md p-8">
              <h2 className="font-display text-3xl text-white mb-6">
                BOOKING DETAILS
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-heading mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Package Type *
                  </label>
                  <select
                    required
                    value={formData.package_type}
                    onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                  >
                    <option value="special">Special Table</option>
                    <option value="vip">VIP Table</option>
                    <option value="mogul">Mogul Table</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Group Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.group_size}
                    onChange={(e) => setFormData({ ...formData, group_size: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Bottle Selection
                  </label>
                  <input
                    type="text"
                    value={formData.bottle_selection}
                    onChange={(e) => setFormData({ ...formData, bottle_selection: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-white font-heading mb-2">
                    Special Notes
                  </label>
                  <textarea
                    value={formData.special_notes}
                    onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                    rows={3}
                    placeholder="Any special requests?"
                    className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-neon-red/20 border border-neon-red text-white font-heading">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Confirm Reservation"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
