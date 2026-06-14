import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  BarChart3,
  Bookmark,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Headphones,
  Heart,
  LayoutDashboard,
  Loader2,
  Mic2,
  Music,
  PenLine,
  Send,
  Sparkles,
  Ticket,
  UserPlus,
} from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import type { Article, CreatorProfile, EventWithDJs, Mixtape, MusicPlaylist } from "@/shared/types";
import { formatEventDate, isDesignatedRsvpEvent } from "@/react-app/lib/platform";

interface DashboardData {
  member: {
    email?: string;
    first_name?: string;
    last_name?: string;
    member_role?: string;
    phone?: string;
    instagram_handle?: string;
    favorite_songs?: string;
    favorite_albums?: string;
    favorite_lyrics?: string;
    favorite_djs?: string;
    location?: string;
    bio?: string;
    is_public?: boolean;
    profile_visibility?: string;
    discovery_city?: string;
    favorite_genre?: string;
    interest_tags?: string;
    onboarding_completed?: boolean;
  } | null;
  library: Array<{ id: number; target_type: string; target_id: string; engagement_type: string; created_at: string }>;
  creatorProfiles: Array<{ id: number; display_name: string; slug: string; profile_type: string; status: string; stats: Record<string, number> }>;
  contentSubmissions: Array<{ id: number; title: string; status: string; submission_type: string; created_at: string }>;
  claims: Array<{ id: number; status: string; creator_profiles?: { display_name: string; slug: string } }>;
  playlistSuggestions: Array<{ id: number; track_title: string; artist_name: string; status: string; vote_count?: number }>;
  featuredPlaylists: Array<{ id: number; title: string; platform: string; playlist_type: string; external_url: string }>;
}

interface DiscoveryData {
  events: EventWithDJs[];
  articles: Article[];
  mixtapes: Mixtape[];
  profiles: CreatorProfile[];
  playlists: MusicPlaylist[];
}

type FeedItem = {
  id: string;
  type: "event" | "story" | "music" | "playlist" | "profile";
  title: string;
  subtitle: string;
  href: string;
  action: string;
  sortDate?: string;
};

