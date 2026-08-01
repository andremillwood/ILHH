import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

type Policy = {
  slug: string;
  title: string;
  body: string;
  updated_at?: string;
};

type PolicyPageProps = {
  fixedSlug?: string;
};

export default function PolicyPage({ fixedSlug }: PolicyPageProps) {
  const { policySlug } = useParams();
  const activeSlug = fixedSlug || policySlug || "terms";
  const [policy, setPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    setPolicy(null);
    fetch(`/api/public?resource=policies&slug=${encodeURIComponent(activeSlug)}`)
      .then((response) => response.json())
      .then(setPolicy)
      .catch(() => setPolicy(null));
  }, [activeSlug]);

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-neon-red font-heading uppercase tracking-wider hover:text-white transition">
            This Is Hip Hop Caribbean / Policy
          </Link>
          <section className="neon-border bg-black/80 p-8 md:p-12 mt-8">
            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">{policy?.title || "Policy"}</h1>
            <p className="text-gray-300 font-heading text-lg leading-relaxed whitespace-pre-line">
              {policy?.body || "This policy is being updated."}
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link to="/terms" className="px-5 py-3 border border-neon-red/50 text-neon-red font-heading uppercase">Terms</Link>
              <Link to="/privacy" className="px-5 py-3 border border-neon-red/50 text-neon-red font-heading uppercase">Privacy</Link>
              <Link to="/policy/refunds" className="px-5 py-3 border border-neon-red/50 text-neon-red font-heading uppercase">Refunds</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
