import { useEffect, useState } from "react";
import { Play, Disc, TrendingUp } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Mixtape } from "@/shared/types";

export default function Mixtapes() {
  const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/mixtape-hero.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <Disc className="w-20 h-20 text-neon-red mx-auto mb-6 animate-spin-slow" />
          <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text">
            MIXTAPE VAULT
          </h1>
          <p className="text-xl text-gray-400 font-heading">
            The soundtrack to every Thursday night. DJ sets, resident mixes, and throwback classics.
          </p>
        </div>
      </div>

      <div className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white font-heading text-xl">
              Loading mixtapes...
            </div>
          ) : mixtapes.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg">
                  Mixtapes dropping soon. Stay tuned for the freshest sets.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mixtapes.map((mixtape) => (
                <div
                  key={mixtape.id}
                  className="group neon-border bg-black/80 backdrop-blur-md overflow-hidden hover:neon-glow transition"
                >
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-neon-red/20 to-black">
                    {mixtape.cover_art_url ? (
                      <img
                        src={mixtape.cover_art_url}
                        alt={mixtape.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Disc className="w-24 h-24 text-neon-red opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-16 h-16 text-neon-red" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl text-white mb-2 group-hover:text-neon-red transition">
                      {mixtape.title}
                    </h3>
                    <p className="text-neon-red font-heading mb-3">DJ {mixtape.dj_name}</p>

                    {mixtape.description && (
                      <p className="text-gray-400 text-sm font-heading mb-4 line-clamp-3">
                        {mixtape.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      {mixtape.release_date && (
                        <span className="text-gray-500 font-heading">
                          {new Date(mixtape.release_date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <div className="flex items-center text-gray-500">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-heading">{mixtape.play_count} plays</span>
                      </div>
                    </div>

                    {mixtape.embed_url && (
                      <a
                        href={mixtape.embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block w-full px-4 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition text-center font-heading uppercase tracking-wider"
                      >
                        Listen Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
