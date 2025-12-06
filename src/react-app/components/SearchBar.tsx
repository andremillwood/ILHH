import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Search, X, Calendar, FileText, Music, Loader2 } from 'lucide-react';

interface SearchResult {
    events: Array<{ id: number; title: string; theme: string; event_date: string }>;
    articles: Array<{ id: number; title: string; slug: string; excerpt: string }>;
    mixtapes: Array<{ id: number; title: string; dj_name: string }>;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const totalResults = results
        ? results.events.length + results.articles.length + results.mixtapes.length
        : 0;

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white hover:text-neon-red transition"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 md:w-96 neon-border bg-black/95 backdrop-blur-md z-50">
                    <div className="p-4">
                        <div className="flex items-center gap-2 border-b border-neon-red/30 pb-3">
                            <Search className="w-5 h-5 text-neon-red" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search events, articles, mixtapes..."
                                className="flex-1 bg-transparent text-white font-heading focus:outline-none placeholder-gray-500"
                                autoFocus
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto mt-4">
                            {loading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-neon-red animate-spin" />
                                </div>
                            )}

                            {!loading && query.length >= 2 && totalResults === 0 && (
                                <p className="text-gray-400 text-center py-8 font-heading">No results found</p>
                            )}

                            {!loading && results && totalResults > 0 && (
                                <div className="space-y-4">
                                    {results.events.length > 0 && (
                                        <div>
                                            <h4 className="text-neon-red font-heading text-sm uppercase mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Events
                                            </h4>
                                            {results.events.map((event) => (
                                                <Link
                                                    key={event.id}
                                                    to={`/events`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block p-2 hover:bg-neon-red/10 transition"
                                                >
                                                    <p className="text-white font-heading">{event.title}</p>
                                                    <p className="text-gray-400 text-sm">{event.theme}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {results.articles.length > 0 && (
                                        <div>
                                            <h4 className="text-neon-red font-heading text-sm uppercase mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4" /> Articles
                                            </h4>
                                            {results.articles.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    to={`/articles/${article.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block p-2 hover:bg-neon-red/10 transition"
                                                >
                                                    <p className="text-white font-heading">{article.title}</p>
                                                    <p className="text-gray-400 text-sm line-clamp-1">{article.excerpt}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {results.mixtapes.length > 0 && (
                                        <div>
                                            <h4 className="text-neon-red font-heading text-sm uppercase mb-2 flex items-center gap-2">
                                                <Music className="w-4 h-4" /> Mixtapes
                                            </h4>
                                            {results.mixtapes.map((mixtape) => (
                                                <Link
                                                    key={mixtape.id}
                                                    to={`/mixtapes`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block p-2 hover:bg-neon-red/10 transition"
                                                >
                                                    <p className="text-white font-heading">{mixtape.title}</p>
                                                    <p className="text-gray-400 text-sm">by {mixtape.dj_name}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
