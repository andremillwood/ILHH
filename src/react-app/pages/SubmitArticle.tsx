import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FileText, Loader2, Send } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";

export default function SubmitArticle() {
  const { user, loading: authLoading } = useAuth();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    submission_type: "article",
    title: "",
    excerpt: "",
    body: "",
    category: "Scene report",
    featured_image_url: "",
    tags: "",
    contributor_name: "",
    contributor_email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/membership");
  }, [authLoading, user, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeader) return;
    setSubmitting(true);
    setMessage("");
    const res = await fetch("/api/members?action=content_submission", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(form),
    }).catch(() => null);
    setSubmitting(false);
    if (res?.ok) {
      setMessage("Submission received. The editorial team will review it before publishing.");
      setForm({ ...form, title: "", excerpt: "", body: "", featured_image_url: "", tags: "" });
    } else {
      setMessage("Submission failed. Check the required fields and try again.");
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-neon-red animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <FileText className="w-14 h-14 text-neon-red mx-auto mb-4" />
            <h1 className="font-display text-6xl md:text-8xl neon-text-simple">SUBMIT CULTURE</h1>
            <p className="text-gray-300 font-heading text-xl mt-4">Pitch or submit articles, interviews, event recaps, reviews, and scene reports for editorial review.</p>
          </div>
          <form onSubmit={submit} className="neon-border bg-black/80 p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <select value={form.submission_type} onChange={(e) => setForm({ ...form, submission_type: e.target.value })} className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none">
                <option value="article">Full Article</option>
                <option value="pitch">Pitch</option>
                <option value="review">Review</option>
                <option value="scene_report">Scene Report</option>
                <option value="interview">Interview</option>
                <option value="photo_essay">Photo Essay</option>
              </select>
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            </div>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title *" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short excerpt or pitch summary" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={10} placeholder="Submission body *" className="w-full p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            <div className="grid md:grid-cols-2 gap-4">
              <input required value={form.contributor_name} onChange={(e) => setForm({ ...form, contributor_name: e.target.value })} placeholder="Contributor name *" className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
              <input required type="email" value={form.contributor_email} onChange={(e) => setForm({ ...form, contributor_email: e.target.value })} placeholder="Contributor email *" className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.featured_image_url} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} placeholder="Featured image URL" className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags, comma separated" className="p-3 bg-black border border-neon-red/50 text-white font-heading outline-none placeholder-gray-600" />
            </div>
            {message && <p className="text-gray-300 font-heading text-center">{message}</p>}
            <button disabled={submitting} className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red font-heading uppercase flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> {submitting ? "Submitting..." : "Submit For Review"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
