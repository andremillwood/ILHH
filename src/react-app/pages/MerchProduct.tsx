import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Expand, Package, RotateCcw, ShieldCheck, Truck, X } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/merch/ProductCard";
import CartPanel from "@/react-app/components/merch/CartPanel";
import { useCart } from "@/react-app/lib/CartContext";
import { getMerchProduct } from "@/react-app/lib/merchProducts";
import { useMerchCatalog } from "@/react-app/lib/useMerchCatalog";

export default function MerchProduct() {
  const { productId } = useParams();
  const { products: merchProducts, loading } = useMerchCatalog();
  const product = merchProducts.find((item) => item.id === productId) || getMerchProduct(productId || "");
  const cart = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch("/api/public?resource=analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "merch_product_viewed",
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        properties: { productId: product.id, category: product.category, price: product.price },
      }),
    }).catch(() => undefined);
  }, [product?.id, product?.category, product?.price]);

  useEffect(() => {
    if (!lightboxOpen || !product) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setSelectedImageIndex((current) => (current - 1 + product.images.length) % product.images.length);
      if (event.key === "ArrowRight") setSelectedImageIndex((current) => (current + 1) % product.images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, product]);

  if (!product && loading) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <Package className="w-16 h-16 text-neon-red mx-auto mb-6" />
          <h1 className="font-display text-6xl text-white mb-4">LOADING PRODUCT</h1>
        </div>
      </div>
    );
  }

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
  const activeColor = selectedColor || product.colors[0];
  const activeSize = selectedSize || product.sizes[0];
  const colorImageIndex = product.images.findIndex((image) => image.color === activeColor);
  const safeImageIndex = product.images[selectedImageIndex] ? selectedImageIndex : Math.max(colorImageIndex, 0);
  const selectedImage = product.images[safeImageIndex] || product.images[0];
  const selectedVariant = product.variants.find((variant) => variant.color === activeColor && variant.size === activeSize);
  const isUnavailable = !selectedVariant || ["out_of_stock", "temporary_out_of_stock", "discontinued"].includes(selectedVariant.availabilityStatus || "");
  const showPreviousImage = () => setSelectedImageIndex((current) => (current - 1 + product.images.length) % product.images.length);
  const showNextImage = () => setSelectedImageIndex((current) => (current + 1) % product.images.length);

  const selectColor = (color: string) => {
    setSelectedColor(color);
    const index = product.images.findIndex((image) => image.color === color);
    if (index >= 0) setSelectedImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to={`/merch/category/${product.category}`} className="text-neon-red font-heading uppercase tracking-wider hover:text-white transition">
            Store / {product.categoryLabel}
          </Link>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 mt-8">
            <div>
              <div className={`neon-border bg-gradient-to-br ${product.imageClass} min-h-[560px] relative flex items-center justify-center overflow-hidden`}>
                {product.badge && (
                  <span className="absolute top-6 left-6 z-10 px-4 py-2 bg-neon-red text-black font-heading uppercase tracking-wider text-xs">
                    {product.badge}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-6 right-6 z-10 h-11 w-11 border border-white/30 bg-black/70 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center"
                  aria-label="Open product image viewer"
                >
                  <Expand className="w-5 h-5" />
                </button>
                {product.images.length > 1 && (
                  <>
                    <button type="button" onClick={showPreviousImage} className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 border border-white/30 bg-black/70 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center" aria-label="Previous product mockup">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button type="button" onClick={showNextImage} className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 border border-white/30 bg-black/70 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center" aria-label="Next product mockup">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setLightboxOpen(true)} className="absolute inset-0">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent pointer-events-none">
                  <p className="font-heading text-white uppercase tracking-[0.3em]">This Is Hip Hop Caribbean</p>
                  <p className="text-neon-red font-heading text-sm uppercase mt-1">{selectedImage.color} mockup</p>
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={`${image.color}-${image.url}`}
                      type="button"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setSelectedColor(image.color);
                      }}
                      className={`aspect-square overflow-hidden border bg-black ${safeImageIndex === index ? "border-neon-red" : "border-white/15 hover:border-neon-red/70"}`}
                    >
                      <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs font-heading uppercase text-gray-400">
                <span>{safeImageIndex + 1} / {product.images.length}</span>
                <button type="button" onClick={() => setLightboxOpen(true)} className="text-neon-red hover:text-white">View mockups</button>
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
                      onClick={() => selectColor(color)}
                      className={`px-4 py-3 border font-heading transition ${activeColor === color
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
                      className={`min-w-12 h-12 px-4 border font-heading flex items-center justify-center transition ${activeSize === size
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
                onClick={() => {
                  if (!isUnavailable) cart.addItem(product, activeColor, activeSize);
                }}
                disabled={isUnavailable}
                className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider mb-8 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUnavailable ? "Unavailable" : "Add To Cart"}
              </button>

              <div className="mb-8 border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-heading text-neon-red uppercase tracking-wider mb-3">Size, Stock & Shipping</h2>
                <div className="grid gap-3 text-gray-300 font-heading text-sm leading-relaxed">
                  <p>Selected: {activeColor} / {activeSize}. {isUnavailable ? "This option is not currently available." : "This option is available for checkout."}</p>
                  <p>Production is made to order after payment. Expect fulfillment to begin before carrier shipping; exact delivery timing depends on destination, carrier, customs, and stock status.</p>
                  <p>Use your usual size for a standard fit. For a roomier streetwear fit, size up where available. Hats are one size unless the product options show otherwise.</p>
                </div>
              </div>

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

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 p-4 md:p-8 flex items-center justify-center">
          <button type="button" onClick={() => setLightboxOpen(false)} className="absolute right-5 top-5 h-12 w-12 border border-white/30 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center" aria-label="Close product image viewer">
            <X className="w-6 h-6" />
          </button>
          {product.images.length > 1 && (
            <>
              <button type="button" onClick={showPreviousImage} className="absolute left-5 top-1/2 h-14 w-14 -translate-y-1/2 border border-white/30 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center" aria-label="Previous product mockup">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button type="button" onClick={showNextImage} className="absolute right-5 top-1/2 h-14 w-14 -translate-y-1/2 border border-white/30 text-white hover:border-neon-red hover:text-neon-red flex items-center justify-center" aria-label="Next product mockup">
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <div className="max-w-6xl w-full">
            <img src={selectedImage.url} alt={selectedImage.alt} className="max-h-[78vh] w-full object-contain" />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-heading text-white uppercase tracking-[0.25em]">{product.name}</p>
                <p className="text-neon-red font-heading">{selectedImage.color} / {safeImageIndex + 1} of {product.images.length}</p>
              </div>
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={`lightbox-${image.color}-${image.url}`}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setSelectedColor(image.color);
                    }}
                    className={`h-14 w-14 overflow-hidden border ${safeImageIndex === index ? "border-neon-red" : "border-white/20"}`}
                    aria-label={`View ${image.color} mockup`}
                  >
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
