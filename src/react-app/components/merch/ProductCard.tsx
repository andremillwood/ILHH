import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/react-app/lib/CartContext";
import type { MerchProduct } from "@/react-app/lib/merchProducts";

export default function ProductCard({ product }: { product: MerchProduct }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const selectedImage = product.images.find((image) => image.color === selectedColor) || product.images[0];

  return (
    <article className="neon-border bg-black/80 backdrop-blur-md overflow-hidden hover:neon-glow transition">
      <Link to={`/merch/product/${product.id}`} className={`aspect-square bg-gradient-to-br ${product.imageClass} relative flex items-center justify-center group overflow-hidden`}>
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-neon-red text-black font-heading uppercase tracking-wider text-xs">
            {product.badge}
          </span>
        )}
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <Link to={`/merch/category/${product.category}`} className="text-neon-red font-heading text-xs uppercase tracking-wider hover:text-white transition">
              {product.categoryLabel}
            </Link>
            <Link to={`/merch/product/${product.id}`}>
              <h3 className="font-display text-3xl text-white hover:text-neon-red transition">{product.name}</h3>
            </Link>
          </div>
          <p className="text-neon-red font-heading text-sm whitespace-nowrap">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <p className="text-gray-400 font-heading mb-5">{product.description}</p>
        <div className="mb-4">
          <p className="text-neon-red font-heading text-xs uppercase tracking-wider mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-2 border font-heading text-sm transition ${selectedColor === color
                  ? "border-neon-red bg-neon-red text-black"
                  : "border-white/20 text-gray-300 hover:border-neon-red"
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-neon-red font-heading text-xs uppercase tracking-wider mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-10 h-10 px-3 border font-heading text-sm flex items-center justify-center transition ${selectedSize === size
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
          onClick={() => addItem(product, selectedColor, selectedSize)}
          className="w-full px-6 py-3 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
        >
          Add To Cart
        </button>
      </div>
    </article>
  );
}
