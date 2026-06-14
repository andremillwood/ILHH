import { useEffect, useState } from "react";
import { ExternalLink, Headphones, Loader2, Music2, Send, ThumbsUp } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import type { MusicPlaylist, PlaylistSuggestion } from "@/shared/types";

const playlistTypes = [
  { id: "all", label: "All" },
  { id: "ilhh_curated", label: "ILHH Curated" },
  { id: "community_ranked", label: "Community Ranked" },
  { id: "event_soundtrack", label: "Event Soundtracks" },
  { id: "creator_spotlight", label: "Creator Spotlights" },
  { id: "member_suggested", label: "Member Suggested" },
];

export default function Playlists() {
  const { user } = useAuth();
  const authHeader = useAuthHeader();
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [suggestions, setSuggestions] = useState<PlaylistSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [form, setForm] = useState({ playlist_id: "", track_title: "", artist_name: "", platform_url: "", reason: "", suggested_for: "" });
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/public?resource=playlists&suggestions=true")
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.playlists || []);
        setSuggestions(data.suggestions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const filteredPlaylists = playlists.filter((playlist) => activeType === "all" || playlist.playlist_type === activeType);

  const submitSuggestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !authHeader) {
      window.location.href = "/membership";
      return;
    }
    const payload = {
      ...form,
      playlist_id: form.playlist_id ? Number(form.playlist_id) : undefined,
    };
    const res = await fetch("/api/public?resource=playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setMessage(res?.ok ? "Suggestion submitted. The team can shortlist it for upcoming playlists." : "Suggestion failed. Check the fields and try again.");
    if (res?.ok) {
      setForm({ playlist_id: "", track_title: "", artist_name: "", platform_url: "", reason: "", suggested_for: "" });
      load();
    }
  };

  const vote = async (suggestionId: number) => {
    if (!user || !authHeader) {
      window.location.href = "/membership";
      return;
    }
    await fetch(`/api/public?resource=playlists&action=vote&suggestionId=${suggestionId}`, { method: "POST", headers: { Authorization: authHeader } }).catch(() => undefined);
    load();
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-14 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-8 items-end">
          <div>
            <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Streaming Culture</p>
            <h1 className="font-display text-6xl md:text-9xl neon-text-simple mb-6">PLAYLIST HUB</h1>
            <p className="text-xl text-gray-300 font-heading max-w-3xl">
              ILHH-curated playlists, event soundtracks, creator spotlights, and community-ranked suggestions across Spotify, SoundCloud, YouTube, and more.
            </p>
          </div>
          <div className="neon-border bg-black/80 p-6">
            <Headphones className="w-14 h-14 text-neon-red mb-4" />
            <h2 className="font-display text-4xl text-white mb-3">COMMUNITY SIGNAL</h2>
            <p className="text-gray-300 font-heading">Suggest tracks, vote on picks, and help shape future ILHH playlists.</p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2">
          {playlistTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-3 border font-heading uppercase text-sm whitespace-nowrap transition ${activeType === type.id ? "bg-neon-red border-neon-red text-black" : "border-white/20 text-white hover:text-neon-red"}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="neon-border bg-black/80 p-10 text-center text-gray-400 font-heading">Playlists are coming soon.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaylists.map((playlist) => (
                <a key={playlist.id} href={playlist.external_url} target="_blank" rel="noreferrer" className="neon-border bg-black/80 p-6 hover:neon-glow transition flex flex-col min-h-[360px]">
                  <div className="aspect-square bg-neon-red/10 border border-neon-red/30 mb-5 flex items-center justify-center overflow-hidden">
                    {playlist.cover_url ? <img src={playlist.cover_url} alt={playlist.title} className="w-full h-full object-cover" /> : <Music2 className="w-20 h-20 text-neon-red" />}
                  </div>
                  <p className="text-neon-red font-heading uppercase text-xs tracking-[0.2em] mb-2">{playlist.platform} / {playlist.playlist_type.replace(/_/g, " ")}</p>
                  <h2 className="font-display text-4xl text-white mb-3">{playlist.title}</h2>
                  <p className="text-gray-300 font-heading line-clamp-3 mb-5">{playlist.description || playlist.mood || "Curated listening from the ILHH ecosystem."}</p>
                  <span className="mt-auto text-neon-red font-heading uppercase flex items-center gap-2">Open Playlist <ExternalLink className="w-4 h-4" /></span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <form onSubmit={submitSuggestion} className="neon-border bg-black/80 p-6 space-y-4 h-fit">
            <h2 className="font-display text-4xl text-white">SUGGEST A TRACK</h2>
            <select value={form.playlist_id} onChange={(event) => setForm({ ...form, playlist_id: event.target.value })} className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none">
              <option value="">General ILHH suggestion</option>
              {playlists.map((playlist) => <option key={playlist.id} value={playlist.id}>{playlist.title}</option>)}
            </select>
            <input required value={form.track_title} onChange={(event) => setForm({ ...form, track_title: event.target.value })} placeholder="Track title *" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <input required value={form.artist_name} onChange={(event) => setForm({ ...form, artist_name: event.target.value })} placeholder="Artist name *" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <input value={form.platform_url} onChange={(event) => setForm({ ...form, platform_url: event.target.value })} placeholder="Spotify, SoundCloud, YouTube, or other URL" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <input value={form.suggested_for} onChange={(event) => setForm({ ...form, suggested_for: event.target.value })} placeholder="Suggested for: gym, Thursday night, road trip..." className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <textarea value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} rows={3} placeholder="Why should this be on an ILHH playlist?" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            {message && <p className="text-gray-300 font-heading text-sm">{message}</p>}
            <button className="w-full px-6 py-4 bg-neon-red text-black font-heading uppercase flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Submit Suggestion</button>
          </form>

          <div className="neon-border bg-black/80 p-6">
            <h2 className="font-display text-4xl text-white mb-5">COMMUNITY RANKINGS</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion.id} className="border border-white/10 p-4 grid md:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <p className="text-gray-500 font-heading text-xs">#{index + 1}</p>
                    <h3 className="text-white font-heading text-lg">{suggestion.track_title} - {suggestion.artist_name}</h3>
                    {suggestion.reason && <p className="text-gray-400 text-sm mt-1">{suggestion.reason}</p>}
                    <p className="text-neon-red font-heading text-xs uppercase mt-1">{suggestion.status} {suggestion.suggested_for ? `/ ${suggestion.suggested_for}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {suggestion.platform_url && <a href={suggestion.platform_url} target="_blank" rel="noreferrer" className="px-3 py-2 border border-white/20 text-white hover:text-neon-red font-heading text-sm uppercase">Listen</a>}
                    <button onClick={() => vote(suggestion.id)} className="px-3 py-2 border border-neon-red/50 text-neon-red hover:bg-neon-red hover:text-black font-heading text-sm uppercase flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" /> {suggestion.vote_count || 0}
                    </button>
                  </div>
                </div>
              ))}
              {suggestions.length === 0 && <p className="text-gray-400 font-heading">No suggestions yet. Start the signal.</p>}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
