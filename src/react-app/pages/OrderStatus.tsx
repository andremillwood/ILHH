import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Package, Truck } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

type OrderStatus = {
  public_id: string;
  total_cents: number;
  currency: string;
  status_v2: string;
  fulfillment_status: string;
  tracking_number?: string;
  tracking_url?: string;
  carrier?: string;
  created_at: string;
  paid_at?: string;
  submitted_to_printful_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  merch_order_items?: Array<{ product_name: string; color?: string; size?: string; quantity: number }>;
};

const steps = ["pending_payment", "paid", "submitted_to_printful", "in_fulfillment", "shipped", "delivered"];

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/public?resource=order-status&id=${encodeURIComponent(orderId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Order not found");
        setOrder(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Order not found"));
  }, [orderId]);

  const activeIndex = order ? Math.max(0, steps.indexOf(order.status_v2)) : 0;

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/merch" className="text-neon-red font-heading uppercase tracking-wider hover:text-white transition">
            Store / Order Status
          </Link>

          <section className="mt-8 border-t-8 border-neon-red bg-[#e9e4da] p-8 text-black md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <Package className="w-12 h-12 text-neon-red" />
              <div>
                <h1 className="font-display text-5xl uppercase text-black md:text-7xl">ORDER STATUS</h1>
                <p className="font-heading text-black/60">{order?.public_id || orderId}</p>
              </div>
            </div>

            {error && <div className="border border-neon-red bg-neon-red/20 p-5 text-white font-heading">{error}</div>}

            {order && (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="border border-neon-red/30 p-4">
                    <p className="text-neon-red font-heading text-xs uppercase tracking-wider">Payment</p>
                    <p className="font-heading text-xl font-bold text-black">{order.status_v2.replace(/_/g, " ")}</p>
                  </div>
                  <div className="border border-neon-red/30 p-4">
                    <p className="text-neon-red font-heading text-xs uppercase tracking-wider">Fulfillment</p>
                    <p className="font-heading text-xl font-bold text-black">{order.fulfillment_status.replace(/_/g, " ")}</p>
                  </div>
                  <div className="border border-neon-red/30 p-4">
                    <p className="text-neon-red font-heading text-xs uppercase tracking-wider">Total</p>
                    <p className="font-heading text-xl font-bold text-black">{order.currency.toUpperCase()} {(order.total_cents / 100).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-6 gap-2 mb-8">
                  {steps.map((step, index) => (
                    <div key={step} className={`border p-3 ${index <= activeIndex ? "border-neon-red bg-neon-red text-black" : "border-white/20 text-gray-400"}`}>
                      <CheckCircle2 className="w-5 h-5 mb-2" />
                      <p className="font-heading text-xs uppercase">{step.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-neon-red/30 p-5 mb-8">
                  <h2 className="mb-4 font-display text-3xl uppercase text-black">Items</h2>
                  <div className="space-y-3">
                    {order.merch_order_items?.map((item, index) => (
                      <div key={index} className="flex justify-between gap-4 font-heading text-black/70">
                        <span>{item.product_name} / {item.color} / {item.size}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.tracking_url && (
                  <a href={order.tracking_url} className="inline-flex items-center gap-2 px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
                    <Truck className="w-5 h-5" /> Track Package
                  </a>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
