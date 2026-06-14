import { useEffect, useState } from "react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { useNavigate } from "react-router";
import { Settings, Calendar, Users, FileText, Music, Image, Gift, Plus, Trash2, Edit, Save, X, Loader2, ShoppingBag, ClipboardList, Mail, BarChart3, LifeBuoy, RefreshCw, BadgeCheck, UserPlus, Headphones } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";

interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  venue_name?: string;
  venue_address?: string;
  theme?: string;
  sub_theme?: string;
  flyer_url?: string;
  is_featured?: boolean;
  is_special?: boolean;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  is_published: boolean;
}

interface Mixtape {
  id: number;
  title: string;
  dj_name: string;
  cover_art_url?: string;
  embed_url?: string;
  description?: string;
  release_date?: string;
}

interface GalleryImage {
  id: number;
  gallery_id: number;
  event_id?: number | null;
  image_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  photographer_name?: string | null;
  downloadable?: boolean;
  sort_order?: number;
}

interface AdminGallery {
  id: number;
  title?: string;
  partner_name: string;
  partner_logo_url?: string;
  partner_instagram?: string;
  gallery_url?: string;
  event_id?: number | null;
  description?: string;
  featured_image_url?: string;
  source_label?: string;
  status?: "draft" | "published" | "archived";
  allow_download?: boolean;
  is_featured?: boolean;
  events?: { id: number; title: string; event_date: string };
  event_gallery_images?: GalleryImage[];
}

interface MusicPlaylist {
  id: number;
  title: string;
  slug: string;
  description?: string;
  curator_name?: string;
  playlist_type: "ilhh_curated" | "community_ranked" | "event_soundtrack" | "creator_spotlight" | "member_suggested";
  mood?: string;
  platform: "spotify" | "apple_music" | "soundcloud" | "youtube" | "audiomack" | "tidal" | "other";
  external_url: string;
  embed_url?: string;
  cover_url?: string;
  tags?: string;
  is_featured?: boolean;
  is_published?: boolean;
}

interface PlaylistSuggestion {
  id: number;
  track_title: string;
  artist_name: string;
  platform_url?: string;
  reason?: string;
  suggested_for?: string;
  status: "pending" | "shortlisted" | "added" | "rejected";
  vote_count?: number;
  members?: { first_name?: string; last_name?: string; email?: string };
  music_playlists?: { title?: string; slug?: string };
}

interface Member {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  instagram_handle?: string;
  created_at: string;
}

interface AdminOrder {
  id: number;
  public_id: string;
  customer_email?: string;
  customer_name?: string;
  total_cents: number;
  currency: string;
  status_v2: string;
  fulfillment_status: string;
  printful_order_id?: string;
  tracking_url?: string;
  tracking_number?: string;
  carrier?: string;
  created_at: string;
  merch_order_items?: Array<{ id: number; product_name: string; color?: string; size?: string; quantity: number }>;
}

interface SupportRequest {
  id: number;
  request_type: string;
  order_public_id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface AdminRsvp {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone: string;
  package_type: string;
  status?: string;
  created_at: string;
}

interface AdminEventSubmission {
  id: number;
  event_title: string;
  event_date: string;
  venue_name: string;
  promoter_name: string;
  promoter_email: string;
  status: string;
  created_at: string;
}

interface AdminCreatorProfile {
  id: number;
  profile_type: "dj" | "artist" | "promoter" | "venue" | "community";
  status: "draft" | "pending" | "approved" | "rejected" | "suspended";
  display_name: string;
  slug: string;
  tagline?: string;
  bio?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  cover_url?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  youtube_url?: string;
  soundcloud_url?: string;
  spotify_url?: string;
  website_url?: string;
  booking_email?: string;
  booking_phone?: string;
  specialties?: string;
  notable_credits?: string;
  equipment_or_services?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  review_notes?: string;
  created_at: string;
}

interface AdminContentSubmission {
  id: number;
  title: string;
  submission_type: string;
  status: string;
  contributor_name: string;
  contributor_email: string;
  category?: string;
  created_at: string;
}

interface AdminProfileClaim {
  id: number;
  status: string;
  evidence?: string;
  created_at: string;
  members?: { email?: string; first_name?: string; last_name?: string };
  creator_profiles?: { display_name?: string; slug?: string };
}

export default function Admin() {
  const { user, loading: isPending } = useAuth();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState({ totalEvents: 0, totalMembers: 0, totalRsvps: 0, totalOrders: 0, failedOrders: 0, pendingEventSubmissions: 0, totalCreatorProfiles: 0, pendingCreatorProfiles: 0, totalPlaylists: 0, pendingPlaylistSuggestions: 0 });

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [rsvps, setRsvps] = useState<AdminRsvp[]>([]);
  const [eventSubmissions, setEventSubmissions] = useState<AdminEventSubmission[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [creatorProfiles, setCreatorProfiles] = useState<AdminCreatorProfile[]>([]);
  const [contentSubmissions, setContentSubmissions] = useState<AdminContentSubmission[]>([]);
  const [profileClaims, setProfileClaims] = useState<AdminProfileClaim[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [playlistSuggestions, setPlaylistSuggestions] = useState<PlaylistSuggestion[]>([]);
  const [galleries, setGalleries] = useState<AdminGallery[]>([]);
  const [analyticsCounts, setAnalyticsCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showMixtapeForm, setShowMixtapeForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingMixtape, setEditingMixtape] = useState<Mixtape | null>(null);
  const [showCreatorProfileForm, setShowCreatorProfileForm] = useState(false);
  const [editingCreatorProfile, setEditingCreatorProfile] = useState<AdminCreatorProfile | null>(null);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<MusicPlaylist | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<AdminGallery | null>(null);
  const [imageGallery, setImageGallery] = useState<AdminGallery | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    } else if (user && authHeader) {
      fetchStats();
    }
  }, [user, isPending, navigate, authHeader]);