const emptyDiscovery: DiscoveryData = {
  events: [],
  articles: [],
  mixtapes: [],
  profiles: [],
  playlists: [],
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [discovery, setDiscovery] = useState<DiscoveryData>(emptyDiscovery);
  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/membership");
    if (!authHeader) return;

    Promise.all([
      fetch("/api/members?action=dashboard", { headers: { Authorization: authHeader } }).then((res) => res.json()),
      fetch("/api/events").then((res) => res.json()),
      fetch("/api/articles").then((res) => res.json()),
      fetch("/api/mixtapes").then((res) => res.json()),
      fetch("/api/public?resource=profiles").then((res) => res.json()),
      fetch("/api/public?resource=playlists").then((res) => res.json()),
    ])
      .then(([dashboardPayload, events, articles, mixtapes, profiles, playlistPayload]) => {
        setData(dashboardPayload);
        setDiscovery({
          events: Array.isArray(events) ? events : [],
          articles: Array.isArray(articles) ? articles : [],
          mixtapes: Array.isArray(mixtapes) ? mixtapes : [],
          profiles: Array.isArray(profiles) ? profiles : [],
          playlists: playlistPayload?.playlists || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authLoading, user, authHeader, navigate]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return discovery.events
      .filter((event) => {
        const [year, month, day] = event.event_date.split("-").map(Number);
        return new Date(year, month - 1, day) >= today;
      })
      .slice(0, 3);
  }, [discovery.events]);

  const savedItems = data?.library.filter((item) => item.engagement_type === "save") || [];
  const followedProfiles = data?.library.filter((item) => item.engagement_type === "follow" && item.target_type === "creator_profile") || [];
  const likedItems = data?.library.filter((item) => item.engagement_type === "like") || [];
  const displayName = [data?.member?.first_name, data?.member?.last_name].filter(Boolean).join(" ") || user?.email || "Member";
  const memberRole = data?.member?.member_role || "fan";
  const interests = useMemo(() => parseTags([data?.member?.interest_tags, data?.member?.favorite_genre].filter(Boolean).join(",")), [data?.member?.favorite_genre, data?.member?.interest_tags]);
  const discoveryCity = data?.member?.discovery_city || data?.member?.location || "";
  const feedItems = useMemo(() => buildFeedItems(discovery, { role: memberRole, interests, city: discoveryCity }), [discovery, discoveryCity, interests, memberRole]);
  const rolePlan = getRolePlan(memberRole, data?.creatorProfiles.length || 0);
  const nextBestActions = useMemo(() => getNextBestActions({
    role: memberRole,
    member: data?.member,
    savedCount: savedItems.length,
    followingCount: followedProfiles.length,
    creatorProfileCount: data?.creatorProfiles.length || 0,
    submissionCount: data?.contentSubmissions.length || 0,
    suggestionCount: data?.playlistSuggestions.length || 0,
  }), [data?.contentSubmissions.length, data?.creatorProfiles.length, data?.member, data?.playlistSuggestions.length, followedProfiles.length, memberRole, savedItems.length]);

  const handlePreferenceSave = async (updates: Partial<NonNullable<DashboardData["member"]>>) => {
    if (!authHeader || !data?.member) return;
    setSavingPreferences(true);
    const payload = {
      email: data.member.email || user?.email || "",
      first_name: data.member.first_name || "Member",
      last_name: data.member.last_name || "Profile",
      phone: data.member.phone || "",
      instagram_handle: data.member.instagram_handle || "",
      favorite_songs: data.member.favorite_songs || "",
      favorite_albums: data.member.favorite_albums || "",
      favorite_lyrics: data.member.favorite_lyrics || "",
      favorite_djs: data.member.favorite_djs || "",
      favorite_genre: data.member.favorite_genre || "",
      bio: data.member.bio || "",
      location: data.member.location || "",
      is_public: data.member.is_public ?? true,
      profile_visibility: data.member.profile_visibility || "public",
      member_role: data.member.member_role || "fan",
      discovery_city: data.member.discovery_city || data.member.location || "",
      interest_tags: data.member.interest_tags || data.member.favorite_genre || "",
      onboarding_completed: data.member.onboarding_completed || false,
      ...updates,
    };
    const res = await fetch("/api/members?action=me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const result = await res.json();
      setData((current) => current ? { ...current, member: result.member } : current);
    }
    setSavingPreferences(false);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-10">
            <div>
              <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-3">Signed-in Home</p>
              <h1 className="font-display text-6xl md:text-9xl neon-text-simple">HOME</h1>
              <p className="text-gray-300 font-heading text-xl mt-3">
                {displayName}: discover culture, save what matters, follow creators, suggest playlist tracks, submit stories, and manage your role in the scene.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/submit-article" className="px-5 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red font-heading uppercase flex items-center gap-2"><Send className="w-4 h-4" /> Submit Story</Link>
              <Link to="/membership" className="px-5 py-3 border border-white/20 text-white hover:text-neon-red font-heading uppercase">Edit Profile</Link>
            </div>
          </div>

          {!data?.member ? (
            <div className="neon-border bg-black/80 p-8 text-center">
              <p className="text-gray-300 font-heading mb-5">Complete membership before using your dashboard.</p>
              <Link to="/membership" className="px-6 py-3 neon-border bg-neon-red text-black font-heading uppercase">Complete Membership</Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <Metric icon={Bookmark} label="Saved" value={savedItems.length} />
                <Metric icon={UserPlus} label="Following" value={followedProfiles.length} />
                <Metric icon={Heart} label="Likes" value={likedItems.length} />
                <Metric icon={BarChart3} label="Creator Profiles" value={data.creatorProfiles.length} />
              </div>

              <Panel title="Start Here" icon={LayoutDashboard}>
                <div className="mb-5 border border-neon-red/30 bg-neon-red/10 p-4">
                  <p className="text-neon-red font-heading uppercase text-sm mb-1">{rolePlan.label}</p>
                  <p className="text-gray-300 font-heading">{rolePlan.summary}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {rolePlan.actions.map((action) => (
                    <ActionLink key={action.to} {...action} />
                  ))}
                </div>
              </Panel>

              {!data.member.onboarding_completed && (
                <OnboardingPanel
                  member={data.member}
                  saving={savingPreferences}
                  onSave={handlePreferenceSave}
                />
              )}

              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
                <section className="space-y-8">
                  <Panel title="For You" icon={Sparkles}>
                    <div className="grid md:grid-cols-3 gap-3">
                      {nextBestActions.map((action) => <ActionLink key={action.to + action.title} {...action} />)}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[memberRole, discoveryCity, ...interests].filter(Boolean).slice(0, 8).map((tag) => (
                        <span key={tag} className="border border-white/10 px-3 py-1 text-xs font-heading uppercase text-gray-300">{tag}</span>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Culture Feed" icon={Sparkles}>
                    {feedItems.length === 0 ? <Empty text="Seed events, stories, music, playlists, and profiles to activate the feed." /> : (
                      <div className="space-y-3">
                        {feedItems.slice(0, 10).map((item) => (
                          <Link key={`${item.type}-${item.id}`} to={item.href} className="block border border-white/10 p-4 hover:border-neon-red hover:bg-white/[0.03] transition">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <span>
                                <span className="block text-neon-red font-heading text-xs uppercase">{item.type}</span>
                                <span className="block text-white font-heading text-xl">{item.title}</span>
                                <span className="block text-gray-400 text-sm">{item.subtitle}</span>
                              </span>
                              <span className="text-neon-red font-heading uppercase text-sm">{item.action}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Upcoming Events" icon={Ticket}>
                    {upcomingEvents.length === 0 ? <Empty text="No upcoming events are listed yet." /> : (
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <Link key={event.id} to={`/events/${event.id}`} className="block border border-neon-red/30 p-5 hover:bg-white/5 transition">
                            <div className="flex flex-wrap justify-between gap-4">
                              <div>
                                <p className="text-neon-red font-heading text-xs uppercase">{isDesignatedRsvpEvent(event) ? "RSVP Event / Drinks + Table Perks" : "Promoted Event"}</p>
                                <h3 className="font-heading text-2xl text-white">{event.title}</h3>
                                <p className="text-gray-400">{formatEventDate(event.event_date)} / {event.venue_name || "Venue TBA"}</p>
                              </div>
                              <span className="text-neon-red font-heading uppercase">View</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Music & Playlists" icon={Headphones}>
                    <div className="grid md:grid-cols-2 gap-4">
                      {discovery.mixtapes.slice(0, 4).map((mix) => (
                        <Link key={mix.id} to={`/music/${mix.slug || mix.id}`} className="border border-white/10 p-4 hover:border-neon-red transition">
                          <p className="text-white font-heading">{mix.title}</p>
                          <p className="text-neon-red text-sm">DJ {mix.dj_name}</p>
                        </Link>
                      ))}
                      {discovery.playlists.slice(0, 4).map((playlist) => (
                        <a key={playlist.id} href={playlist.external_url} target="_blank" rel="noreferrer" className="border border-white/10 p-4 hover:border-neon-red transition">
                          <p className="text-white font-heading">{playlist.title}</p>
                          <p className="text-neon-red text-sm uppercase">{playlist.platform} / {playlist.playlist_type.replace(/_/g, " ")}</p>
                        </a>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Stories" icon={FileText}>
                    <div className="grid md:grid-cols-2 gap-4">
                      {discovery.articles.slice(0, 4).map((article) => (
                        <Link key={article.id} to={`/stories/${article.slug}`} className="border border-white/10 p-4 hover:border-neon-red transition">
                          <p className="text-white font-heading">{article.title}</p>
                          <p className="text-gray-400 text-sm line-clamp-2">{article.excerpt || "Read the latest culture feature."}</p>
                        </Link>
                      ))}
                    </div>
                  </Panel>
                </section>

                <aside className="space-y-8">
                  <Panel title="Your Library" icon={Bookmark}>
                    {data.library.length === 0 ? <Empty text="Like, save, and follow across the site to build this library." /> : (
                      <div className="space-y-3">
                        {data.library.slice(0, 12).map((item) => (
                          <LibraryItem key={item.id} item={item} profiles={discovery.profiles} mixtapes={discovery.mixtapes} articles={discovery.articles} events={discovery.events} />
                        ))}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Creator Analytics" icon={BarChart3}>
                    {data.creatorProfiles.length === 0 ? (
                      <div>
                        <Empty text="Submit or claim a creator profile to unlock audience stats." />
                        <Link to="/membership" className="mt-4 inline-block text-neon-red hover:text-white font-heading uppercase">Submit Creator Profile</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {data.creatorProfiles.map((profile) => (
                          <Link key={profile.id} to={`/directory/${profile.slug}`} className="block border border-neon-red/30 p-4 hover:bg-white/5 transition">
                            <h3 className="font-heading text-xl text-white">{profile.display_name}</h3>
                            <p className="text-gray-400 uppercase text-sm mb-3">{profile.profile_type} / {profile.status}</p>
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <Stat label="Follows" value={profile.stats.follow || 0} />
                              <Stat label="Likes" value={profile.stats.like || 0} />
                              <Stat label="Saves" value={profile.stats.save || 0} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Your Contributions" icon={Sparkles}>
                    <StatusList title="Stories" empty="No story submissions yet." items={data.contentSubmissions.map((item) => `${item.title} / ${item.status}`)} />
                    <StatusList title="Playlist Ideas" empty="No playlist suggestions yet." items={data.playlistSuggestions.map((item) => `${item.track_title} - ${item.artist_name} / ${item.status} / ${item.vote_count || 0} votes`)} />
                    <StatusList title="Profile Claims" empty="No profile claims yet." items={data.claims.map((item) => `${item.creator_profiles?.display_name || "Profile"} / ${item.status}`)} />
                  </Panel>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Music; children: React.ReactNode }) {
  return (
    <div className="neon-border bg-black/80 p-6">
      <h2 className="font-display text-4xl text-white mb-5 flex items-center gap-3"><Icon className="w-7 h-7 text-neon-red" /> {title}</h2>
      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Music; label: string; value: number }) {
  return (
    <div className="border border-neon-red/40 bg-black/80 p-5">
      <Icon className="w-6 h-6 text-neon-red mb-3" />
      <p className="font-display text-4xl text-white">{value}</p>
      <p className="text-gray-400 font-heading uppercase text-sm">{label}</p>
    </div>
  );
}

function ActionLink({ to, icon: Icon, title, text }: { to: string; icon: typeof Music; title: string; text: string }) {
  return (
    <Link to={to} className="border border-white/10 bg-white/[0.03] p-4 hover:border-neon-red hover:bg-neon-red/10 transition">
      <Icon className="w-7 h-7 text-neon-red mb-3" />
      <h3 className="font-heading text-white uppercase tracking-wider">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{text}</p>
    </Link>
  );
}

function OnboardingPanel({ member, saving, onSave }: {
  member: NonNullable<DashboardData["member"]>;
  saving: boolean;
  onSave: (updates: Partial<NonNullable<DashboardData["member"]>>) => void;
}) {
  const [role, setRole] = useState(member.member_role || "fan");
  const [city, setCity] = useState(member.discovery_city || member.location || "");
  const [interests, setInterests] = useState(member.interest_tags || member.favorite_genre || "");

  return (
    <Panel title="Tune Your Home" icon={CheckCircle2}>
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <div>
          <p className="text-gray-300 font-heading text-lg">
            Set your role and interests so Home can prioritize the right events, stories, music, playlists, and people.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            You can adjust this later from Membership.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-neon-red font-heading uppercase text-xs mb-2">Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black border border-white/20 px-3 py-3 text-white font-heading outline-none focus:border-neon-red">
              <option value="fan">Fan / Member</option>
              <option value="dj">DJ</option>
              <option value="artist">Artist</option>
              <option value="promoter">Promoter</option>
              <option value="venue">Venue</option>
              <option value="media">Writer / Media</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-neon-red font-heading uppercase text-xs mb-2">Discovery City</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kingston, Montego Bay..." className="w-full bg-black border border-white/20 px-3 py-3 text-white font-heading outline-none focus:border-neon-red" />
          </label>
          <label className="block">
            <span className="block text-neon-red font-heading uppercase text-xs mb-2">Interests</span>
            <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="dancehall, trap, events..." className="w-full bg-black border border-white/20 px-3 py-3 text-white font-heading outline-none focus:border-neon-red" />
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave({ member_role: role, discovery_city: city, interest_tags: interests, favorite_genre: interests.split(",")[0]?.trim() || member.favorite_genre || "", onboarding_completed: true })}
            className="md:col-span-3 px-5 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red font-heading uppercase disabled:opacity-60"
          >
            {saving ? "Saving..." : "Personalize Home"}
          </button>
        </div>
      </div>
    </Panel>
  );
}

function buildFeedItems(discovery: DiscoveryData, preferences: { role: string; interests: string[]; city: string }): FeedItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventItems: FeedItem[] = discovery.events
    .filter((event) => {
      const [year, month, day] = event.event_date.split("-").map(Number);
      return new Date(year, month - 1, day) >= today;
    })
    .map((event) => ({
      id: String(event.id),
      type: "event",
      title: event.title,
      subtitle: `${formatEventDate(event.event_date)} / ${event.venue_name || "Venue TBA"}`,
      href: `/events/${event.id}`,
      action: isDesignatedRsvpEvent(event) ? "RSVP" : "Save",
      sortDate: event.event_date,
    }));

  const storyItems: FeedItem[] = discovery.articles.map((article) => ({
    id: String(article.id),
    type: "story",
    title: article.title,
    subtitle: article.excerpt || article.author || "Culture story",
    href: `/stories/${article.slug}`,
    action: "Read",
    sortDate: article.published_at || article.created_at,
  }));

  const musicItems: FeedItem[] = discovery.mixtapes.map((mix) => ({
    id: String(mix.id),
    type: "music",
    title: mix.title,
    subtitle: `DJ ${mix.dj_name}`,
    href: `/music/${mix.slug || mix.id}`,
    action: "Listen",
    sortDate: mix.release_date || mix.created_at,
  }));

  const playlistItems: FeedItem[] = discovery.playlists.map((playlist) => ({
    id: String(playlist.id),
    type: "playlist",
    title: playlist.title,
    subtitle: `${playlist.platform} / ${playlist.playlist_type.replace(/_/g, " ")}`,
    href: "/playlists",
    action: "Open",
    sortDate: playlist.published_at || playlist.created_at,
  }));

  const profileItems: FeedItem[] = discovery.profiles.map((profile) => ({
    id: String(profile.id),
    type: "profile",
    title: profile.display_name,
    subtitle: `${profile.profile_type}${profile.city ? ` / ${profile.city}` : ""}`,
    href: `/directory/${profile.slug}`,
    action: "Follow",
    sortDate: profile.created_at,
  }));

  return [...eventItems, ...storyItems, ...musicItems, ...playlistItems, ...profileItems]
    .map((item) => ({ ...item, score: scoreFeedItem(item, preferences) }))
    .sort((a, b) => b.score - a.score || String(b.sortDate || "").localeCompare(String(a.sortDate || "")));
}

function scoreFeedItem(item: FeedItem, preferences: { role: string; interests: string[]; city: string }) {
  const haystack = `${item.title} ${item.subtitle} ${item.type}`.toLowerCase();
  let score = item.sortDate ? 20 : 0;
  if (preferences.city && haystack.includes(preferences.city.toLowerCase())) score += 30;
  preferences.interests.forEach((interest) => {
    if (haystack.includes(interest.toLowerCase())) score += 18;
  });
  if (["dj", "artist"].includes(preferences.role) && ["music", "playlist", "profile"].includes(item.type)) score += 14;
  if (["promoter", "venue"].includes(preferences.role) && item.type === "event") score += 18;
  if (preferences.role === "media" && item.type === "story") score += 18;
  return score;
}

function parseTags(value: string) {
  return value.split(/[,/|]+/).map((tag) => tag.trim()).filter(Boolean).slice(0, 12);
}

function getNextBestActions({ role, member, savedCount, followingCount, creatorProfileCount, submissionCount, suggestionCount }: {
  role: string;
  member?: DashboardData["member"];
  savedCount: number;
  followingCount: number;
  creatorProfileCount: number;
  submissionCount: number;
  suggestionCount: number;
}) {
  if (!member?.onboarding_completed) {
    return [
      { to: "/membership", icon: CheckCircle2, title: "Finish Setup", text: "Set your role, interests, city, and visibility." },
      { to: "/directory", icon: Mic2, title: "Find People", text: "Follow creators so Home gets sharper." },
      { to: "/playlists", icon: Music, title: "Shape Sound", text: "Suggest tracks for ILHH playlists." },
    ];
  }
  if (["dj", "artist"].includes(role) && creatorProfileCount === 0) {
    return [
      { to: "/membership", icon: Mic2, title: "Claim Presence", text: "Create or claim your public creator profile." },
      { to: "/music/upload", icon: Headphones, title: "Add Music", text: "Give listeners something to discover." },
      { to: "/playlists", icon: Music, title: "Pitch Tracks", text: "Suggest music for ILHH curation." },
    ];
  }
  if (["promoter", "venue"].includes(role)) {
    return [
      { to: "/submit-event", icon: Calendar, title: "Submit Event", text: "Put upcoming nights into discovery." },
      { to: "/directory", icon: Mic2, title: "Book Talent", text: "Find DJs, artists, and venues." },
      { to: "/playlists", icon: Music, title: "Soundtrack", text: "Connect events to playlist ideas." },
    ];
  }
  if (role === "media" || role === "writer") {
    return [
      { to: "/submit-article", icon: PenLine, title: submissionCount ? "Submit Next Story" : "Pitch Story", text: "Build a visible contribution history." },
      { to: "/events", icon: Calendar, title: "Cover Events", text: "Find nights worth documenting." },
      { to: "/directory", icon: Mic2, title: "Source Voices", text: "Find creators for interviews." },
    ];
  }
  return [
    { to: "/directory", icon: UserPlus, title: followingCount ? "Follow More" : "Follow Creators", text: "Tune Home around people you care about." },
    { to: "/events", icon: Calendar, title: savedCount ? "Plan Next Move" : "Save Events", text: "Build your event shortlist." },
    { to: "/playlists", icon: Music, title: suggestionCount ? "Vote Rankings" : "Suggest Tracks", text: "Help shape community playlists." },
  ];
}

function getRolePlan(role: string, creatorProfileCount: number) {
  if (["dj", "artist"].includes(role)) {
    return {
      label: "Creator Home",
      summary: creatorProfileCount > 0 ? "Grow your audience: keep your profile sharp, connect music, watch engagement, and submit events or stories." : "Start by submitting or claiming your creator profile so people can follow, save, book, and discover you.",
      actions: [
        { to: "/membership", icon: Mic2, title: "Create Profile", text: "Submit or update your public creator profile." },
        { to: "/music/upload", icon: Headphones, title: "Upload Music", text: "Add mixes or sets for discovery." },
        { to: "/events", icon: Calendar, title: "Connect Events", text: "Find and save relevant events." },
        { to: "/playlists", icon: Music, title: "Suggest Tracks", text: "Push songs into ILHH playlist consideration." },
      ],
    };
  }

  if (["promoter", "venue"].includes(role)) {
    return {
      label: "Promoter / Venue Home",
      summary: "Use the platform to submit events, build profile trust, understand interest, and connect your nights to music and editorial.",
      actions: [
        { to: "/submit-event", icon: Calendar, title: "Submit Event", text: "Send events for review and publication." },
        { to: "/membership", icon: Mic2, title: "Public Profile", text: "Create or update your promoter/venue profile." },
        { to: "/stories", icon: FileText, title: "Read Stories", text: "Track coverage and community context." },
        { to: "/playlists", icon: Music, title: "Event Soundtracks", text: "Suggest music for event-linked playlists." },
      ],
    };
  }

  if (["media", "writer"].includes(role)) {
    return {
      label: "Writer / Media Home",
      summary: "Use your Home to pitch stories, follow the scene, save research, and build a visible contribution history.",
      actions: [
        { to: "/submit-article", icon: PenLine, title: "Submit Story", text: "Pitch or submit recaps, interviews, and scene reports." },
        { to: "/events", icon: Calendar, title: "Find Coverage", text: "Track upcoming events worth covering." },
        { to: "/directory", icon: Mic2, title: "Find Voices", text: "Discover creators for features and interviews." },
        { to: "/music", icon: Headphones, title: "Track Music", text: "Save mixes and music references." },
      ],
    };
  }

  return {
    label: "Member Home",
    summary: "Discover what is happening, follow people you care about, save music and stories, RSVP to events, and shape playlists.",
    actions: [
      { to: "/events", icon: Calendar, title: "Plan Events", text: "Save events and RSVP where available." },
      { to: "/directory", icon: Mic2, title: "Follow Creators", text: "Follow DJs, artists, promoters, and venues." },
      { to: "/playlists", icon: Music, title: "Shape Playlists", text: "Suggest tracks and vote on community rankings." },
      { to: "/stories", icon: FileText, title: "Read Stories", text: "Read and save culture coverage." },
    ],
  };
}

function LibraryItem({ item, profiles, mixtapes, articles, events }: {
  item: DashboardData["library"][number];
  profiles: CreatorProfile[];
  mixtapes: Mixtape[];
  articles: Article[];
  events: EventWithDJs[];
}) {
  const target = resolveLibraryTarget(item, profiles, mixtapes, articles, events);
  return (
    <Link to={target.href} className="flex items-center justify-between gap-3 border border-white/10 p-3 hover:border-neon-red transition">
      <span>
        <span className="block text-neon-red font-heading text-xs uppercase">{item.engagement_type} / {item.target_type.replace(/_/g, " ")}</span>
        <span className="block text-white font-heading">{target.label}</span>
      </span>
      <ExternalLink className="w-4 h-4 text-neon-red" />
    </Link>
  );
}

function resolveLibraryTarget(item: DashboardData["library"][number], profiles: CreatorProfile[], mixtapes: Mixtape[], articles: Article[], events: EventWithDJs[]) {
  if (item.target_type === "creator_profile") {
    const profile = profiles.find((entry) => String(entry.id) === item.target_id);
    return { label: profile?.display_name || `Profile #${item.target_id}`, href: profile ? `/directory/${profile.slug}` : "/directory" };
  }
  if (item.target_type === "mixtape") {
    const mix = mixtapes.find((entry) => String(entry.id) === item.target_id);
    return { label: mix?.title || `Music #${item.target_id}`, href: mix ? `/music/${mix.slug || mix.id}` : "/music" };
  }
  if (item.target_type === "article") {
    const article = articles.find((entry) => String(entry.id) === item.target_id);
    return { label: article?.title || `Story #${item.target_id}`, href: article ? `/stories/${article.slug}` : "/stories" };
  }
  const event = events.find((entry) => String(entry.id) === item.target_id);
  return { label: event?.title || `Event #${item.target_id}`, href: event ? `/events/${event.id}` : "/events" };
}

function StatusList({ title, empty, items }: { title: string; empty: string; items: string[] }) {
  return (
    <div className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
      <p className="text-neon-red font-heading uppercase text-sm mb-2">{title}</p>
      {items.length === 0 ? <p className="text-gray-500 text-sm">{empty}</p> : (
        <div className="space-y-2">
          {items.slice(0, 4).map((item) => <p key={item} className="text-gray-300 text-sm">{item}</p>)}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div><p className="font-display text-3xl text-neon-red">{value}</p><p className="text-gray-400 text-xs uppercase">{label}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <p className="text-gray-400 font-heading">{text}</p>;
}
