import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Sparkles, Music, Check } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import CountdownTimer from "@/react-app/components/CountdownTimer";
import ShareButtons from "@/react-app/components/ShareButtons";

export default function IndependencePage() {
  const navigate = useNavigate();
  const [attireChoice, setAttireChoice] = useState<"full_black" | "standard">("full_black");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const noteWithAttire = `[Independence Special - Dress Code: ${
      attireChoice === "full_black" ? "FULL BLACK (FREE ENTRY)" : "STANDARD ($500 ENTRY)"
    }] ${formData.special_notes}`.trim();

    try {
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: 30, // ID 30 is Aug 6th Independence Day
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          package_type: formData.package_type,
          group_size: formData.group_size,
          bottle_selection: formData.bottle_selection || undefined,
          special_notes: noteWithAttire,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setError("Failed to submit RSVP. Please try again or contact support.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      <Navigation />

      {/* Top Special Banner */}
      <div className="pt-20 bg-gradient-to-r from-emerald-900/60 via-amber-900/40 to-black border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm font-heading tracking-wider flex items-center justify-center gap-3 flex-wrap">
          <span className="bg-emerald-500 text-black text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
            JAMAICA INDEPENDENCE SPECIAL
          </span>
          <span className="text-amber-300 font-bold">
            FREE ENTRY in Full Black w/ RSVP • $500 w/ Standard RSVP • $1,000 Gate
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 px-4 overflow-hidden graffiti-texture">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-amber-500/40 rounded-full text-xs font-heading tracking-widest text-amber-400 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                THURSDAY • AUG 06, 2026 • DULCE LOUNGE
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none uppercase">
                DIRT OFF YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400">SHOULDERS</span>
              </h1>

              <div className="p-4 bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-300 font-heading text-sm uppercase tracking-wider">
                Celebrating Jay-Z The Black Album — 20 Years of Greatness
              </div>

              <blockquote className="text-gray-300 italic font-body text-base md:text-lg border-l-2 border-white/20 pl-4 py-1">
                "From struggle to strength. From then to now. Jamaica's freedom inspires us to keep pushing, keep building, and keep brushing the dirt off our shoulders."
              </blockquote>

              {/* Countdown Timer */}
              <div className="pt-2 pb-4">
                <p className="text-xs font-heading uppercase text-gray-400 mb-2 tracking-widest">
                  Countdown to Independence Night
                </p>
                <CountdownTimer eventDate="2026-08-06" eventTime="9:00 PM" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#rsvp-form"
                  className="px-8 py-4 bg-amber-500 text-black hover:bg-amber-400 font-display text-lg tracking-wider uppercase transition transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                >
                  CLAIM YOUR RSVP NOW
                </a>
                <a
                  href="#admission-rules"
                  className="px-6 py-4 border border-white/30 text-white hover:bg-white/10 font-heading text-sm uppercase tracking-wider transition"
                >
                  VIEW ADMISSION RULES
                </a>
              </div>
            </div>

            {/* Right Column: Flyer Poster Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src="/flyers/aug-week1-independence.jpg"
                    alt="I Love Hip Hop Independence Day Celebration - Jay Z Black Album Tribute"
                    className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-4 bg-black/90 border-t border-white/10 text-center">
                    <p className="font-display text-lg text-amber-400">DULCE LOUNGE • KINGSTON</p>
                    <p className="text-xs font-heading text-gray-400">22 Barbican Road • 9:00 PM Till Late</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Admission Tiers Breakdown */}
      <section id="admission-rules" className="py-16 px-4 bg-gradient-to-b from-black via-zinc-950 to-black border-t border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-3">
              ADMISSION & COVER CHARGES
            </h2>
            <p className="text-gray-400 font-heading max-w-2xl mx-auto text-sm md:text-base">
              Celebrate Jay-Z's legendary *Black Album* with us on Jamaica Independence Night. Wear full black to unlock maximum perks!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1: FREE IN FULL BLACK */}
            <div className="relative bg-gradient-to-b from-emerald-950/60 to-black border-2 border-emerald-500 p-8 rounded-xl flex flex-col justify-between transform hover:-translate-y-1 transition duration-300 shadow-xl shadow-emerald-950/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black font-heading font-black text-xs uppercase rounded-full">
                BEST DEAL • RSVP REQUIRED
              </div>
              <div>
                <div className="text-center py-4 border-b border-emerald-500/30 mb-6">
                  <span className="font-display text-5xl md:text-6xl text-emerald-400">FREE</span>
                  <p className="text-xs font-heading uppercase tracking-widest text-emerald-300 mt-1">WITH RSVP + FULL BLACK</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-300 font-heading mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complimentary Admission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Must wear <strong>Full Black Upscale Attire</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Requires online RSVP confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complimentary party welcome shot</span>
                  </li>
                </ul>
              </div>
              <a
                href="#rsvp-form"
                onClick={() => setAttireChoice("full_black")}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase tracking-wider text-center block transition"
              >
                SELECT FULL BLACK (FREE)
              </a>
            </div>

            {/* Card 2: $500 WITH RSVP */}
            <div className="bg-gradient-to-b from-zinc-900 to-black border border-amber-500/50 p-8 rounded-xl flex flex-col justify-between hover:border-amber-400 transition duration-300">
              <div>
                <div className="text-center py-4 border-b border-white/10 mb-6">
                  <span className="font-display text-5xl md:text-6xl text-amber-400">$500</span>
                  <p className="text-xs font-heading uppercase tracking-widest text-amber-300 mt-1">WITH RSVP (STANDARD ATTIRE)</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-300 font-heading mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Discounted entry rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Standard upscale party attire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Guaranteed entry line skip</span>
                  </li>
                </ul>
              </div>
              <a
                href="#rsvp-form"
                onClick={() => setAttireChoice("standard")}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-display uppercase tracking-wider text-center block transition"
              >
                SELECT RSVP ($500)
              </a>
            </div>

            {/* Card 3: $1,000 AT THE GATE */}
            <div className="bg-zinc-900/60 border border-white/10 p-8 rounded-xl flex flex-col justify-between opacity-90">
              <div>
                <div className="text-center py-4 border-b border-white/10 mb-6">
                  <span className="font-display text-5xl md:text-6xl text-white">$1,000</span>
                  <p className="text-xs font-heading uppercase tracking-widest text-gray-400 mt-1">AT THE GATE (NO RSVP)</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-400 font-heading mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                    <span>Standard door admission charge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                    <span>Subject to venue capacity at gate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                    <span>Save 50% or enter FREE by RSVPing now!</span>
                  </li>
                </ul>
              </div>
              <a
                href="#rsvp-form"
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-display uppercase tracking-wider text-center block transition"
              >
                RSVP ONLINE & SAVE
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* RSVP Form Section */}
      <section id="rsvp-form" className="py-20 px-4 graffiti-texture relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/90 border-2 border-amber-500/50 backdrop-blur-md p-8 md:p-12 shadow-2xl relative">
            <div className="text-center mb-8">
              <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider mb-2">
                INDEPENDENCE DAY RSVP
              </h2>
              <p className="text-amber-400 font-heading text-sm md:text-base">
                Lock in your spot for Thursday, August 6th at Dulce Lounge
              </p>
            </div>

            {success ? (
              <div className="text-center py-10 space-y-6">
                <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="font-display text-4xl text-white">RSVP CONFIRMED!</h3>
                <p className="text-lg text-gray-300 font-heading max-w-lg mx-auto">
                  You are officially on the guest list for Independence Night! We sent your confirmation details to <span className="text-amber-400 font-bold">{formData.email}</span>.
                </p>
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-300 text-sm font-heading max-w-md mx-auto">
                  {attireChoice === "full_black" ? (
                    <span><strong>Attire Note:</strong> Please wear full black attire to claim your <strong>FREE admission</strong> at the door.</span>
                  ) : (
                    <span><strong>Admission Note:</strong> Present your RSVP name at the door for your <strong>$500 discounted cover</strong>.</span>
                  )}
                </div>
                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 font-heading uppercase text-sm"
                  >
                    Submit Another RSVP
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-amber-500 text-black font-display uppercase tracking-wider hover:bg-amber-400"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 text-sm font-heading rounded">
                    {error}
                  </div>
                )}

                {/* Attire Discount Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-heading uppercase tracking-widest text-amber-300">
                    Select Your Dress Code & Entry Tier *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAttireChoice("full_black")}
                      className={`p-4 border-2 rounded-lg text-left transition flex items-start justify-between ${
                        attireChoice === "full_black"
                          ? "border-emerald-400 bg-emerald-950/40 text-white"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div>
                        <div className="font-display text-lg text-emerald-400 uppercase">FULL BLACK (FREE)</div>
                        <p className="text-xs font-heading text-gray-300 mt-1">
                          Wearing full black in celebration of Jay-Z Black Album
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attireChoice === "full_black" ? "border-emerald-400 bg-emerald-400 text-black" : "border-gray-500"
                      }`}>
                        {attireChoice === "full_black" && <Check className="w-3.5 h-3.5 font-bold" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttireChoice("standard")}
                      className={`p-4 border-2 rounded-lg text-left transition flex items-start justify-between ${
                        attireChoice === "standard"
                          ? "border-amber-400 bg-amber-950/40 text-white"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div>
                        <div className="font-display text-lg text-amber-400 uppercase">STANDARD RSVP ($500)</div>
                        <p className="text-xs font-heading text-gray-300 mt-1">
                          Standard upscale party attire
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attireChoice === "standard" ? "border-amber-400 bg-amber-400 text-black" : "border-gray-500"
                      }`}>
                        {attireChoice === "standard" && <Check className="w-3.5 h-3.5 font-bold" />}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-widest text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shawn Carter"
                      className="w-full bg-black border border-white/20 px-4 py-3 text-white font-heading focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading uppercase tracking-widest text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="shawn@example.com"
                      className="w-full bg-black border border-white/20 px-4 py-3 text-white font-heading focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-widest text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (876) 555-0199"
                      className="w-full bg-black border border-white/20 px-4 py-3 text-white font-heading focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading uppercase tracking-widest text-gray-300 mb-2">
                      Group Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={formData.group_size}
                      onChange={(e) => setFormData({ ...formData, group_size: parseInt(e.target.value) || 1 })}
                      className="w-full bg-black border border-white/20 px-4 py-3 text-white font-heading focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase tracking-widest text-gray-300 mb-2">
                    Table Reservation & VIP Bottle Requests (Optional)
                  </label>
                  <p className="text-xs text-gray-400 font-heading mb-2">
                    Note: Table orders of J$15,000 or more receive a complimentary hookah.
                  </p>
                  <textarea
                    rows={3}
                    value={formData.special_notes}
                    onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                    placeholder="Mention bottle preferences or VIP table seating notes..."
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white font-heading focus:border-amber-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-display text-xl uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {submitting ? "SUBMITTING RSVP..." : "CONFIRM INDEPENDENCE RSVP"}
                </button>

                <p className="text-center text-xs text-gray-400 font-heading">
                  Must be 18 years and older • I.D. Required • Drink Responsibly • No Weapons Allowed
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* DJ Lineup */}
      <section className="py-16 px-4 bg-zinc-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-4xl uppercase tracking-wider mb-2">
            FEATURED DJ LINEUP
          </h2>
          <p className="text-gray-400 font-heading text-sm mb-12">
            Open format hip hop, dancehall crossover & Jay-Z classics all night
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black p-6 border border-white/10 hover:border-amber-400 transition">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400">
                <Music className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="font-display text-2xl text-white">TROY FINZI</h3>
              <p className="text-xs font-heading text-amber-400 uppercase tracking-widest">MAIN DJ</p>
            </div>

            <div className="bg-black p-6 border border-white/10 hover:border-emerald-400 transition">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400">
                <Music className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl text-white">DJ STEAMAZ</h3>
              <p className="text-xs font-heading text-emerald-400 uppercase tracking-widest">RESIDENT DJ</p>
            </div>

            <div className="bg-black p-6 border border-white/10 hover:border-amber-400 transition">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400">
                <Music className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="font-display text-2xl text-white">ANDRE MILLWOOD</h3>
              <p className="text-xs font-heading text-amber-400 uppercase tracking-widest">RESIDENT DJ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12 px-4 bg-black text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-display text-2xl uppercase">SPREAD THE WORD</h3>
          <p className="text-gray-400 text-sm font-heading">
            Share the Independence Day celebration with your crew!
          </p>
          <ShareButtons url="/independence" title="ILHH Independence Day Celebration - Jay-Z Black Album Tribute" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
