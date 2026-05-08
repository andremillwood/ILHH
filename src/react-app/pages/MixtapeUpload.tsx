import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Upload } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/react-app/lib/platform";

export default function MixtapeUpload() {
  const { user, loading, signInWithGoogle } = useAuth();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    dj_name: "",
    description: "",
    genre: "",
    tags: "",
    cover_art_url: "",
    is_downloadable: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!audioFile || !authHeader || !user) return;

    setSubmitting(true);
    setError("");
    setProgressText("Uploading audio...");

    try {
      const slug = `${slugify(formData.title)}-${Date.now()}`;
      const fileExt = audioFile.name.split(".").pop() || "mp3";
      const filePath = `${user.id}/${slug}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("mixes")
        .upload(filePath, audioFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: audioFile.type || "audio/mpeg",
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("mixes").getPublicUrl(filePath);
      setProgressText("Saving mix details...");

      const response = await fetch("/api/mixtapes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          ...formData,
          slug,
          audio_url: publicUrl,
          download_url: publicUrl,
          release_date: new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save mix");

      setProgressText("Mix uploaded for review.");
      navigate(`/mixtapes/${data.slug || data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setSubmitting(false);
      setProgressText("");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-heading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-3xl mx-auto neon-border bg-black/80 p-12">
            <Upload className="w-16 h-16 text-neon-red mx-auto mb-6" />
            <h1 className="font-display text-6xl text-white mb-4">UPLOAD MIXES</h1>
            <p className="text-gray-300 font-heading mb-8">Sign in to upload DJ sets, event recordings, and mixes to the platform.</p>
            <button onClick={() => signInWithGoogle()} className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
              Sign In To Upload
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-neon-red font-heading uppercase tracking-[0.35em] mb-4">Creator Upload</p>
          <h1 className="font-display text-7xl md:text-9xl neon-text-simple mb-6">UPLOAD A MIX</h1>
          <p className="text-xl text-gray-300 font-heading max-w-3xl mx-auto">
            Upload audio directly to This Is Hip Hop Caribbean for streaming, downloads, discovery, and future playlists.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto neon-border bg-black/80 p-8 md:p-12 space-y-6">
          <label className="block">
            <span className="block text-white font-heading mb-2">Audio File *</span>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/aac,audio/mp4"
              required
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading"
            />
          </label>

          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Mix Title *" value={formData.title} onChange={(value) => setFormData({ ...formData, title: value })} required />
            <Input label="DJ / Artist Name *" value={formData.dj_name} onChange={(value) => setFormData({ ...formData, dj_name: value })} required />
            <Input label="Genre" value={formData.genre} onChange={(value) => setFormData({ ...formData, genre: value })} />
            <Input label="Tags" value={formData.tags} onChange={(value) => setFormData({ ...formData, tags: value })} />
            <Input label="Cover Art URL" value={formData.cover_art_url} onChange={(value) => setFormData({ ...formData, cover_art_url: value })} />
          </div>

          <label className="flex items-center text-white font-heading">
            <input
              type="checkbox"
              checked={formData.is_downloadable}
              onChange={(event) => setFormData({ ...formData, is_downloadable: event.target.checked })}
              className="mr-3"
            />
            Allow listeners to download this mix
          </label>

          <label className="block">
            <span className="block text-white font-heading mb-2">Description</span>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
            />
          </label>

          {progressText && (
            <div className="p-4 border border-neon-red/50 text-white font-heading flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 text-neon-red" />
              {progressText}
            </div>
          )}
          {error && <div className="p-4 bg-neon-red/20 border border-neon-red text-white font-heading">{error}</div>}

          <button
            type="submit"
            disabled={submitting || !audioFile}
            className="w-full px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload Mix"}
          </button>
          <p className="text-gray-500 font-heading text-sm text-center">
            Uploaded mixes are marked pending first so the platform can maintain quality control.
          </p>
        </form>
      </section>

      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-white font-heading mb-2">{label}</span>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 bg-black border border-neon-red/50 text-white font-heading focus:border-neon-red focus:outline-none"
      />
    </label>
  );
}
