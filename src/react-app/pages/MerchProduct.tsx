import { useState } from "react";
import { Link, useParams } from "react-router";
import { Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/merch/ProductCard";
import CartPanel from "@/react-app/components/merch/CartPanel";
import { useCart } from "@/react-app/lib/CartContext";
import { getMerchProduct, merchProducts } from "@/react-app/lib/merchProducts";

export default function MerchProduct() {
  const { productId } = useParams();
  const product = getMerchProduct(productId || "");
  const cart = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");

  if (!product) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <Package className="w-16 h-16 text-neon-red mx-auto mb-6" />
          <h1 className="font-display text-6xl text-white mb-4">PRODUCT NOT FOUND</h1>
          <Link to="/merch" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
            Back To Store
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = merchProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to={`/merch/category/${product.category}`} className="text-neon-red font-heading uppercase tracking-wider hover:text-white transition">
            Store / {product.categoryLabel}
          </Link>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 mt-8">
            <div className={`neon-border bg-gradient-to-br ${product.imageClass} min-h-[560px] relative flex items-center justify-center overflow-hidden`}>
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-neon-red text-black font-heading uppercase tracking-wider text-xs">
                  {product.badge}
                </span>
              )}
              <Package className="w-40 h-40 text-white/80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <p className="font-heading text-white uppercase tracking-[0.3em]">This Is Hip Hop Caribbean</p>
              </div>
            </div>

            <div className="neon-border bg-black/80 p-8 md:p-10">
              <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">{product.categoryLabel}</p>
              <h1 className="font-display text-6xl md:text-8xl text-white mb-4">
                {product.name}
              </h1>
              <p className="text-3xl text-neon-red font-heading mb-6">${product.price.toFixed(2)}</p>
              <p className="text-xl text-gray-300 font-heading mb-8">
                {product.story}
              </p>

              <div className="mb-6">
                <p className="text-neon-red font-heading text-xs uppercase tracking-wider mb-3">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-3 border font-heading transition ${selectedColor === color
                        ? "border-neon-red bg-neon-red text-black"
                        : "border-white/20 text-gray-300 hover:border-neon-red"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-neon-red font-heading text-xs uppercase tracking-wider mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-12 px-4 border font-heading flex items-center justify-center transition ${selectedSize === size
                        ? "border-neon-red bg-neon-red text-black"
                        : "border-neon-red/50 text-white hover:border-neon-red"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => cart.addItem(product, selectedColor, selectedSize)}
                className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider mb-8"
              >
                Add To Cart
              </button>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-neon-red/30 p-4">
                  <Truck className="w-6 h-6 text-neon-red mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Made To Order</p>
                </div>
                <div className="border border-neon-red/30 p-4">
                  <ShieldCheck className="w-6 h-6 text-neon-red mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Secure Checkout</p>
                </div>
                <div className="border border-neon-red/30 p-4">
                  <RotateCcw className="w-6 h-6 text-neon-red mb-2" />
                  <p className="text-white font-heading text-sm uppercase">Drop Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-black to-neon-red/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl text-white mb-8">MORE IN {product.categoryLabel.toUpperCase()}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="cart" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <CartPanel />
        </div>
      </section>

      <Footer />
    </div>
  );
}
