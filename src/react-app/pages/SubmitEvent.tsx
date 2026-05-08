import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle, Send } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

const initialForm = {
  event_title: "",
  event_date: "",
  event_time: "",
  venue_name: "",
  venue_address: "",
  city_country: "",
  event_type: "Promoted Hip Hop Event",
  lineup: "",
  promoter_name: "",
  promoter_email: "",
  promoter_phone: "",
  instagram_handle: "",
  flyer_url: "",
  event_url: "",
  notes: "",
};

export default function SubmitEvent() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/events?action=submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setFormData(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Promoters / DJs / Venues</p>
          <h1 className="font-display text-7xl md:text-9xl neon-text-simple mb-6">SUBMIT AN EVENT</h1>
          <p className="text-xl text-gray-300 font-heading max-w-3xl mx-auto">
            Send us events where hip hop will be represented with intent. Approved submissions can be promoted through This Is Hip Hop Caribbean.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {success ? (
            <div className="neon-border bg-black/80 p-12 text-center">
              <CheckCircle className="w-20 h-20 text-neon-red mx-auto mb-6" />
              <h2 className="font-display text-5xl text-white mb-4">SUBMISSION RECEIVED</h2>
              <p className="text-gray-300 font-heading mb-8">
                Your event is in the review queue. If it fits the platform, it can be listed as a promoted hip hop event.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider"
                >
                  Submit Another
                </button>
                <Link to="/events" className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider">
                  View Events
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="neon-border bg-black/80 p-8 md:p-12 space-y-8">
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Event Title *" value={formData.event_title} onChange={(value) => setFormData({ ...formData, event_title: value })} required />
                <Input label="Event Type *" value={formData.event_type} onChange={(value) => setFormData({ ...formData, event_type: value })} required />
                <Input label="Date *" type="date" value={formData.event_date} onChange={(value) => setFormData({ ...formData, event_date: value })} required />
                <Input label="Time" value={formData.event_time} onChange={(value) => setFormData({ ...formData, event_time: value })} />
                <Input label="Venue Name *" value={formData.venue_name} onChange={(value) => setFormData({ ...formData, venue_name: value })} required />
                <Input label="City / Country *" value={formData.city_country} onChange={(value) => setFormData({ ...formData, city_country: value })} required />
                <Input label="Venue Address" value={formData.venue_address} onChange={(value) => setFormData({ ...formData, venue_address: value })} />
                <Input label="Flyer URL" value={formData.flyer_url} onChange={(value) => setFormData({ ...formData, flyer_url: value })} />
              </div>

              <Textarea label="Lineup / DJs / Hosts" value={formData.lineup} onChange={(value) => setFormData({ ...formData, lineup: value })} />

              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Promoter Name *" value={formData.promoter_name} onChange={(value) => setFormData({ ...formData, promoter_name: value })} required />
                <Input label="Promoter Email *" type="email" value={formData.promoter_email} onChange={(value) => setFormData({ ...formData, promoter_email: value })} required />
                <Input label="Promoter Phone" value={formData.promoter_phone} onChange={(value) => setFormData({ ...formData, promoter_phone: value })} />
                <Input label="Instagram Handle" value={formData.instagram_handle} onChange={(value) => setFormData({ ...formData, instagram_handle: value })} />
                <Input label="Ticket / Event URL" value={formData.event_url} onChange={(value) => setFormData({ ...formData, event_url: value })} />
              </div>

              <Textarea label="Why should this be on This Is Hip Hop Caribbean?" value={formData.notes} onChange={(value) => setFormData({ ...formData, notes: value })} />

              {error && <div className="p-4 bg-neon-red/20 border border-neon-red text-white font-heading">{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-3" />
                {submitting ? "Submitting..." : "Submit For Review"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-white font-heading mb-2">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-white font-heading mb-2">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
      />
    </label>
  );
}
