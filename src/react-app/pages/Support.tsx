import { useState } from "react";
import { LifeBuoy, Loader2, Send } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

export default function Support() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    requestType: "general",
    orderPublicId: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    const response = await fetch("/api/public?resource=support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(response.ok ? "sent" : "error");
    if (response.ok) {
      setForm({ requestType: "general", orderPublicId: "", name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <LifeBuoy className="w-12 h-12 text-neon-red" />
            <div>
              <p className="font-heading text-neon-red uppercase tracking-[0.35em]">Support</p>
              <h1 className="font-display text-6xl md:text-8xl text-white">CONTACT</h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
            <aside className="neon-border bg-black/70 p-6">
              <h2 className="font-display text-4xl text-white mb-4">HOW WE HANDLE IT</h2>
              <div className="space-y-5 text-gray-300 font-heading leading-relaxed">
                <p>Email: <a className="text-neon-red hover:text-white" href="mailto:support@ilovehiphopja.com">support@ilovehiphopja.com</a></p>
                <p>For order issues, include the order ID from your receipt or status page.</p>
                <p>For refunds or replacements, include photos and a clear description of the damaged, incorrect, or missing item.</p>
              </div>
            </aside>

            <form onSubmit={submit} className="neon-border bg-black/80 p-6 md:p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <select value={form.requestType} onChange={(e) => setForm({ ...form, requestType: e.target.value })} className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none">
                  <option value="general">General support</option>
                  <option value="order_issue">Order issue</option>
                  <option value="refund_replacement">Refund / replacement</option>
                </select>
                <input value={form.orderPublicId} onChange={(e) => setForm({ ...form, orderPublicId: e.target.value })} placeholder="Order ID, if applicable" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
              </div>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none" />
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what happened" rows={7} className="w-full p-3 bg-black border border-gray-800 text-white font-heading focus:border-neon-red outline-none resize-none" />
              {status === "sent" && <p className="text-green-400 font-heading">Support request sent.</p>}
              {status === "error" && <p className="text-neon-red font-heading">Could not send support request. Email support@ilovehiphopja.com.</p>}
              <button type="submit" disabled={status === "sending"} className="w-full flex items-center justify-center gap-2 px-6 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider disabled:opacity-50">
                {status === "sending" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send Request
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
