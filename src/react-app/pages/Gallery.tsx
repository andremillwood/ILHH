import { useEffect, useState } from "react";
import { Camera, Instagram, ExternalLink, X } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

interface Gallery {
  id: number;
  partner_name: string;
  partner_logo_url: string | null;
  partner_instagram: string | null;
  gallery_url: string | null;
  description: string | null;
  featured_image_url: string | null;
  is_featured: number;
}

export default function Gallery() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; partner: string } | null>(null);

  useEffect(() => {
    fetch("/api/galleries")
      .then((res) => res.json())
      .then((data) => {
        setGalleries(data);
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
            <Camera className="w-16 h-16 text-neon-red mx-auto mb-6" />
            <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text">
              PHOTO GALLERY
            </h1>
            <p className="text-xl text-gray-400 font-heading">
              Captured moments from the scene. Our photographer partners bring the energy to life.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white font-heading text-xl">
              Loading galleries...
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center">
              <div className="neon-border bg-black/80 backdrop-blur-md p-12 inline-block">
                <p className="text-gray-400 font-heading text-lg mb-4">
                  Photo galleries coming soon
                </p>
                <p className="text-gray-500 text-sm font-heading">
                  Check back after the next event for fresh shots
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="group neon-border bg-black/80 backdrop-blur-md overflow-hidden hover:neon-glow transition"
                >
                  <div 
                    className="aspect-video relative overflow-hidden bg-gradient-to-br from-neon-red/20 to-black cursor-pointer"
                    onClick={() => gallery.featured_image_url && setSelectedImage({ url: gallery.featured_image_url, partner: gallery.partner_name })}
                  >
                    {gallery.featured_image_url ? (
                      <img
                        src={gallery.featured_image_url}
                        alt={gallery.partner_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-16 h-16 text-neon-red opacity-50" />
                      </div>
                    )}
                    {gallery.featured_image_url && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-12 h-12 text-neon-red" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading text-xl text-white">
                        {gallery.partner_name}
                      </h3>
                      {gallery.partner_instagram && (
                        <a
                          href={`https://instagram.com/${gallery.partner_instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-red hover:text-white transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {gallery.description && (
                      <p className="text-gray-400 text-sm font-heading mb-4">
                        {gallery.description}
                      </p>
                    )}

                    {gallery.gallery_url && (
                      <a
                        href={gallery.gallery_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition text-center font-heading uppercase tracking-wider"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Gallery
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white hover:text-neon-red transition"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-10 h-10" />
          </button>
          <div className="max-w-6xl w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.partner}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <p className="text-white font-heading text-center mt-4 text-xl">
              {selectedImage.partner}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
