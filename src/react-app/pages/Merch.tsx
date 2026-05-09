import { Link } from "react-router";
import { Crown, Shirt, Star, Truck } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/merch/ProductCard";
import CartPanel from "@/react-app/components/merch/CartPanel";
import { useCart } from "@/react-app/lib/CartContext";
import { merchCategories, merchProducts } from "@/react-app/lib/merchProducts";

export default function Merch() {
  const cart = useCart();
  const featuredProduct = merchProducts[0];

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="relative min-h-[92vh] pt-28 px-4 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,23,68,0.28),transparent_32%),radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Official Store</p>
            <h1 className="font-display text-6xl md:text-9xl mb-6 neon-text-simple animate-glow-pulse">
              WEAR THE MOVEMENT
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-heading mb-8 max-w-3xl">
              The This Is Hip Hop Caribbean store connects event culture, streetwear, DJs, promoters, members, and affiliate drops in one ecommerce experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#products" className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider text-center">
                Shop The Drop
              </a>
              <a href="#cart" className="px-8 py-4 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading text-xl uppercase tracking-wider text-center">
                Cart ({cart.itemCount})
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
              {merchCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/merch/category/${category.id}`}
                  className="border border-neon-red/40 bg-black/70 p-4 hover:bg-neon-red hover:text-black transition group"
                >
                  <p className="text-white group-hover:text-black font-heading uppercase tracking-wider">{category.label}</p>
                  <p className="text-gray-500 group-hover:text-black/70 font-heading text-xs mt-1">View category</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="neon-border bg-black/80 p-6 md:p-8 rotate-1">
              <div className={`aspect-[4/5] bg-gradient-to-br ${featuredProduct.imageClass} relative flex items-center justify-center mb-6 overflow-hidden`}>
                <div className="absolute top-6 left-6 px-4 py-2 bg-neon-red text-black font-heading uppercase tracking-wider text-xs">
                  Featured Drop
                </div>
                <img
                  src={featuredProduct.images[0].url}
                  alt={featuredProduct.images[0].alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="font-display text-4xl text-white">{featuredProduct.name}</p>
                  <p className="text-neon-red font-heading">${featuredProduct.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-neon-red/40 p-4">
                  <Shirt className="w-7 h-7 text-neon-red mx-auto mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Apparel</p>
                </div>
                <div className="border border-neon-red/40 p-4">
                  <Crown className="w-7 h-7 text-neon-red mx-auto mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Headwear</p>
                </div>
                <div className="border border-neon-red/40 p-4">
                  <Star className="w-7 h-7 text-neon-red mx-auto mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Limited</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 px-4 bg-gradient-to-b from-black to-neon-red/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display text-5xl md:text-7xl text-white mb-3">FEATURED MERCH</h2>
              <p className="text-gray-400 font-heading text-lg">
                Shop across the full drop or move into a dedicated category page for a tighter product experience.
              </p>
            </div>
            <Link to="/merch/category/sweatshirts" className="px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider text-center">
              Shop Sweatshirts
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="cart" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <CartPanel />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto neon-border bg-black/80 p-8 md:p-12">
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
            <Truck className="w-14 h-14 text-neon-red" />
            <div>
              <h2 className="font-display text-4xl text-white mb-2">SECURE CHECKOUT & FRESH DROPS</h2>
              <p className="text-gray-300 font-heading">
                Shop official This Is Hip Hop Caribbean merch, get first notice on new releases, and choose shipping or pickup options when checkout opens.
              </p>
            </div>
            <Link to="/membership" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider text-center">
              Get Drop Alerts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
