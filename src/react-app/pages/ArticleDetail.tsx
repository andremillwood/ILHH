import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import EngagementBar from "@/react-app/components/EngagementBar";
import type { Article } from "@/shared/types";

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/articles/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Article not found");
          return res.json();
        })
        .then((data) => {
          setArticle(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <h1 className="font-display text-4xl text-white mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate("/articles")}
            className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/articles")}
            className="flex items-center text-neon-red hover:text-white transition font-heading mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </button>

          <article className="neon-border bg-black/80 backdrop-blur-md p-8 md:p-12">
            {article.featured_image_url && (
              <div className="aspect-video overflow-hidden mb-8 -mx-8 -mt-8 md:-mx-12 md:-mt-12">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-6">
              {article.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-neon-red/20 border border-neon-red text-neon-red text-xs font-heading uppercase tracking-wider"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-300 font-heading mb-6">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center space-x-6 text-gray-400">
                {article.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-heading">{article.author}</span>
                  </div>
                )}
                {article.published_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-heading">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <EngagementBar targetType="article" targetId={article.id} modes={["like", "save"]} />
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div
                className="text-gray-300 font-heading leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/articles")}
              className="px-8 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
            >
              Read More Articles
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
