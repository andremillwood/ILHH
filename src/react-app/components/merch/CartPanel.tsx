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
      <div className="border border-white/20 bg-black p-8">
        <h2 className="font-display text-5xl text-white mb-6">SHOPPING CART</h2>
        {cart.items.length === 0 ? (
          <p className="text-gray-400 font-heading">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.variantId} className="grid gap-4 border-b border-white/20 py-5 md:grid-cols-[1fr_auto]">
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

      <aside className="h-fit bg-[#e9e4da] p-8 text-black lg:sticky lg:top-28">
        <h2 className="mb-5 font-display text-4xl uppercase text-black">ORDER SUMMARY</h2>
        <div className="space-y-3 border-b border-neon-red/30 pb-5 mb-5">
          <div className="flex justify-between font-heading text-black/70">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="flex justify-between font-heading text-xl font-bold text-black">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <p className="font-body text-sm leading-6 text-black/60">
            Taxes, shipping, and pickup options are finalized during checkout.
          </p>
        </div>

        <label className="mb-2 block font-heading font-bold uppercase text-black">Affiliate / Promoter Code</label>
        <div className="flex mb-5">
          <span className="px-3 py-3 border border-r-0 border-neon-red/50 text-neon-red">
            <Tag className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={cart.affiliateCode || ""}
            onChange={(event) => cart.setAffiliateCode(event.target.value)}
            placeholder="DJ or promoter code"
            className="w-full border border-black/30 bg-white px-4 py-3 font-heading text-black placeholder-black/40 focus:border-neon-red focus:outline-none"
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
          className="w-full bg-neon-red px-6 py-4 font-heading text-lg font-bold uppercase tracking-wider text-black transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          {checkingOut ? "Opening Checkout..." : "Secure Checkout"}
        </button>
      </aside>
    </div>
  );
}
