import { useState } from "react";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { useCart } from "@/react-app/lib/CartContext";

export default function CartPanel() {
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const cart = useCart();

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          affiliateCode: cart.affiliateCode,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is not available yet.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout is not available yet.");
      setCheckingOut(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div className="neon-border bg-black/80 p-8">
        <h2 className="font-display text-5xl text-white mb-6">SHOPPING CART</h2>
        {cart.items.length === 0 ? (
          <p className="text-gray-400 font-heading">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.variantId} className="border border-neon-red/30 p-4 grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <h3 className="font-heading text-xl text-white">{item.name}</h3>
                  <p className="text-gray-400 font-heading text-sm">
                    {item.color} / {item.size} / ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-10 h-10 border border-neon-red/50 text-neon-red flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-white font-heading">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-10 h-10 border border-neon-red/50 text-neon-red flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => cart.removeItem(item.variantId)}
                    className="w-10 h-10 border border-white/20 text-gray-400 hover:text-neon-red flex items-center justify-center"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="neon-border bg-black/80 p-8 h-fit">
        <h2 className="font-display text-4xl text-white mb-5">ORDER SUMMARY</h2>
        <div className="space-y-3 border-b border-neon-red/30 pb-5 mb-5">
          <div className="flex justify-between text-gray-300 font-heading">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="flex justify-between text-white font-heading text-xl">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <p className="text-gray-500 font-heading text-sm">
            Taxes, shipping, and pickup options are finalized during checkout.
          </p>
        </div>

        <label className="block text-white font-heading mb-2">Affiliate / Promoter Code</label>
        <div className="flex mb-5">
          <span className="px-3 py-3 border border-r-0 border-neon-red/50 text-neon-red">
            <Tag className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={cart.affiliateCode || ""}
            onChange={(event) => cart.setAffiliateCode(event.target.value)}
            placeholder="DJ or promoter code"
            className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none placeholder-gray-600"
          />
        </div>

        {checkoutError && (
          <div className="p-4 bg-neon-red/20 border border-neon-red text-white font-heading mb-5">
            {checkoutError}
          </div>
        )}

        <button
          type="button"
          disabled={cart.items.length === 0 || checkingOut}
          onClick={handleCheckout}
          className="w-full px-6 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider disabled:opacity-50"
        >
          {checkingOut ? "Opening Checkout..." : "Secure Checkout"}
        </button>
      </aside>
    </div>
  );
}