  useEffect(() => {
    if (authHeader && activeTab === "events") fetchEvents();
    if (authHeader && activeTab === "articles") fetchArticles();
    if (authHeader && activeTab === "mixtapes") fetchMixtapes();
    if (authHeader && activeTab === "members") fetchMembers();
    if (authHeader && activeTab === "orders") fetchOrders();
    if (authHeader && activeTab === "rsvps") fetchRsvps();
    if (authHeader && activeTab === "submissions") fetchEventSubmissions();
    if (authHeader && activeTab === "support") fetchSupportRequests();
    if (authHeader && activeTab === "analytics") fetchAnalytics();
    if (authHeader && activeTab === "creator_profiles") fetchCreatorProfiles();
    if (authHeader && activeTab === "content_submissions") fetchContentSubmissions();
    if (authHeader && activeTab === "profile_claims") fetchProfileClaims();
    if (authHeader && activeTab === "playlists") { fetchPlaylists(); fetchPlaylistSuggestions(); }
    if (authHeader && activeTab === "gallery") { fetchGalleries(); fetchEvents(); }
  }, [activeTab, authHeader]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin", { headers: { Authorization: authHeader! } });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=events", { headers: { Authorization: authHeader! } });
      if (res.ok) setEvents(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=articles", { headers: { Authorization: authHeader! } });
      if (res.ok) setArticles(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchMixtapes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=mixtapes", { headers: { Authorization: authHeader! } });
      if (res.ok) setMixtapes(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members?action=community");
      if (res.ok) setMembers(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=orders", { headers: { Authorization: authHeader! } });
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=rsvps", { headers: { Authorization: authHeader! } });
      if (res.ok) setRsvps(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchEventSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=event_submissions", { headers: { Authorization: authHeader! } });
      if (res.ok) setEventSubmissions(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=support_requests", { headers: { Authorization: authHeader! } });
      if (res.ok) setSupportRequests(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=analytics", { headers: { Authorization: authHeader! } });
      if (res.ok) setAnalyticsCounts((await res.json()).counts || {});
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchCreatorProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=creator_profiles", { headers: { Authorization: authHeader! } });
      if (res.ok) setCreatorProfiles(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchContentSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=content_submissions", { headers: { Authorization: authHeader! } });
      if (res.ok) setContentSubmissions(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchProfileClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=profile_claims", { headers: { Authorization: authHeader! } });
      if (res.ok) setProfileClaims(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=music_playlists", { headers: { Authorization: authHeader! } });
      if (res.ok) setPlaylists(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchPlaylistSuggestions = async () => {
    try {
      const res = await fetch("/api/admin?resource=playlist_suggestions", { headers: { Authorization: authHeader! } });
      if (res.ok) setPlaylistSuggestions(await res.json());
    } catch (err) { console.error(err); }
  };

  const updatePlaylistSuggestion = async (id: number, status: PlaylistSuggestion["status"]) => {
    await fetch(`/api/admin?resource=playlist_suggestions&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ status }),
    });
    fetchPlaylistSuggestions();
    fetchStats();
  };

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?resource=galleries", { headers: { Authorization: authHeader! } });
      if (res.ok) setGalleries(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Delete this gallery and its native images?")) return;
    await fetch(`/api/admin?resource=galleries&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchGalleries();
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm("Delete this image from the native gallery?")) return;
    await fetch(`/api/admin?resource=gallery_images&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchGalleries();
  };

  const reviewContentSubmission = async (id: number, action: "approve" | "reject" | "needs_changes") => {
    const review_notes = prompt("Review notes", "") || "";
    await fetch(`/api/admin?resource=content_submissions&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ action, review_notes }),
    });
    fetchContentSubmissions();
    fetchStats();
  };

  const reviewProfileClaim = async (id: number, action: "approve" | "reject") => {
    const review_notes = prompt("Review notes", "") || "";
    await fetch(`/api/admin?resource=profile_claims&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ action, review_notes }),
    });
    fetchProfileClaims();
    fetchCreatorProfiles();
    fetchStats();
  };

  const resendOrderEmail = async (id: number) => {
    await fetch(`/api/admin?resource=orders&id=${id}&action=resend`, { method: "POST", headers: { Authorization: authHeader! } });
    fetchOrders();
  };

  const updateOrder = async (order: AdminOrder) => {
    const tracking_number = prompt("Tracking number", order.tracking_number || "") || "";
    const tracking_url = prompt("Tracking URL", order.tracking_url || "") || "";
    const carrier = prompt("Carrier", order.carrier || "") || "";
    const status_v2 = prompt("Lifecycle status", order.status_v2 || "shipped") || order.status_v2;
    await fetch(`/api/admin?resource=orders&id=${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ status_v2, fulfillment_status: status_v2, tracking_number, tracking_url, carrier }),
    });
    fetchOrders();
  };

  const syncPrintful = async (id: number) => {
    await fetch(`/api/admin?resource=orders&id=${id}&action=sync_printful`, { method: "POST", headers: { Authorization: authHeader! } });
    fetchOrders();
  };

  const updateRsvpStatus = async (id: number, status: string) => {
    await fetch(`/api/admin?resource=rsvps&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ status }),
    });
    fetchRsvps();
  };

  const reviewSubmission = async (id: number, action: "approve" | "reject") => {
    const review_notes = prompt("Review notes", "") || "";
    await fetch(`/api/admin?resource=event_submissions&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ action, review_notes }),
    });
    fetchEventSubmissions();
    fetchStats();
  };

  const updateSupportStatus = async (id: number, status: string) => {
    await fetch(`/api/admin?resource=support_requests&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader! },
      body: JSON.stringify({ status }),
    });
    fetchSupportRequests();
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin?resource=events&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchEvents();
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin?resource=articles&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchArticles();
  };

  const handleDeleteMixtape = async (id: number) => {
    if (!confirm("Delete this mixtape?")) return;
    await fetch(`/api/admin?resource=mixtapes&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchMixtapes();
  };

  const handleDeleteCreatorProfile = async (id: number) => {
    if (!confirm("Delete this creator profile?")) return;
    await fetch(`/api/admin?resource=creator_profiles&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchCreatorProfiles();
    fetchStats();
  };

  const handleDeletePlaylist = async (id: number) => {
    if (!confirm("Delete this playlist?")) return;
    await fetch(`/api/admin?resource=music_playlists&id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchPlaylists();
    fetchStats();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "events", label: "Events", icon: Calendar },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "rsvps", label: "RSVPs", icon: ClipboardList },
    { id: "submissions", label: "Submissions", icon: Mail },
    { id: "creator_profiles", label: "Profiles", icon: BadgeCheck },
    { id: "content_submissions", label: "Editorial", icon: FileText },
    { id: "profile_claims", label: "Claims", icon: UserPlus },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "members", label: "Members", icon: Users },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "mixtapes", label: "Mixtapes", icon: Music },
    { id: "playlists", label: "Playlists", icon: Headphones },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "coupons", label: "Coupons", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-12">
            <Settings className="w-12 h-12 text-neon-red mr-4" />
            <h1 className="font-display text-6xl md:text-8xl neon-text-simple">ADMIN</h1>
          </div>

          {/* Tab Navigation */}
          <div className="glass-panel mb-8">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-heading uppercase tracking-wider transition ${activeTab === tab.id ? "bg-neon-red text-black" : "text-white hover:text-neon-red"
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="glass-panel p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Dashboard Overview</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Orders</p>
                    <p className="text-white text-3xl font-display">{stats.totalOrders}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Failed Orders</p>
                    <p className="text-white text-3xl font-display">{stats.failedOrders}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Pending Events</p>
                    <p className="text-white text-3xl font-display">{stats.pendingEventSubmissions}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Creator Profiles</p>
                    <p className="text-white text-3xl font-display">{stats.totalCreatorProfiles}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Pending Profiles</p>
                    <p className="text-white text-3xl font-display">{stats.pendingCreatorProfiles}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Playlists</p>
                    <p className="text-white text-3xl font-display">{stats.totalPlaylists}</p>
                  </div>
                  <div className="border-l-2 border-neon-red pl-4">
                    <p className="text-neon-red font-heading text-sm uppercase mb-2">Playlist Ideas</p>
                    <p className="text-white text-3xl font-display">{stats.pendingPlaylistSuggestions}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Merch Orders</h2>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-white/10 bg-black/40 p-4 grid lg:grid-cols-[1fr_auto] gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-white font-heading text-lg">{order.public_id}</h3>
                            <span className={`px-2 py-1 text-xs font-heading uppercase ${order.status_v2 === "failed" ? "bg-neon-red text-black" : "bg-white/10 text-white"}`}>{order.status_v2?.replace(/_/g, " ")}</span>
                            <span className="px-2 py-1 text-xs font-heading uppercase bg-neon-red/20 text-neon-red">{order.fulfillment_status}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{order.customer_name || "Customer"} • {order.customer_email || "No email"} • {order.currency?.toUpperCase()} {(order.total_cents / 100).toFixed(2)}</p>
                          <p className="text-gray-500 text-sm mt-1">{order.merch_order_items?.map(item => `${item.quantity}x ${item.product_name} ${item.color || ""} ${item.size || ""}`).join(", ")}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-start">
                          <a href={`/order/${order.public_id}`} className="px-3 py-2 border border-neon-red/50 text-neon-red font-heading text-sm uppercase">Status</a>
                          <button onClick={() => resendOrderEmail(order.id)} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Resend</button>
                          <button onClick={() => syncPrintful(order.id)} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase inline-flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Sync</button>
                          <button onClick={() => updateOrder(order)} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Tracking</button>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-400 text-center py-8">No orders yet</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === "rsvps" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">RSVP Submissions</h2>
                <div className="space-y-4">
                  {rsvps.map(rsvp => (
                    <div key={rsvp.id} className="border border-white/10 bg-black/40 p-4">
                      <h3 className="text-white font-heading text-lg">{rsvp.name}</h3>
                      <p className="text-gray-400 text-sm">{rsvp.email} • {rsvp.phone} • Event #{rsvp.event_id}</p>
                      <p className="text-neon-red font-heading text-sm uppercase mt-1">{rsvp.package_type} / {rsvp.status || "pending"}</p>
                      <select value={rsvp.status || "pending"} onChange={(e) => updateRsvpStatus(rsvp.id, e.target.value)} className="mt-3 p-2 bg-black border border-white/20 text-white font-heading">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="waitlisted">Waitlisted</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                  ))}
                  {rsvps.length === 0 && <p className="text-gray-400 text-center py-8">No RSVPs yet</p>}
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Event Submissions</h2>
                <div className="space-y-4">
                  {eventSubmissions.map(submission => (
                    <div key={submission.id} className="border border-white/10 bg-black/40 p-4">
                      <h3 className="text-white font-heading text-lg">{submission.event_title}</h3>
                      <p className="text-gray-400 text-sm">{submission.event_date} • {submission.venue_name}</p>
                      <p className="text-gray-500 text-sm">{submission.promoter_name} • {submission.promoter_email}</p>
                      <p className="text-neon-red font-heading text-sm uppercase mt-1">{submission.status}</p>
                      {submission.status === "pending" && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button onClick={() => reviewSubmission(submission.id, "approve")} className="px-3 py-2 bg-neon-red text-black font-heading uppercase text-sm">Approve</button>
                          <button onClick={() => reviewSubmission(submission.id, "reject")} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading uppercase text-sm">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {eventSubmissions.length === 0 && <p className="text-gray-400 text-center py-8">No event submissions yet</p>}
                </div>
              </div>
            )}

            {activeTab === "creator_profiles" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Creator Profiles</h2>
                  <button
                    onClick={() => { setEditingCreatorProfile(null); setShowCreatorProfileForm(true); }}
                    className="flex items-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Profile
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {creatorProfiles.map(profile => (
                      <div key={profile.id} className="border border-white/10 bg-black/40 p-4 grid lg:grid-cols-[1fr_auto] gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-white font-heading text-lg">{profile.display_name}</h3>
                            <span className="px-2 py-1 text-xs font-heading uppercase bg-white/10 text-white">{profile.profile_type}</span>
                            <span className={`px-2 py-1 text-xs font-heading uppercase ${profile.status === "approved" ? "bg-neon-red text-black" : "bg-white/10 text-white"}`}>{profile.status}</span>
                            {profile.is_verified && <span className="px-2 py-1 text-xs font-heading uppercase bg-neon-red/20 text-neon-red">Verified</span>}
                          </div>
                          <p className="text-gray-400 text-sm">/{profile.slug} {profile.city ? `• ${profile.city}` : ""}</p>
                          {profile.tagline && <p className="text-gray-500 text-sm mt-1">{profile.tagline}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2 items-start">
                          <a href={`/profiles/${profile.slug}`} className="px-3 py-2 border border-neon-red/50 text-neon-red font-heading text-sm uppercase">View</a>
                          <button onClick={() => { setEditingCreatorProfile(profile); setShowCreatorProfileForm(true); }} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Edit</button>
                          <button onClick={() => handleDeleteCreatorProfile(profile.id)} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading text-sm uppercase">Delete</button>
                        </div>
                      </div>
                    ))}
                    {creatorProfiles.length === 0 && <p className="text-gray-400 text-center py-8">No creator profiles yet</p>}
                  </div>
                )}
                {showCreatorProfileForm && (
                  <CreatorProfileFormModal
                    profile={editingCreatorProfile}
                    authHeader={authHeader!}
                    onClose={() => { setShowCreatorProfileForm(false); setEditingCreatorProfile(null); }}
                    onSave={() => { setShowCreatorProfileForm(false); setEditingCreatorProfile(null); fetchCreatorProfiles(); fetchStats(); }}
                  />
                )}
              </div>
            )}

            {activeTab === "content_submissions" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Editorial Submissions</h2>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {contentSubmissions.map(submission => (
                      <div key={submission.id} className="border border-white/10 bg-black/40 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-white font-heading text-lg">{submission.title}</h3>
                            <p className="text-gray-400 text-sm">{submission.contributor_name} • {submission.contributor_email}</p>
                            <p className="text-neon-red font-heading text-sm uppercase mt-1">{submission.submission_type} / {submission.status}</p>
                          </div>
                          {["pending", "needs_changes"].includes(submission.status) && (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => reviewContentSubmission(submission.id, "approve")} className="px-3 py-2 bg-neon-red text-black font-heading uppercase text-sm">Publish</button>
                              <button onClick={() => reviewContentSubmission(submission.id, "needs_changes")} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading uppercase text-sm">Changes</button>
                              <button onClick={() => reviewContentSubmission(submission.id, "reject")} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading uppercase text-sm">Reject</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {contentSubmissions.length === 0 && <p className="text-gray-400 text-center py-8">No editorial submissions yet</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile_claims" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Profile Claims</h2>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {profileClaims.map(claim => (
                      <div key={claim.id} className="border border-white/10 bg-black/40 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-white font-heading text-lg">{claim.creator_profiles?.display_name || "Creator Profile"}</h3>
                            <p className="text-gray-400 text-sm">{claim.members?.first_name} {claim.members?.last_name} • {claim.members?.email}</p>
                            <p className="text-gray-500 text-sm mt-2">{claim.evidence}</p>
                            <p className="text-neon-red font-heading text-sm uppercase mt-1">{claim.status}</p>
                          </div>
                          {claim.status === "pending" && (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => reviewProfileClaim(claim.id, "approve")} className="px-3 py-2 bg-neon-red text-black font-heading uppercase text-sm">Approve</button>
                              <button onClick={() => reviewProfileClaim(claim.id, "reject")} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading uppercase text-sm">Reject</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {profileClaims.length === 0 && <p className="text-gray-400 text-center py-8">No profile claims yet</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === "support" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Support Requests</h2>
                <div className="space-y-4">
                  {supportRequests.map(request => (
                    <div key={request.id} className="border border-white/10 bg-black/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-white font-heading text-lg">#{request.id} {request.subject}</h3>
                          <p className="text-gray-400 text-sm">{request.name} • {request.email} • {request.request_type}</p>
                          {request.order_public_id && <p className="text-gray-500 text-sm">Order {request.order_public_id}</p>}
                        </div>
                        <select value={request.status} onChange={(e) => updateSupportStatus(request.id, e.target.value)} className="p-2 bg-black border border-white/20 text-white font-heading">
                          <option value="open">Open</option>
                          <option value="in_review">In review</option>
                          <option value="waiting_customer">Waiting customer</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <p className="text-gray-300 font-heading text-sm mt-3 whitespace-pre-wrap">{request.message}</p>
                    </div>
                  ))}
                  {supportRequests.length === 0 && <p className="text-gray-400 text-center py-8">No support requests yet</p>}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Analytics</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {["checkout_started", "checkout_completed", "rsvp_submitted", "event_submitted", "member_joined", "merch_product_viewed"].map(eventName => (
                    <div key={eventName} className="border-l-2 border-neon-red pl-4">
                      <p className="text-neon-red font-heading text-sm uppercase mb-2">{eventName.replace(/_/g, " ")}</p>
                      <p className="text-white text-3xl font-display">{analyticsCounts[eventName] || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Events</h2>
                  <button
                    onClick={() => { setEditingEvent(null); setShowEventForm(true); }}
                    className="flex items-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Event
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex items-center justify-between p-4 border border-white/10 rounded card-hover bg-black/40">
                        <div>
                          <h3 className="text-white font-heading text-lg">{event.title}</h3>
                          <p className="text-gray-400 text-sm">{event.event_date} • {event.venue_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingEvent(event); setShowEventForm(true); }} className="p-2 text-gray-400 hover:text-neon-red"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {events.length === 0 && <p className="text-gray-400 text-center py-8">No events yet</p>}
                  </div>
                )}

                {/* Event Form Modal */}
                {showEventForm && (
                  <EventFormModal
                    event={editingEvent}
                    authHeader={authHeader!}
                    onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
                    onSave={() => { setShowEventForm(false); setEditingEvent(null); fetchEvents(); }}
                  />
                )}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Articles</h2>
                  <button
                    onClick={() => { setEditingArticle(null); setShowArticleForm(true); }}
                    className="flex items-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Article
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {articles.map(article => (
                      <div key={article.id} className="flex items-center justify-between p-4 border border-white/10 rounded card-hover bg-black/40">
                        <div>
                          <h3 className="text-white font-heading text-lg">{article.title}</h3>
                          <p className="text-gray-400 text-sm">{article.is_published ? "Published" : "Draft"} • /{article.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingArticle(article); setShowArticleForm(true); }} className="p-2 text-gray-400 hover:text-neon-red"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {articles.length === 0 && <p className="text-gray-400 text-center py-8">No articles yet</p>}
                  </div>
                )}

                {showArticleForm && (
                  <ArticleFormModal
                    article={editingArticle}
                    authHeader={authHeader!}
                    onClose={() => { setShowArticleForm(false); setEditingArticle(null); }}
                    onSave={() => { setShowArticleForm(false); setEditingArticle(null); fetchArticles(); }}
                  />
                )}
              </div>
            )}

            {/* Mixtapes Tab */}
            {activeTab === "mixtapes" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Mixtapes</h2>
                  <button
                    onClick={() => { setEditingMixtape(null); setShowMixtapeForm(true); }}
                    className="flex items-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Mixtape
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4">
                    {mixtapes.map(mixtape => (
                      <div key={mixtape.id} className="flex items-center justify-between p-4 border border-white/10 rounded card-hover bg-black/40">
                        <div>
                          <h3 className="text-white font-heading text-lg">{mixtape.title}</h3>
                          <p className="text-gray-400 text-sm">by {mixtape.dj_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingMixtape(mixtape); setShowMixtapeForm(true); }} className="p-2 text-gray-400 hover:text-neon-red"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteMixtape(mixtape.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {mixtapes.length === 0 && <p className="text-gray-400 text-center py-8">No mixtapes yet</p>}
                  </div>
                )}

                {showMixtapeForm && (
                  <MixtapeFormModal
                    mixtape={editingMixtape}
                    authHeader={authHeader!}
                    onClose={() => { setShowMixtapeForm(false); setEditingMixtape(null); }}
                    onSave={() => { setShowMixtapeForm(false); setEditingMixtape(null); fetchMixtapes(); }}
                  />
                )}
              </div>
            )}

            {activeTab === "playlists" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-4xl text-white">Playlists</h2>
                  <button
                    onClick={() => { setEditingPlaylist(null); setShowPlaylistForm(true); }}
                    className="flex items-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Playlist
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="space-y-4 mb-10">
                    {playlists.map(playlist => (
                      <div key={playlist.id} className="border border-white/10 bg-black/40 p-4 grid lg:grid-cols-[1fr_auto] gap-4">
                        <div>
                          <h3 className="text-white font-heading text-lg">{playlist.title}</h3>
                          <p className="text-gray-400 text-sm">{playlist.platform} • {playlist.playlist_type} • /{playlist.slug}</p>
                          <p className="text-neon-red font-heading text-xs uppercase mt-1">{playlist.is_published ? "Published" : "Draft"} {playlist.is_featured ? "• Featured" : ""}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-start">
                          <a href={playlist.external_url} target="_blank" rel="noreferrer" className="px-3 py-2 border border-neon-red/50 text-neon-red font-heading text-sm uppercase">Open</a>
                          <button onClick={() => { setEditingPlaylist(playlist); setShowPlaylistForm(true); }} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Edit</button>
                          <button onClick={() => handleDeletePlaylist(playlist.id)} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading text-sm uppercase">Delete</button>
                        </div>
                      </div>
                    ))}
                    {playlists.length === 0 && <p className="text-gray-400 text-center py-8">No playlists yet</p>}
                  </div>
                )}
                <h3 className="font-display text-3xl text-white mb-4">Community Suggestions</h3>
                <div className="space-y-3">
                  {playlistSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border border-white/10 bg-black/40 p-4 grid lg:grid-cols-[1fr_auto] gap-4">
                      <div>
                        <h4 className="text-white font-heading">{suggestion.track_title} - {suggestion.artist_name}</h4>
                        <p className="text-gray-400 text-sm">{suggestion.members?.first_name} {suggestion.members?.last_name} • {suggestion.vote_count || 0} votes</p>
                        {suggestion.reason && <p className="text-gray-500 text-sm mt-1">{suggestion.reason}</p>}
                        <p className="text-neon-red font-heading text-xs uppercase mt-1">{suggestion.status}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.platform_url && <a href={suggestion.platform_url} target="_blank" rel="noreferrer" className="px-3 py-2 border border-neon-red/50 text-neon-red font-heading text-sm uppercase">Listen</a>}
                        <button onClick={() => updatePlaylistSuggestion(suggestion.id, "shortlisted")} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Shortlist</button>
                        <button onClick={() => updatePlaylistSuggestion(suggestion.id, "added")} className="px-3 py-2 bg-neon-red text-black font-heading text-sm uppercase">Added</button>
                        <button onClick={() => updatePlaylistSuggestion(suggestion.id, "rejected")} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading text-sm uppercase">Reject</button>
                      </div>
                    </div>
                  ))}
                  {playlistSuggestions.length === 0 && <p className="text-gray-400 text-center py-8">No playlist suggestions yet</p>}
                </div>
                {showPlaylistForm && (
                  <PlaylistFormModal
                    playlist={editingPlaylist}
                    authHeader={authHeader!}
                    onClose={() => { setShowPlaylistForm(false); setEditingPlaylist(null); }}
                    onSave={() => { setShowPlaylistForm(false); setEditingPlaylist(null); fetchPlaylists(); fetchStats(); }}
                  />
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Members ({members.length})</h2>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="p-3 text-neon-red font-heading">Name</th>
                          <th className="p-3 text-neon-red font-heading">Instagram</th>
                          <th className="p-3 text-neon-red font-heading">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(m => (
                          <tr key={m.id} className="border-b border-gray-800/50">
                            <td className="p-3 text-white">{m.first_name} {m.last_name}</td>
                            <td className="p-3 text-gray-400">{m.instagram_handle || '-'}</td>
                            <td className="p-3 text-gray-400">{new Date(m.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Placeholder tabs */}
            {activeTab === "gallery" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-display text-4xl text-white">Event Galleries</h2>
                  <button onClick={() => { setEditingGallery(null); setShowGalleryForm(true); }} className="px-4 py-2 bg-neon-red text-black font-heading uppercase flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Gallery
                  </button>
                </div>
                {loading ? <Loader2 className="w-8 h-8 text-neon-red animate-spin" /> : (
                  <div className="space-y-4">
                    {galleries.map((gallery) => (
                      <div key={gallery.id} className="border border-gray-800 bg-black/60 p-5">
                        <div className="flex flex-wrap justify-between gap-4">
                          <div>
                            <p className="text-neon-red font-heading uppercase text-xs">{gallery.status || "published"} / {gallery.events?.title || "No event linked"}</p>
                            <h3 className="font-heading text-2xl text-white">{gallery.title || gallery.partner_name}</h3>
                            <p className="text-gray-400">{gallery.partner_name} {gallery.gallery_url ? "/ external gallery linked" : ""}</p>
                            <p className="text-gray-500 text-sm">{gallery.event_gallery_images?.length || 0} native images</p>
                          </div>
                          <div className="flex flex-wrap gap-2 h-fit">
                            <button onClick={() => setImageGallery(gallery)} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Images</button>
                            <button onClick={() => { setEditingGallery(gallery); setShowGalleryForm(true); }} className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Edit</button>
                            <button onClick={() => handleDeleteGallery(gallery.id)} className="px-3 py-2 border border-white/20 text-white hover:text-red-500 font-heading text-sm uppercase">Delete</button>
                          </div>
                        </div>
                        {gallery.event_gallery_images && gallery.event_gallery_images.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-8 gap-2 mt-4">
                            {gallery.event_gallery_images.slice(0, 8).map((image) => (
                              <button key={image.id} onClick={() => handleDeleteGalleryImage(image.id)} className="aspect-square border border-white/10 bg-black overflow-hidden hover:border-red-500" title="Click to delete image">
                                <img src={image.thumbnail_url || image.image_url} alt={image.caption || ""} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {showGalleryForm && (
                  <GalleryFormModal
                    gallery={editingGallery}
                    events={events}
                    authHeader={authHeader!}
                    onClose={() => { setShowGalleryForm(false); setEditingGallery(null); }}
                    onSave={() => { setShowGalleryForm(false); setEditingGallery(null); fetchGalleries(); }}
                  />
                )}
                {imageGallery && (
                  <GalleryImagesModal
                    gallery={imageGallery}
                    authHeader={authHeader!}
                    onClose={() => setImageGallery(null)}
                    onSave={() => { fetchGalleries(); setImageGallery(null); }}
                  />
                )}
              </div>
            )}

            {activeTab === "coupons" && (
              <div>
                <h2 className="font-display text-4xl text-white mb-8">Happy Hour Coupons</h2>
                <p className="text-gray-400">Coupon management coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryFormModal({ gallery, events, authHeader, onClose, onSave }: { gallery: AdminGallery | null; events: Event[]; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: gallery?.title || "",
    partner_name: gallery?.partner_name || "I Luv Hip Hop",
    partner_logo_url: gallery?.partner_logo_url || "",
    partner_instagram: gallery?.partner_instagram || "",
    gallery_url: gallery?.gallery_url || "",
    event_id: gallery?.event_id ? String(gallery.event_id) : "",
    description: gallery?.description || "",
    featured_image_url: gallery?.featured_image_url || "",
    source_label: gallery?.source_label || "",
    status: gallery?.status || "published",
    allow_download: gallery?.allow_download ?? true,
    is_featured: gallery?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = gallery ? `/api/admin?resource=galleries&id=${gallery.id}` : "/api/admin?resource=galleries";
    await fetch(url, {
      method: gallery ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ ...form, event_id: form.event_id ? Number(form.event_id) : null }),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{gallery ? "Edit Gallery" : "New Event Gallery"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Gallery title" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <select value={form.event_id} onChange={e => setForm({ ...form, event_id: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
            <option value="">No linked event</option>
            {events.map((event) => <option key={event.id} value={event.id}>{event.event_date} / {event.title}</option>)}
          </select>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.partner_name} onChange={e => setForm({ ...form, partner_name: e.target.value })} placeholder="Photographer / partner name" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
            <input value={form.partner_instagram} onChange={e => setForm({ ...form, partner_instagram: e.target.value })} placeholder="Instagram handle" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <input value={form.gallery_url} onChange={e => setForm({ ...form, gallery_url: e.target.value })} placeholder="External gallery URL, e.g. Picflow" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input value={form.featured_image_url} onChange={e => setForm({ ...form, featured_image_url: e.target.value })} placeholder="Cover image URL" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input value={form.partner_logo_url} onChange={e => setForm({ ...form, partner_logo_url: e.target.value })} placeholder="Partner logo URL" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <div className="grid md:grid-cols-3 gap-4">
            <input value={form.source_label} onChange={e => setForm({ ...form, source_label: e.target.value })} placeholder="Source label" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center gap-2 text-white font-heading"><input type="checkbox" checked={form.allow_download} onChange={e => setForm({ ...form, allow_download: e.target.checked })} /> Downloads</label>
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Gallery</>}
        </button>
      </form>
    </div>
  );
}

function GalleryImagesModal({ gallery, authHeader, onClose, onSave }: { gallery: AdminGallery; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    image_url: "",
    thumbnail_url: "",
    caption: "",
    photographer_name: gallery.partner_name || "",
    downloadable: true,
    sort_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin?resource=gallery_images", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ ...form, gallery_id: gallery.id, event_id: gallery.event_id || null }),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">Add Native Image</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <p className="text-gray-400 font-heading mb-4">{gallery.title || gallery.partner_name}</p>
        <div className="grid gap-4">
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Full image URL" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Thumbnail URL, optional" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Caption" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.photographer_name} onChange={e => setForm({ ...form, photographer_name: e.target.value })} placeholder="Photographer" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Sort order" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <label className="flex items-center gap-2 text-white font-heading"><input type="checkbox" checked={form.downloadable} onChange={e => setForm({ ...form, downloadable: e.target.checked })} /> Allow image download</label>
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Add Image</>}
        </button>
      </form>
    </div>
  );
}

// Event Form Modal
function EventFormModal({ event, authHeader, onClose, onSave }: { event: Event | null; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    event_date: event?.event_date || "",
    event_time: event?.event_time || "",
    venue_name: event?.venue_name || "",
    venue_address: event?.venue_address || "",
    theme: event?.theme || "",
    sub_theme: event?.sub_theme || "",
    flyer_url: event?.flyer_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = event ? `/api/admin?resource=events&id=${event.id}` : "/api/admin?resource=events";
    const method = event ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{event ? "Edit Event" : "New Event"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <input type="text" placeholder="Event Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <div className="grid md:grid-cols-2 gap-4">
            <input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
            <input type="time" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <input type="text" placeholder="Venue Name" value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input type="text" placeholder="Venue Address" value={form.venue_address} onChange={e => setForm({ ...form, venue_address: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Theme" value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="text" placeholder="Sub Theme" value={form.sub_theme} onChange={e => setForm({ ...form, sub_theme: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <input type="url" placeholder="Flyer URL" value={form.flyer_url} onChange={e => setForm({ ...form, flyer_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Event</>}
        </button>
      </form>
    </div>
  );
}

// Article Form Modal
function ArticleFormModal({ article, authHeader, onClose, onSave }: { article: Article | null; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    author: article?.author || "",
    is_published: article?.is_published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = article ? `/api/admin?resource=articles&id=${article.id}` : "/api/admin?resource=articles";
    const method = article ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{article ? "Edit Article" : "New Article"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <input type="text" placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="text" placeholder="Slug (e.g. my-article)*" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="text" placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <textarea placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <textarea placeholder="Content *" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" required />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="w-5 h-5" />
            <span className="text-white font-heading">Publish immediately</span>
          </label>
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Article</>}
        </button>
      </form>
    </div>
  );
}

// Mixtape Form Modal
function MixtapeFormModal({ mixtape, authHeader, onClose, onSave }: { mixtape: Mixtape | null; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: mixtape?.title || "",
    dj_name: mixtape?.dj_name || "",
    cover_art_url: mixtape?.cover_art_url || "",
    embed_url: mixtape?.embed_url || "",
    description: mixtape?.description || "",
    release_date: mixtape?.release_date || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = mixtape ? `/api/admin?resource=mixtapes&id=${mixtape.id}` : "/api/admin?resource=mixtapes";
    const method = mixtape ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{mixtape ? "Edit Mixtape" : "New Mixtape"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <input type="text" placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="text" placeholder="DJ Name *" value={form.dj_name} onChange={e => setForm({ ...form, dj_name: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="url" placeholder="Cover Art URL" value={form.cover_art_url} onChange={e => setForm({ ...form, cover_art_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input type="url" placeholder="Embed URL (SoundCloud/Mixcloud)" value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <input type="date" placeholder="Release Date" value={form.release_date} onChange={e => setForm({ ...form, release_date: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Mixtape</>}
        </button>
      </form>
    </div>
  );
}

function PlaylistFormModal({ playlist, authHeader, onClose, onSave }: { playlist: MusicPlaylist | null; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: playlist?.title || "",
    slug: playlist?.slug || "",
    description: playlist?.description || "",
    curator_name: playlist?.curator_name || "I Luv Hip Hop",
    playlist_type: playlist?.playlist_type || "ilhh_curated",
    mood: playlist?.mood || "",
    platform: playlist?.platform || "spotify",
    external_url: playlist?.external_url || "",
    embed_url: playlist?.embed_url || "",
    cover_url: playlist?.cover_url || "",
    tags: playlist?.tags || "",
    is_featured: Boolean(playlist?.is_featured),
    is_published: playlist?.is_published !== false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = playlist ? `/api/admin?resource=music_playlists&id=${playlist.id}` : "/api/admin?resource=music_playlists";
    const method = playlist ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{playlist ? "Edit Playlist" : "New Playlist"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <input type="text" placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="text" placeholder="Slug *" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <div className="grid md:grid-cols-2 gap-4">
            <select value={form.playlist_type} onChange={e => setForm({ ...form, playlist_type: e.target.value as MusicPlaylist["playlist_type"] })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
              <option value="ilhh_curated">ILHH Curated</option>
              <option value="community_ranked">Community Ranked</option>
              <option value="event_soundtrack">Event Soundtrack</option>
              <option value="creator_spotlight">Creator Spotlight</option>
              <option value="member_suggested">Member Suggested</option>
            </select>
            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value as MusicPlaylist["platform"] })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
              <option value="spotify">Spotify</option>
              <option value="apple_music">Apple Music</option>
              <option value="soundcloud">SoundCloud</option>
              <option value="youtube">YouTube</option>
              <option value="audiomack">Audiomack</option>
              <option value="tidal">Tidal</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Curator" value={form.curator_name} onChange={e => setForm({ ...form, curator_name: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="text" placeholder="Mood / use case" value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <input type="url" placeholder="External playlist URL *" value={form.external_url} onChange={e => setForm({ ...form, external_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="url" placeholder="Embed URL" value={form.embed_url} onChange={e => setForm({ ...form, embed_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input type="url" placeholder="Cover image URL" value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <input type="text" placeholder="Tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 text-white font-heading"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-3 text-white font-heading"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Playlist</>}
        </button>
      </form>
    </div>
  );
}

function CreatorProfileFormModal({ profile, authHeader, onClose, onSave }: { profile: AdminCreatorProfile | null; authHeader: string; onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    profile_type: profile?.profile_type || "dj",
    status: profile?.status || "pending",
    display_name: profile?.display_name || "",
    slug: profile?.slug || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || "",
    city: profile?.city || "",
    country: profile?.country || "Jamaica",
    avatar_url: profile?.avatar_url || "",
    cover_url: profile?.cover_url || "",
    instagram_handle: profile?.instagram_handle || "",
    tiktok_handle: profile?.tiktok_handle || "",
    youtube_url: profile?.youtube_url || "",
    soundcloud_url: profile?.soundcloud_url || "",
    spotify_url: profile?.spotify_url || "",
    website_url: profile?.website_url || "",
    booking_email: profile?.booking_email || "",
    booking_phone: profile?.booking_phone || "",
    specialties: profile?.specialties || "",
    notable_credits: profile?.notable_credits || "",
    equipment_or_services: profile?.equipment_or_services || "",
    is_featured: Boolean(profile?.is_featured),
    is_verified: Boolean(profile?.is_verified),
    review_notes: profile?.review_notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = profile ? `/api/admin?resource=creator_profiles&id=${profile.id}` : "/api/admin?resource=creator_profiles";
    const method = profile ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-white">{profile ? "Edit Creator Profile" : "New Creator Profile"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            <select value={form.profile_type} onChange={e => setForm({ ...form, profile_type: e.target.value as AdminCreatorProfile["profile_type"] })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
              <option value="dj">DJ</option>
              <option value="artist">Artist</option>
              <option value="promoter">Promoter</option>
              <option value="venue">Venue</option>
              <option value="community">Community</option>
            </select>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AdminCreatorProfile["status"] })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
              <option value="draft">Draft</option>
            </select>
            <input type="text" placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <input type="text" placeholder="Display Name *" value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" required />
          <input type="text" placeholder="Tagline" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          <textarea placeholder="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="text" placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="url" placeholder="Avatar URL" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="url" placeholder="Cover URL" value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <input type="text" placeholder="Instagram" value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="email" placeholder="Booking Email" value={form.booking_email} onChange={e => setForm({ ...form, booking_email: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="text" placeholder="Booking Phone" value={form.booking_phone} onChange={e => setForm({ ...form, booking_phone: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="url" placeholder="Website URL" value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
            <input type="url" placeholder="SoundCloud URL" value={form.soundcloud_url} onChange={e => setForm({ ...form, soundcloud_url: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
          </div>
          <textarea placeholder="Specialties" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} rows={2} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <textarea placeholder="Notable Credits" value={form.notable_credits} onChange={e => setForm({ ...form, notable_credits: e.target.value })} rows={2} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <textarea placeholder="Equipment, services, or venue details" value={form.equipment_or_services} onChange={e => setForm({ ...form, equipment_or_services: e.target.value })} rows={2} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <textarea placeholder="Review notes" value={form.review_notes} onChange={e => setForm({ ...form, review_notes: e.target.value })} rows={2} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 text-white font-heading"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-3 text-white font-heading"><input type="checkbox" checked={form.is_verified} onChange={e => setForm({ ...form, is_verified: e.target.checked })} /> Verified</label>
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-6 w-full flex items-center justify-center px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
        </button>
      </form>
    </div>
  );
}
