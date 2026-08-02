import { useState, useEffect } from "react";
import { Link } from "react-router";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import {
  DjNomination,
  ILHH_ALUMNI_DJS,
  IlhhAlumniDj,
  fetchCycleNominations,
  submitDjNomination
} from "@/react-app/lib/peoplesChoiceDj";
import {
  Music,
  Award,
  Vote,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Volume2,
  TrendingUp,
  Info,
  Instagram,
  Radio,
  Star,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function PeoplesChoiceDjPage() {
  const { user } = useAuth();
  const [nominations, setNominations] = useState<DjNomination[]>([]);
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vote" | "hall-of-fame" | "about">("vote");
  const [notification, setNotification] = useState<{ type: "success" | "info"; msg: string } | null>(null);

  // Form State
  const [djName, setDjName] = useState("");
  const [bio, setBio] = useState("");
  const [mixUrl, setMixUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [genre, setGenre] = useState("Hip-Hop / R&B");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNominations = () => {
    fetchCycleNominations("2026-08").then((data) => {
      setNominations(data || []);
    });
  };

  useEffect(() => {
    loadNominations();
  }, []);

  const handleVote = (id: number) => {
    if (!user) {
      setNotification({
        type: "info",
        msg: "Please sign in to vote for your favorite DJ! (Free account registration)"
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    if (userVotes[id]) {
      setNotification({
        type: "info",
        msg: "You have already voted for this DJ today!"
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Optimistically update votes count
    setNominations((prev) =>
      prev.map((nom) => (nom.id === id ? { ...nom, votes_count: nom.votes_count + 1 } : nom))
    );
    setUserVotes((prev) => ({ ...prev, [id]: true }));

    setNotification({
      type: "success",
      msg: "Your vote has been cast! Thank you for supporting DJ talent."
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleQuickNominateAlumni = async (alumni: IlhhAlumniDj) => {
    setIsSubmitting(true);
    const newNominationObj: DjNomination = {
      id: Date.now(),
      cycle_month: "2026-08",
      dj_name: alumni.dj_name,
      bio: alumni.bio || `${alumni.dj_name} - Featured ILHH Alumni DJ.`,
      photo_url: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80",
      mix_url: "",
      instagram_handle: alumni.dj_name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      genre: alumni.genre || "Hip-Hop / Dancehall",
      status: "approved",
      votes_count: 0,
      created_at: new Date().toISOString()
    };

    setNominations((prev) => [...prev, newNominationObj]);

    await submitDjNomination({
      dj_name: alumni.dj_name,
      bio: alumni.bio || `${alumni.dj_name} - ILHH Alumni DJ`,
      genre: alumni.genre || "Hip-Hop / Dancehall",
      user_id: user?.id
    });

    setIsSubmitting(false);
    setNotification({
      type: "success",
      msg: `${alumni.dj_name} has been nominated for August 2026!`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleNominationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!djName.trim() || !bio.trim()) {
      alert("Please enter the DJ name and a brief bio.");
      return;
    }

    setIsSubmitting(true);
    const newNom: DjNomination = {
      id: Date.now(),
      cycle_month: "2026-08",
      dj_name: djName,
      bio,
      mix_url: mixUrl,
      instagram_handle: instagram,
      genre,
      photo_url: photoUrl || "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80",
      status: "approved",
      votes_count: 0,
      created_at: new Date().toISOString()
    };

    setNominations((prev) => [...prev, newNom]);

    await submitDjNomination({
      dj_name: djName,
      bio,
      mix_url: mixUrl,
      instagram_handle: instagram,
      genre,
      photo_url: photoUrl,
      user_id: user?.id
    });

    setIsSubmitting(false);
    setIsNominateModalOpen(false);
    setNotification({
      type: "success",
      msg: `Nomination for ${djName} submitted successfully! Voting is now open.`
    });
    setTimeout(() => setNotification(null), 6000);

    // Reset Form
    setDjName("");
    setBio("");
    setMixUrl("");
    setInstagram("");
    setGenre("Hip-Hop / R&B");
    setPhotoUrl("");
  };

  // Sort by highest votes first
  const sortedNominations = [...nominations].sort((a, b) => b.votes_count - a.votes_count);
  const totalVotesCast = nominations.reduce((sum, item) => sum + item.votes_count, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navigation />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-bounce">
          <div
            className={`p-4 rounded-xl shadow-2xl backdrop-blur-xl border text-sm flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-200"
                : "bg-purple-900/40 border-purple-500/50 text-purple-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-purple-400 shrink-0" />
            )}
            <p>{notification.msg}</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background Glow & Accent Circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launching August 2026 • Monthly DJ Showcase</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {"People's Choice"} <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  DJ Showcase
                </span>{" "}
                @ Dulce
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Every last Thursday of the month, ILHH features the DJ voted #1 by our community.
                Nominate your favorite local selectors or choose from our ILHH event alumni, cast your vote daily, and catch the winner live at Dulce starting this August!
              </p>

              {/* Event Badge Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block font-medium">When</span>
                    <span className="text-sm font-semibold text-slate-200">Every Last Thursday</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-purple-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block font-medium">Where</span>
                    <span className="text-sm font-semibold text-slate-200">Dulce Lounge</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Vote className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block font-medium">August Launch</span>
                    <span className="text-sm font-semibold text-slate-200">{totalVotesCast} Votes Cast</span>
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setIsNominateModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-5 h-5" />
                  Nominate a DJ for August
                </button>

                <Link
                  to="/events"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5 text-amber-400" />
                  View Dulce Event Schedule
                </Link>
              </div>
            </div>

            {/* Right Featured Banner / Next Event Card */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-bl-2xl">
                  August Edition
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">Thursday, August 27</h3>
                    <p className="text-xs text-amber-400 font-medium">Dulce Nightclub & Lounge</p>
                  </div>
                </div>

                <div className="space-y-3 py-3 border-y border-slate-800 text-sm text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Nomination Status:</span>
                    <span className="font-semibold text-emerald-400">Open Now</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Voting Closes:</span>
                    <span className="font-semibold text-slate-200">August 23, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Winner Announcement:</span>
                    <span className="font-semibold text-amber-400">August 24, 2026</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    The winning DJ will be featured on official ILHH promo flyers, radio slots, and perform the prime 2-hour peak slot at Dulce!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-slate-900/60 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start gap-8">
            <button
              onClick={() => setActiveTab("vote")}
              className={`py-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
                activeTab === "vote"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Vote className="w-4 h-4" />
              August Nominees & Voting ({nominations.length})
            </button>

            <button
              onClick={() => setActiveTab("hall-of-fame")}
              className={`py-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
                activeTab === "hall-of-fame"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-4 h-4" />
              Past Winners Hall of Fame
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
                activeTab === "about"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Info className="w-4 h-4" />
              Rules & How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Tab 1: Live Voting Leaderboard */}
        {activeTab === "vote" && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                  August 2026 Voting Leaderboard
                </h2>
                <p className="text-sm text-slate-400">
                  Cast your daily vote below. The DJ with the most votes on August 23rd gets booked for the Dulce showcase!
                </p>
              </div>

              <button
                onClick={() => setIsNominateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
              >
                <PlusCircle className="w-4 h-4" />
                Submit Custom DJ Nomination
              </button>
            </div>

            {/* Nominations List or Empty State */}
            {nominations.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Vote className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No Nominations Submitted Yet for August 2026</h3>
                  <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                    We are launching with a clean slate! Be the first to nominate a DJ below, or choose from the list of authentic ILHH Event Alumni DJs who have performed at our events.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setIsNominateModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                  >
                    Nominate a Custom DJ
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedNominations.map((nom, index) => {
                  const isLeader = index === 0 && nom.votes_count > 0;
                  const hasVoted = userVotes[nom.id];

                  return (
                    <div
                      key={nom.id}
                      className={`rounded-3xl p-6 transition-all duration-300 border relative overflow-hidden flex flex-col justify-between ${
                        isLeader
                          ? "bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/50 shadow-xl shadow-amber-500/5"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {/* Leader Badge */}
                      {isLeader && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider">
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          Current #1 Rank
                        </div>
                      )}

                      <div>
                        {/* DJ Header Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={nom.photo_url}
                            alt={nom.dj_name}
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700 shrink-0 shadow-md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                              <Music className="w-3.5 h-3.5" />
                              {nom.genre}
                            </div>
                            <h3 className="text-xl font-bold text-white truncate">{nom.dj_name}</h3>
                            
                            {nom.instagram_handle && (
                              <a
                                href={`https://instagram.com/${nom.instagram_handle.replace("@", "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 mt-1 transition-colors"
                              >
                                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                                @{nom.instagram_handle.replace("@", "")}
                              </a>
                            )}

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-2xl font-black text-white">{nom.votes_count}</span>
                              <span className="text-xs text-slate-400 font-medium">Votes Received</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                          {nom.bio}
                        </p>

                        {/* Mix Preview Link */}
                        {nom.mix_url && (
                          <div className="mb-4">
                            <a
                              href={nom.mix_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-700/60 transition-all"
                            >
                              <Volume2 className="w-4 h-4 text-amber-400" />
                              Listen to Audio Demo / Mix
                              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Vote Action Footer */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-400">
                          {user ? "1 Vote per member daily" : "Sign in required to vote"}
                        </span>

                        <button
                          onClick={() => handleVote(nom.id)}
                          disabled={hasVoted}
                          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                            hasVoted
                              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                              : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10 active:scale-95"
                          }`}
                        >
                          {hasVoted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Voted Today
                            </>
                          ) : (
                            <>
                              <Vote className="w-4 h-4" />
                              Vote for {nom.dj_name.split(" ")[0]}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ILHH Event Alumni DJs Quick Nomination Section */}
            <div className="pt-8 border-t border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Past Performers
                  </div>
                  <h3 className="text-2xl font-bold text-white">Nominate ILHH Event Alumni DJs</h3>
                  <p className="text-sm text-slate-400">
                    Click any DJ who has previously performed at ILHH events to submit their nomination for the August Dulce showcase!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ILHH_ALUMNI_DJS.map((alumni) => {
                  const isAlreadyNominated = nominations.some(
                    (n) => n.dj_name.toLowerCase() === alumni.dj_name.toLowerCase()
                  );

                  return (
                    <div
                      key={alumni.dj_name}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-white">{alumni.dj_name}</h4>
                          {alumni.is_resident && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
                              Resident
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-400 font-medium">{alumni.affiliation} • {alumni.genre}</p>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {alumni.bio}
                        </p>
                      </div>

                      <button
                        onClick={() => handleQuickNominateAlumni(alumni)}
                        disabled={isAlreadyNominated || isSubmitting}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isAlreadyNominated
                            ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default"
                            : "bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700"
                        }`}
                      >
                        {isAlreadyNominated ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Nominated for August
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-400" />
                            Quick Nominate {alumni.dj_name.split(" ")[0]}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Hall of Fame */}
        {activeTab === "hall-of-fame" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                Past {"People's Choice"} DJ Winners
              </h2>
              <p className="text-sm text-slate-400">
                Celebrating DJs featured at Dulce on the Last Thursday of previous months.
              </p>
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
              <Award className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">August 2026 Will Be Our Inaugural Winner!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The inaugural People's Choice DJ will be crowned on August 24th and headline the August 27th Dulce Last Thursday event. Past winners will be archived here.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Rules & How It Works */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white">How the {"People's Choice"} DJ Works</h2>
              <p className="text-slate-400 text-sm">
                Empowering the ILHH community to discover, support, and book top DJ talent every month.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 font-bold">1</div>
                <h3 className="text-lg font-bold text-white">1. Nominations</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Submit any local DJ or select from verified ILHH Event Alumni DJs. Nominations open on the 1st of every month.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 font-bold">2</div>
                <h3 className="text-lg font-bold text-white">2. Community Voting</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Registered ILHH community members cast votes daily for their favorite candidate. Active members elevate local talent.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">3</div>
                <h3 className="text-lg font-bold text-white">3. Dulce Event Booking</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The winning DJ is officially booked for the prime 2-hour set at the ILHH Monthly Event at Dulce every Last Thursday!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Nominate a DJ */}
      {isNominateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                Nominate a DJ for August @ Dulce
              </h3>
              <button
                onClick={() => setIsNominateModalOpen(false)}
                className="text-slate-400 hover:text-white font-semibold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNominationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  DJ Name / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Andre Millwood, DJ Renso, or Custom DJ"
                  value={djName}
                  onChange={(e) => setDjName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Genre / Sound Vibe
                </label>
                <input
                  type="text"
                  placeholder="e.g. 90s Boom Bap, Trap, Afrobeats, Dancehall"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  DJ Bio / Background *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about this DJ's sound, history, and why they should headline Dulce..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@djhandle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    SoundCloud / Mix URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://soundcloud.com/..."
                    value={mixUrl}
                    onChange={(e) => setMixUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Photo / Press Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNominateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? "Submitting..." : "Submit Nomination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
