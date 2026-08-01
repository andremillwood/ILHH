import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Download, Headphones, Pause, Play, TrendingUp, Upload } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Mixtape } from "@/shared/types";

const formatDuration = (seconds?: number | null) => {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};

export default function Mixtapes() {
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMixId, setActiveMixId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/mixtapes")
      .then((res) => res.json())
      .then((data) => {
        setMixtapes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const activeMix = mixtapes.find((mix) => mix.id === activeMixId);

  const togglePlay = async (mix: Mixtape) => {
    if (!mix.audio_url) return;

    if (activeMixId === mix.id && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setActiveMixId(null);
      return;
    }

    setActiveMixId(mix.id);
    window.setTimeout(() => {
      audioRef.current?.play();
    }, 0);
    fetch(`/api/mixtapes?id=${mix.id}&action=play`, { method: "PATCH" }).catch(() => undefined);
  };

  const handleDownload = (mix: Mixtape) => {
    if (!mix.download_url && !mix.audio_url) return;
    fetch(`/api/mixtapes?id=${mix.id}&action=download`, { method: "PATCH" }).catch(() => undefined);
    window.open(mix.download_url || mix.audio_url || "", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="relative flex min-h-[78vh] items-center overflow-hidden border-b-8 border-neon-red px-4 pb-16 pt-32">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/mixtape-hero.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_420px] gap-10 items-center">
          <div>
            <span className="press-label mb-5">Sound system archive</span>
            <h1 className="mb-6 font-display text-7xl uppercase leading-[0.88] text-white md:text-9xl">
              THE TAPE BOX
            </h1>
            <p className="mb-8 max-w-3xl border-l-4 border-neon-red pl-5 font-body text-lg leading-8 text-gray-300 md:text-xl">
              A native audio home for Caribbean hip hop mixes, DJ sets, event recordings, and member uploads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#mixes" className="press-button">
                Stream Mixes
              </a>
              <Link to="/mixtapes/upload" className="press-button-secondary">
                Upload Mix
              </Link>
              <Link to="/playlists" className="px-8 py-4 border border-white/20 text-white hover:text-neon-red hover:border-neon-red transition font-heading text-xl uppercase tracking-wider text-center">
                Playlist Hub
              </Link>
            </div>
          </div>

          <div className="press-panel p-8">
            <Headphones className="w-20 h-20 text-neon-red mb-6" />
            <h2 className="font-display text-5xl text-white mb-4">ON-PLATFORM AUDIO</h2>
            <p className="text-gray-300 font-heading mb-6">
              Built for direct streaming, track pages, downloads, DJ discovery, play counts, and future playlists.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-neon-red/40 p-4 text-center">
                <Play className="w-6 h-6 text-neon-red mx-auto mb-2" />
                <p className="text-white font-heading text-xs uppercase">Stream</p>
              </div>
              <div className="border border-neon-red/40 p-4 text-center">
                <Download className="w-6 h-6 text-neon-red mx-auto mb-2" />
                <p className="text-white font-heading text-xs uppercase">Download</p>
              </div>
              <div className="border border-neon-red/40 p-4 text-center">
                <Upload className="w-6 h-6 text-neon-red mx-auto mb-2" />
                <p className="text-white font-heading text-xs uppercase">Upload</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mixes" className="pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white font-heading text-xl">Loading mixes...</div>
          ) : mixtapes.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg mb-6">Mixes dropping soon. Uploads are now supported.</p>
                <Link to="/mixtapes/upload" className="px-8 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                  Upload First Mix
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-t border-white/30">
              {mixtapes.map((mixtape, index) => (
                <div key={mixtape.id} className="grid items-center gap-5 border-b border-white/20 bg-black py-6 transition hover:bg-white/[0.04] md:grid-cols-[72px_1fr_auto]">
                  <button
                    type="button"
                    onClick={() => togglePlay(mixtape)}
                    disabled={!mixtape.audio_url}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-neon-red text-black transition hover:bg-white disabled:opacity-40"
                  >
                    {activeMixId === mixtape.id ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gray-500 font-heading text-sm">#{index + 1}</span>
                      {mixtape.genre && <span className="text-neon-red font-heading text-xs uppercase tracking-wider">{mixtape.genre}</span>}
                      {mixtape.status === "pending" && <span className="text-yellow-400 font-heading text-xs uppercase">Pending Review</span>}
                    </div>
                    <Link to={`/mixtapes/${mixtape.slug || mixtape.id}`} className="font-display text-3xl uppercase text-white transition hover:text-neon-red md:text-4xl">
                      {mixtape.title}
                    </Link>
                    <p className="text-neon-red font-heading">DJ {mixtape.dj_name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-heading mt-2">
                      <span>{formatDuration(mixtape.duration_seconds)}</span>
                      <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-1" />{mixtape.play_count} plays</span>
                      <span>{mixtape.download_count || 0} downloads</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {(mixtape.is_downloadable !== false && (mixtape.download_url || mixtape.audio_url)) && (
                      <button
                        type="button"
                        onClick={() => handleDownload(mixtape)}
                        className="w-12 h-12 border border-neon-red/50 text-neon-red hover:bg-neon-red hover:text-black transition flex items-center justify-center"
                        aria-label="Download mix"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    <Link to={`/mixtapes/${mixtape.slug || mixtape.id}`} className="px-5 py-3 border border-white/20 text-white hover:text-neon-red hover:border-neon-red transition font-heading uppercase tracking-wider">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeMix && activeMix.audio_url && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-neon-red bg-black p-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_520px] gap-4 items-center">
            <div>
              <p className="text-white font-heading">{activeMix.title}</p>
              <p className="text-neon-red font-heading text-sm">DJ {activeMix.dj_name}</p>
            </div>
            <audio ref={audioRef} src={activeMix.audio_url} controls className="w-full" onEnded={() => setActiveMixId(null)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
