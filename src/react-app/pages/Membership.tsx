import { useEffect, useState } from "react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { Sparkles, Users, Calendar, Star, Edit2, X } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Member } from "@/shared/types";

export default function Membership() {
  const { user, loading: isPending, signInWithGoogle } = useAuth();
  const authHeader = useAuthHeader();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    instagram_handle: "",
    first_name: "",
    last_name: "",
    favorite_songs: "",
    favorite_albums: "",
    favorite_lyrics: "",
    favorite_djs: "",
    favorite_genre: "",
    bio: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && user && authHeader) {
      fetch("/api/members/me", {
        headers: { Authorization: authHeader }
      })
        .then((res) => res.json())
        .then((data) => {
          setMember(data);
          if (data) {
            setFormData({
              email: data.email || "",
              phone: data.phone || "",
              instagram_handle: data.instagram_handle || "",
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              favorite_songs: data.favorite_songs || "",
              favorite_albums: data.favorite_albums || "",
              favorite_lyrics: data.favorite_lyrics || "",
              favorite_djs: data.favorite_djs || "",
              favorite_genre: data.favorite_genre || "",
              bio: data.bio || "",
              location: data.location || "",
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else if (!isPending) {
      setLoading(false);
    }
  }, [user, isPending, authHeader]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeader) return;
    setSubmitting(true);
    setError("");

    try {
      const url = member ? "/api/members/me" : "/api/members";
      const method = member ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save membership");
      }

      const data = await response.json();
      if (data.success || data.member) {
        window.location.reload();
      }
    } catch (err) {
      setError("Failed to save membership. Please try again.");
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-6xl md:text-8xl mb-6 neon-text-simple animate-glow-pulse">
              MEMBERSHIP
            </h1>
            <p className="text-xl text-gray-300 mb-12 font-heading">
              Join the I Luv Hip Hop community for exclusive benefits
            </p>

            <div className="neon-border bg-black/80 backdrop-blur-md p-12">
              <h2 className="font-display text-4xl text-white mb-8">
                UNLOCK EXCLUSIVE ACCESS
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                <div className="border-l-2 border-neon-red pl-4">
                  <Sparkles className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">2-4-1 Specials</h3>
                  <p className="text-gray-400">Weekly member-exclusive drink deals</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Star className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Priority RSVP</h3>
                  <p className="text-gray-400">First access to table reservations</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Calendar className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Event Access</h3>
                  <p className="text-gray-400">Early info on special events</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Users className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Community</h3>
                  <p className="text-gray-400">Connect with fellow hip hop lovers</p>
                </div>
              </div>

              <button
                onClick={() => signInWithGoogle()}
                className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider neon-glow"
              >
                Sign In to Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (member && !editing) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-6xl md:text-8xl neon-text-simple animate-glow-pulse">
                YOUR PROFILE
              </h1>
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="neon-border bg-black/80 backdrop-blur-md p-8 md:p-12 mb-8 neon-glow">
              <div className="text-center mb-8">
                <div className="inline-block px-6 py-2 neon-border bg-neon-red text-black font-heading text-xl uppercase tracking-wider mb-4">
                  Active Member
                </div>
                <h2 className="font-display text-4xl text-white">
                  {member.first_name} {member.last_name}
                </h2>
                {member.location && (
                  <p className="text-gray-400 font-heading mt-2">{member.location}</p>
                )}
              </div>

              {member.bio && (
                <div className="mb-8 text-center">
                  <p className="text-gray-300 font-heading italic">{member.bio}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-white">
                <div>
                  <p className="text-gray-400 font-heading text-sm mb-1">Email</p>
                  <p className="font-heading">{member.email}</p>
                </div>
                {member.phone && (
                  <div>
                    <p className="text-gray-400 font-heading text-sm mb-1">Phone</p>
                    <p className="font-heading">{member.phone}</p>
                  </div>
                )}
                {member.instagram_handle && (
                  <div>
                    <p className="text-gray-400 font-heading text-sm mb-1">Instagram</p>
                    <p className="font-heading">@{member.instagram_handle}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 font-heading text-sm mb-1">Member Since</p>
                  <p className="font-heading">
                    {new Date(member.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {(member.favorite_songs || member.favorite_albums || member.favorite_genre) && (
                <div className="border-t border-neon-red/30 pt-8">
                  <h3 className="font-display text-3xl text-white mb-6 text-center">Music Identity</h3>
                  <div className="space-y-4">
                    {member.favorite_genre && (
                      <div>
                        <p className="text-neon-red font-heading text-sm uppercase mb-1">Favorite Genre</p>
                        <p className="text-white font-heading">{member.favorite_genre}</p>
                      </div>
                    )}
                    {member.favorite_songs && (
                      <div>
                        <p className="text-neon-red font-heading text-sm uppercase mb-1">Favorite Songs</p>
                        <p className="text-white font-heading">{member.favorite_songs}</p>
                      </div>
                    )}
                    {member.favorite_albums && (
                      <div>
                        <p className="text-neon-red font-heading text-sm uppercase mb-1">Favorite Albums</p>
                        <p className="text-white font-heading">{member.favorite_albums}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="neon-border bg-black/80 backdrop-blur-md p-6">
                <Sparkles className="w-8 h-8 text-neon-red mb-3" />
                <h3 className="font-heading text-xl text-white mb-2">This Week's Special</h3>
                <p className="text-gray-400">2-4-1 on selected cocktails 8:00-10:30 PM</p>
              </div>
              <div className="neon-border bg-black/80 backdrop-blur-md p-6">
                <Calendar className="w-8 h-8 text-neon-red mb-3" />
                <h3 className="font-heading text-xl text-white mb-2">Next Event</h3>
                <p className="text-gray-400">Thursday - Check the calendar</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-5xl md:text-7xl neon-text-simple animate-glow-pulse">
              {member ? "EDIT PROFILE" : "JOIN NOW"}
            </h1>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>

          {!member && (
            <p className="text-center text-xl text-gray-300 mb-8 font-heading">
              Complete your membership registration
            </p>
          )}

          <div className="neon-border bg-black/80 backdrop-blur-md p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-heading mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-heading mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-heading mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-heading mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Instagram Handle</label>
                    <div className="flex">
                      <span className="px-4 py-3 bg-black border border-r-0 border-neon-red/50 text-gray-400 font-heading">@</span>
                      <input
                        type="text"
                        value={formData.instagram_handle}
                        onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-neon-red/30 pt-6">
                <h3 className="font-display text-2xl text-white mb-4">Your Music Identity</h3>
                <p className="text-gray-400 font-heading mb-4 text-sm">
                  Share your musical taste with the community
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-heading mb-2">Favorite Genre</label>
                    <input
                      type="text"
                      placeholder="e.g., 90s Hip Hop, Trap, Boom Bap"
                      value={formData.favorite_genre}
                      onChange={(e) => setFormData({ ...formData, favorite_genre: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Favorite Songs</label>
                    <input
                      type="text"
                      placeholder="Your top tracks (separated by commas)"
                      value={formData.favorite_songs}
                      onChange={(e) => setFormData({ ...formData, favorite_songs: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Favorite Albums</label>
                    <input
                      type="text"
                      placeholder="Your classic albums (separated by commas)"
                      value={formData.favorite_albums}
                      onChange={(e) => setFormData({ ...formData, favorite_albums: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Favorite DJs</label>
                    <input
                      type="text"
                      placeholder="DJs you love (separated by commas)"
                      value={formData.favorite_djs}
                      onChange={(e) => setFormData({ ...formData, favorite_djs: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-heading mb-2">Favorite Lyrics</label>
                    <textarea
                      value={formData.favorite_lyrics}
                      onChange={(e) => setFormData({ ...formData, favorite_lyrics: e.target.value })}
                      rows={2}
                      placeholder="That one bar that speaks to you..."
                      className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                    />
                  </div>
                </div>
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
                {submitting ? "Saving..." : member ? "Update Profile" : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
