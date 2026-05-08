import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Download, Headphones, Pause, Play, Share2, TrendingUp } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Mixtape } from "@/shared/types";

export default function MixtapeDetail() {
  const { mixSlug } = useParams();
  const [mix, setMix] = useState<Mixtape | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!mixSlug) return;
    const query = /^\d+$/.test(mixSlug) ? `id=${mixSlug}` : `slug=${mixSlug}`;
    fetch(`/api/mixtapes?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setMix(data.error ? null : data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [mixSlug]);

  const togglePlay = () => {
    if (!mix?.audio_url || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    audioRef.current.play();
    setPlaying(true);
    fetch(`/api/mixtapes?id=${mix.id}&action=play`, { method: "PATCH" }).catch(() => undefined);
  };

  const downloadMix = () => {
    if (!mix) return;
    fetch(`/api/mixtapes?id=${mix.id}&action=download`, { method: "PATCH" }).catch(() => undefined);
    window.open(mix.download_url || mix.audio_url || "", "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-heading">Loading mix...</div>;
  }

  if (!mix) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <h1 className="font-display text-5xl text-white mb-6">Mix Not Found</h1>
          <Link to="/mixtapes" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase">
            Back To Mixes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[420px_1fr] gap-10 items-center">
          <div className="neon-border bg-black/80 aspect-square overflow-hidden flex items-center justify-center">
            {mix.cover_art_url ? (
              <img src={mix.cover_art_url} alt={mix.title} className="w-full h-full object-cover" />
            ) : (
              <Headphones className="w-36 h-36 text-neon-red" />
            )}
          </div>
          <div>
            <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">{mix.genre || "Mixtape"}</p>
            <h1 className="font-display text-7xl md:text-9xl text-white mb-4">{mix.title}</h1>
            <p className="text-3xl text-neon-red font-heading mb-6">DJ {mix.dj_name}</p>
            {mix.description && <p className="text-xl text-gray-300 font-heading max-w-3xl mb-8">{mix.description}</p>}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                type="button"
                onClick={togglePlay}
                disabled={!mix.audio_url}
                className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider flex items-center justify-center disabled:opacity-50"
              >
                {playing ? <Pause className="w-6 h-6 mr-3" /> : <Play className="w-6 h-6 mr-3" />}
                {playing ? "Pause" : "Play Mix"}
              </button>
              {mix.is_downloadable !== false && (
                <button
                  type="button"
                  onClick={downloadMix}
                  className="px-8 py-4 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading text-xl uppercase tracking-wider flex items-center justify-center"
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-neon-red/40 p-4">
                <TrendingUp className="w-6 h-6 text-neon-red mb-2" />
                <p className="text-white font-heading">{mix.play_count} plays</p>
              </div>
              <div className="border border-neon-red/40 p-4">
                <Download className="w-6 h-6 text-neon-red mb-2" />
                <p className="text-white font-heading">{mix.download_count || 0} downloads</p>
              </div>
              <div className="border border-neon-red/40 p-4">
                <Share2 className="w-6 h-6 text-neon-red mb-2" />
                <p className="text-white font-heading">Share ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {mix.audio_url && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto neon-border bg-black/80 p-8">
            <audio ref={audioRef} src={mix.audio_url} controls className="w-full" onEnded={() => setPlaying(false)} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
