import { useEffect, useState } from "react";
import { Music, Heart, Quote, User } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import type { Member } from "@/shared/types";

export default function Community() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members?action=community")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
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
              THE COMMUNITY
            </h1>
            <p className="text-xl text-gray-400 font-heading mb-8">
              Connect with fellow hip hop lovers and share your musical identity
            </p>
          </div>

          {/* Trending Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="neon-border bg-black/80 backdrop-blur-md p-8">
              <Music className="w-10 h-10 text-neon-red mb-4 mx-auto" />
              <h3 className="font-heading text-xl text-white text-center mb-3">
                Trending Songs
              </h3>
              <div className="space-y-2 text-center">
                <p className="text-gray-400 text-sm font-heading">
                  Share your favorites to see community trends
                </p>
              </div>
            </div>
            <div className="neon-border bg-black/80 backdrop-blur-md p-8">
              <Heart className="w-10 h-10 text-neon-red mb-4 mx-auto" />
              <h3 className="font-heading text-xl text-white text-center mb-3">
                Top Albums
              </h3>
              <div className="space-y-2 text-center">
                <p className="text-gray-400 text-sm font-heading">
                  Discover what the community is listening to
                </p>
              </div>
            </div>
            <div className="neon-border bg-black/80 backdrop-blur-md p-8">
              <Quote className="w-10 h-10 text-neon-red mb-4 mx-auto" />
              <h3 className="font-heading text-xl text-white text-center mb-3">
                Favorite Lyrics
              </h3>
              <div className="space-y-2 text-center">
                <p className="text-gray-400 text-sm font-heading">
                  The bars that define us
                </p>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="text-center text-white font-heading text-xl">
              Loading community...
            </div>
          ) : members.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg mb-6">
                  Be the first to join the I Luv Hip Hop community
                </p>
                <a
                  href="/membership"
                  className="px-8 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider inline-block"
                >
                  Join Now
                </a>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="neon-border bg-black/80 backdrop-blur-md p-6 hover:neon-glow transition"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-red to-black flex items-center justify-center">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={`${member.first_name} ${member.last_name}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl text-white">
                        {member.first_name} {member.last_name}
                      </h3>
                      {member.instagram_handle && (
                        <p className="text-neon-red text-sm">@{member.instagram_handle}</p>
                      )}
                      {member.location && (
                        <p className="text-gray-500 text-sm">{member.location}</p>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-gray-400 text-sm mb-4 font-heading">{member.bio}</p>
                  )}

                  {member.favorite_songs && (
                    <div className="mb-3">
                      <p className="text-neon-red text-xs font-heading uppercase mb-1">
                        Favorite Songs
                      </p>
                      <p className="text-white text-sm font-heading">{member.favorite_songs}</p>
                    </div>
                  )}

                  {member.favorite_albums && (
                    <div className="mb-3">
                      <p className="text-neon-red text-xs font-heading uppercase mb-1">
                        Favorite Albums
                      </p>
                      <p className="text-white text-sm font-heading">{member.favorite_albums}</p>
                    </div>
                  )}

                  {member.favorite_lyrics && (
                    <div className="border-l-2 border-neon-red/50 pl-3">
                      <p className="text-gray-300 text-sm italic font-heading">
                        "{member.favorite_lyrics}"
                      </p>
                    </div>
                  )}
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
