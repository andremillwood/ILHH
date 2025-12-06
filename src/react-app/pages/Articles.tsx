import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, User, ExternalLink } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Article } from "@/shared/types";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
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

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text">
              CULTURE & FEATURES
            </h1>
            <p className="text-xl text-gray-400 font-heading">
              Hip Hop news, culture, and stories from around the world
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white font-heading text-xl">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg">
                  Articles coming soon. Check back for the latest in hip hop culture.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group neon-border bg-black/80 backdrop-blur-md overflow-hidden hover:neon-glow transition"
                >
                  {article.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="font-display text-2xl text-white mb-3 group-hover:text-neon-red transition">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-400 font-heading mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {article.author && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-heading">{article.author}</span>
                          </div>
                        )}
                        {article.published_at && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="font-heading">
                              {new Date(article.published_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-neon-red" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
