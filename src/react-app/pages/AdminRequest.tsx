import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

const permissionOptions = [
  { id: "events", label: "Events" },
  { id: "rsvps", label: "RSVPs" },
  { id: "galleries", label: "Galleries" },
  { id: "mixtapes", label: "Mixtapes" },
  { id: "members", label: "Members" },
  { id: "orders", label: "Orders" },
  { id: "content", label: "Content" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

export default function AdminRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    requestedPermissions: ["events", "rsvps"],
    reason: "",
  });

  const togglePermission = (permission: string) => {
    setForm((current) => ({
      ...current,
      requestedPermissions: current.requestedPermissions.includes(permission)
        ? current.requestedPermissions.filter((item) => item !== permission)
        : [...current.requestedPermissions, permission],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/public?resource=admin_access_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestedRole: "admin" }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not submit request");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 border-b-8 border-neon-red pb-8">
            <span className="press-label mb-5">Platform operations</span>
            <h1 className="font-display text-6xl uppercase leading-none text-white md:text-8xl">Request Admin Access</h1>
            <p className="mt-5 max-w-3xl font-heading text-lg leading-8 text-gray-300">
              Use this form when someone needs access to manage events, RSVPs, galleries, merch orders, content, or community operations.
            </p>
          </div>

          {submitted ? (
            <section className="border border-neon-red bg-black/80 p-8 text-center shadow-[12px_12px_0_rgba(255,0,0,0.22)]">
              <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-neon-red" />
              <h2 className="font-display text-5xl uppercase text-white">Request Sent</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-300 font-heading">
                A superadmin will review the request. If approved, the requester should sign in or complete membership with the same email address.
              </p>
              <Link to="/" className="press-button mt-8 inline-block">Back To Site</Link>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6 border border-white/15 bg-black/85 p-6 shadow-[12px_12px_0_rgba(255,0,0,0.2)] md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
                <Input label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
                <Input label="Phone / WhatsApp" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
                <Input label="Role / Organization" value={form.organization} onChange={(value) => setForm({ ...form, organization: value })} placeholder="Dulce, photographer, event ops, merch, etc." />
              </div>

              <section>
                <p className="mb-3 flex items-center gap-2 font-heading text-sm uppercase tracking-[0.25em] text-neon-red">
                  <ShieldCheck className="h-4 w-4" />
                  Requested Permissions
                </p>
                <div className="flex flex-wrap gap-2">
                  {permissionOptions.map((permission) => (
                    <button
                      key={permission.id}
                      type="button"
                      onClick={() => togglePermission(permission.id)}
                      className={`border px-4 py-3 font-heading text-sm uppercase transition ${form.requestedPermissions.includes(permission.id) ? "border-neon-red bg-neon-red text-black" : "border-white/20 text-white hover:border-neon-red"}`}
                    >
                      {permission.label}
                    </button>
                  ))}
                </div>
              </section>

              <label className="block">
                <span className="mb-2 block font-heading text-sm uppercase tracking-widest text-neon-red">Why do they need access?</span>
                <textarea
                  value={form.reason}
                  onChange={(event) => setForm({ ...form, reason: event.target.value })}
                  rows={5}
                  required
                  className="w-full border border-gray-800 bg-black p-3 font-heading text-white outline-none focus:border-neon-red"
                  placeholder="Tell us what this person needs to manage and who approved the request operationally."
                />
              </label>

              {error && <p className="border border-red-500 bg-red-500/10 p-3 font-heading text-white">{error}</p>}

              <button type="submit" disabled={saving} className="press-button flex items-center justify-center disabled:opacity-50">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Admin Request"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-heading text-sm uppercase tracking-widest text-neon-red">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-800 bg-black p-3 font-heading text-white outline-none focus:border-neon-red"
      />
    </label>
  );
}
