import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/react-app/lib/CartContext";
import type { MerchProduct } from "@/react-app/lib/merchProducts";
import { normalizeImageUrl } from "@/react-app/lib/imageUrls";

export default function ProductCard({ product }: { product: MerchProduct }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [failedImageUrls, setFailedImageUrls] = useState<string[]>([]);
  const selectedImage = product.images.find((image) => image.color === selectedColor) || product.images[0];
  const imageUrl = normalizeImageUrl(selectedImage?.url);
  const imageFailed = !imageUrl || failedImageUrls.includes(imageUrl);

  return (
    <article className="group overflow-hidden border border-white/20 bg-[#e9e4da] text-black transition hover:-translate-y-1">
      <Link to={`/merch/product/${product.id}`} className={`aspect-square bg-gradient-to-br ${product.imageClass} relative flex items-center justify-center group overflow-hidden`}>
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 bg-neon-red px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-black">
            {product.badge}
          </span>
        )}
        {!imageFailed ? (
          <img
            src={imageUrl}
            alt={selectedImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setFailedImageUrls((urls) => Array.from(new Set([...urls, imageUrl])))}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8 text-center font-heading text-xl uppercase tracking-wider text-white/80">
            This Is Hip Hop Caribbean
          </div>
        )}
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <Link to={`/merch/category/${product.category}`} className="font-heading text-xs font-bold uppercase tracking-wider text-[#8f0710] transition hover:text-black">
              {product.categoryLabel}
            </Link>
            <Link to={`/merch/product/${product.id}`}>
              <h3 className="font-display text-3xl uppercase text-black transition hover:text-[#8f0710]">{product.name}</h3>
            </Link>
          </div>
          <p className="whitespace-nowrap font-heading text-xl font-bold text-black">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <p className="mb-5 font-body text-sm leading-6 text-black/70">{product.description}</p>
        <div className="mb-4">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-black">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-2 border font-heading text-sm transition ${selectedColor === color
                  ? "border-neon-red bg-neon-red text-black"
                  : "border-black/30 text-black hover:border-neon-red"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-black">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-10 h-10 px-3 border font-heading text-sm flex items-center justify-center transition ${selectedSize === size
                  ? "border-neon-red bg-neon-red text-black"
                  : "border-black/30 text-black hover:border-neon-red"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => addItem(product, selectedColor, selectedSize)}
          className="w-full bg-black px-6 py-3 font-heading font-bold uppercase tracking-wider text-white transition hover:bg-neon-red hover:text-black"
        >
          Add To Cart
        </button>
      </div>
    </article>
  );
}
