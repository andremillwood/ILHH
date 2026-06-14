import { useEffect, useState } from "react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { Sparkles, Users, Calendar, Star, Edit2, X, Mail, Send } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import SocialCtas from "@/react-app/components/SocialCtas";
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
    is_public: true,
    profile_visibility: "public",
    member_role: "fan",
    discovery_city: "",
    interest_tags: "",
    onboarding_completed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && user && authHeader) {
      fetch("/api/members?action=me", {
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
              is_public: data.is_public ?? true,
              profile_visibility: data.profile_visibility || "public",
              member_role: data.member_role || "fan",
              discovery_city: data.discovery_city || data.location || "",
              interest_tags: data.interest_tags || data.favorite_genre || "",
              onboarding_completed: data.onboarding_completed || false,
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
      const url = member ? "/api/members?action=me" : "/api/members";
      const method = member ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader
        },
        body: JSON.stringify({ ...formData, onboarding_completed: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to save membership");
      }

      const data = await response.json();
      if (data.success || data.member) {
        window.location.reload();
      }
    } catch {
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
              NEWSLETTER & MEMBERSHIP
            </h1>
            <p className="text-xl text-gray-300 mb-12 font-heading">
              Subscribe to This Is Hip Hop Caribbean and join the I Luv Hip Hop community for event alerts, RSVP access, and member benefits.
            </p>

            <div className="neon-border bg-black/80 backdrop-blur-md p-12">
              <h2 className="font-display text-4xl text-white mb-8">
                STAY CONNECTED TO THE CULTURE
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                <div className="border-l-2 border-neon-red pl-4">
                  <Mail className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Newsletter</h3>
                  <p className="text-gray-400">Weekly drops on I Luv Hip Hop, promoted events, DJs, and culture features</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Sparkles className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">2-4-1 Specials</h3>
                  <p className="text-gray-400">Weekly member-exclusive drink deals</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Star className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Priority RSVP</h3>
                  <p className="text-gray-400">First access to RSVP and table reservations for designated events</p>
                </div>
                <div className="border-l-2 border-neon-red pl-4">
                  <Calendar className="w-8 h-8 text-neon-red mb-2" />
                  <h3 className="font-heading text-lg text-white mb-2">Event Discovery</h3>
                  <p className="text-gray-400">Early info on I Luv Hip Hop Weekly and promoted hip hop events</p>
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
              <div className="mt-10 border-t border-white/10 pt-8">
                <h3 className="font-heading text-white uppercase tracking-wider mb-4">Follow The Community</h3>
                <SocialCtas />
              </div>
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

              <div className="border-t border-neon-red/30 pt-8">
                <h3 className="font-display text-3xl text-white mb-6 text-center">Creator Profile</h3>
                <CreatorProfileSubmission authHeader={authHeader!} />
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-heading mb-2">Discovery City</label>
                      <input
                        type="text"
                        placeholder="Kingston, Montego Bay, Portmore..."
                        value={formData.discovery_city}
                        onChange={(e) => setFormData({ ...formData, discovery_city: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-heading mb-2">Home Interests</label>
                      <input
                        type="text"
                        placeholder="dancehall, trap, events, interviews"
                        value={formData.interest_tags}
                        onChange={(e) => setFormData({ ...formData, interest_tags: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-heading mb-2">Member Role</label>
                      <select
                        value={formData.member_role}
                        onChange={(e) => setFormData({ ...formData, member_role: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      >
                        <option value="fan">Fan / Member</option>
                        <option value="dj">DJ</option>
                        <option value="artist">Artist</option>
                        <option value="promoter">Promoter</option>
                        <option value="venue">Venue</option>
                        <option value="media">Media / Creator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-heading mb-2">Community Visibility</label>
                      <select
                        value={formData.profile_visibility}
                        onChange={(e) => setFormData({ ...formData, profile_visibility: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
                      >
                        <option value="public">Public community card</option>
                        <option value="private">Private member profile</option>
                      </select>
                    </div>
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

function CreatorProfileSubmission({ authHeader }: { authHeader: string }) {
  const [form, setForm] = useState({
    profile_type: "dj",
    display_name: "",
    tagline: "",
    bio: "",
    city: "",
    country: "Jamaica",
    avatar_url: "",
    cover_url: "",
    instagram_handle: "",
    tiktok_handle: "",
    youtube_url: "",
    soundcloud_url: "",
    spotify_url: "",
    website_url: "",
    booking_email: "",
    booking_phone: "",
    specialties: "",
    notable_credits: "",
    equipment_or_services: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/members?action=creator_profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Profile submission failed");
      setMessage("Profile submitted for review. It will appear in the directory after approval.");
      setForm({ ...form, display_name: "", tagline: "", bio: "", specialties: "", notable_credits: "", equipment_or_services: "" });
    } catch {
      setMessage("Could not submit the profile. Check the required fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitProfile} className="space-y-4">
      <p className="text-gray-400 font-heading text-center">
        DJs, artists, promoters, venues, and community builders can submit a public creator profile for approval.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <select value={form.profile_type} onChange={(e) => setForm({ ...form, profile_type: e.target.value })} className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none">
          <option value="dj">DJ</option>
          <option value="artist">Artist</option>
          <option value="promoter">Promoter</option>
          <option value="venue">Venue</option>
          <option value="community">Community / Media</option>
        </select>
        <input required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Public name *" className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      </div>
      <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short tagline" className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      <textarea required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Bio, mission, or profile story *" className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      <div className="grid md:grid-cols-2 gap-4">
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input value={form.instagram_handle} onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })} placeholder="Instagram handle" className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
        <input value={form.booking_email} onChange={(e) => setForm({ ...form, booking_email: e.target.value })} placeholder="Booking email" className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      </div>
      <textarea value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} rows={2} placeholder="Specialties, styles, or genres" className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      <textarea value={form.notable_credits} onChange={(e) => setForm({ ...form, notable_credits: e.target.value })} rows={2} placeholder="Notable credits, releases, events, venues, collaborations" className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      <details className="border border-white/10 p-4">
        <summary className="text-neon-red font-heading cursor-pointer">Optional links and media</summary>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {(["avatar_url", "cover_url", "website_url", "youtube_url", "soundcloud_url", "spotify_url", "tiktok_handle", "booking_phone"] as const).map((key) => (
            <input key={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={key.replace(/_/g, " ")} className="px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
          ))}
        </div>
        <textarea value={form.equipment_or_services} onChange={(e) => setForm({ ...form, equipment_or_services: e.target.value })} rows={2} placeholder="Services, equipment, venue details, or packages" className="w-full mt-4 px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red outline-none placeholder-gray-600" />
      </details>
      {message && <p className="text-gray-300 font-heading text-center">{message}</p>}
      <button disabled={submitting} className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2">
        {submitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Creator Profile</>}
      </button>
    </form>
  );
}
