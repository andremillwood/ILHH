import { useEffect, useState } from "react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { useNavigate } from "react-router";
import { Settings, Calendar, Users, FileText, Music, Image, Gift, Plus, Trash2, Edit, Save, X, Loader2 } from "lucide-react";
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

interface Member {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  instagram_handle?: string;
  created_at: string;
}

export default function Admin() {
  const { user, loading: isPending } = useAuth();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState({ totalEvents: 0, totalMembers: 0, totalRsvps: 0 });

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showMixtapeForm, setShowMixtapeForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingMixtape, setEditingMixtape] = useState<Mixtape | null>(null);

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
      const res = await fetch("/api/admin/events", { headers: { Authorization: authHeader! } });
      if (res.ok) setEvents(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles", { headers: { Authorization: authHeader! } });
      if (res.ok) setArticles(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchMixtapes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mixtapes", { headers: { Authorization: authHeader! } });
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

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/events?id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchEvents();
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchArticles();
  };

  const handleDeleteMixtape = async (id: number) => {
    if (!confirm("Delete this mixtape?")) return;
    await fetch(`/api/admin/mixtapes?id=${id}`, { method: "DELETE", headers: { Authorization: authHeader! } });
    fetchMixtapes();
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
    { id: "members", label: "Members", icon: Users },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "mixtapes", label: "Mixtapes", icon: Music },
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
          <div className="neon-border bg-black/80 backdrop-blur-md mb-8">
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
          <div className="neon-border bg-black/80 backdrop-blur-md p-8">
            {/* Overview Tab */}
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
                      <div key={event.id} className="flex items-center justify-between p-4 border border-gray-800 rounded">
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
                      <div key={article.id} className="flex items-center justify-between p-4 border border-gray-800 rounded">
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
                      <div key={mixtape.id} className="flex items-center justify-between p-4 border border-gray-800 rounded">
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
                <h2 className="font-display text-4xl text-white mb-8">Gallery Partners</h2>
                <p className="text-gray-400">Gallery management coming soon.</p>
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
    const url = event ? `/api/admin/events?id=${event.id}` : "/api/admin/events";
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
      <form onSubmit={handleSubmit} className="neon-border bg-black p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
    const url = article ? `/api/admin/articles?id=${article.id}` : "/api/admin/articles";
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
      <form onSubmit={handleSubmit} className="neon-border bg-black p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
    const url = mixtape ? `/api/admin/mixtapes?id=${mixtape.id}` : "/api/admin/mixtapes";
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
      <form onSubmit={handleSubmit} className="neon-border bg-black p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
