import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router";
import { Settings, Calendar, Users, FileText, Music, Image, Gift } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";

export default function Admin() {
  const { user, loading: isPending } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalMembers: 0,
    totalRsvps: 0,
  });

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    } else if (user) {
      // Fetch admin stats
      Promise.all([
        fetch("/api/admin/stats").then((res) => res.ok ? res.json() : null),
      ])
        .then(([statsData]) => {
          if (statsData) {
            setStats(statsData);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user, isPending, navigate]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-12">
            <Settings className="w-12 h-12 text-neon-red mr-4" />
            <h1 className="font-display text-6xl md:text-8xl neon-text-simple">
              ADMIN DASHBOARD
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="neon-border bg-black/80 backdrop-blur-md mb-8">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "overview"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "events"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "members"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Members
              </button>
              <button
                onClick={() => setActiveTab("articles")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "articles"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Articles
              </button>
              <button
                onClick={() => setActiveTab("mixtapes")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "mixtapes"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Music className="w-4 h-4 mr-2" />
                Mixtapes
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "gallery"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Image className="w-4 h-4 mr-2" />
                Gallery
              </button>
              <button
                onClick={() => setActiveTab("coupons")}
                className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === "coupons"
                    ? "bg-neon-red text-black"
                    : "text-white hover:text-neon-red"
                  }`}
              >
                <Gift className="w-4 h-4 mr-2" />
                Coupons
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="neon-border bg-black/80 backdrop-blur-md p-8">
            {activeTab === "overview" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Dashboard Overview</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Total Events</p>
                    <p className="text-white text-3xl font-display">{stats.totalEvents}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Total Members</p>
                    <p className="text-white text-3xl font-display">{stats.totalMembers}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Total RSVPs</p>
                    <p className="text-white text-3xl font-display">{stats.totalRsvps}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Events Management</h2>
                  <button className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                    Add Event
                  </button>
                </div>
                <p className="text-gray-400 font-heading">
                  Event management interface coming soon.
                </p>
              </div>
            )}

            {activeTab === "members" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Members Management</h2>
                <p className="text-gray-400 font-heading">
                  Member management interface coming soon.
                </p>
              </div>
            )}

            {activeTab === "articles" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Articles & RSS</h2>
                  <button className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                    Add Article
                  </button>
                </div>
                <p className="text-gray-400 font-heading">
                  Article CMS interface coming soon.
                </p>
              </div>
            )}

            {activeTab === "mixtapes" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Mixtape Library</h2>
                  <button className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                    Add Mixtape
                  </button>
                </div>
                <p className="text-gray-400 font-heading">
                  Mixtape management interface coming soon.
                </p>
              </div>
            )}

            {activeTab === "gallery" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Gallery Partners</h2>
                  <button className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                    Add Partner
                  </button>
                </div>
                <p className="text-gray-400 font-heading">
                  Gallery partner management coming soon.
                </p>
              </div>
            )}

            {activeTab === "coupons" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Happy Hour Coupons</h2>
                <p className="text-gray-400 font-heading">
                  Coupon management interface coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
