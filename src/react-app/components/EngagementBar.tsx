import { useEffect, useState } from "react";
import { Bookmark, Heart, UserPlus } from "lucide-react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";

type EngagementType = "like" | "save" | "follow";

interface EngagementBarProps {
  targetType: "creator_profile" | "mixtape" | "article" | "event";
  targetId: string | number;
  modes?: EngagementType[];
}

const labels: Record<EngagementType, string> = {
  like: "Like",
  save: "Save",
  follow: "Follow",
};

const icons = {
  like: Heart,
  save: Bookmark,
  follow: UserPlus,
};

export default function EngagementBar({ targetType, targetId, modes = ["like", "save"] }: EngagementBarProps) {
  const { user } = useAuth();
  const authHeader = useAuthHeader();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    fetch(`/api/public?resource=engagement&targetType=${targetType}&targetId=${targetId}`, authHeader ? { headers: { Authorization: authHeader } } : undefined)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setCounts(data.counts || {});
        setMine(data.mine || []);
      })
      .catch(() => undefined);
  };

  useEffect(load, [targetType, targetId, authHeader]);

  const toggle = async (type: EngagementType) => {
    if (!user || !authHeader) {
      window.location.href = "/membership";
      return;
    }
    setBusy(type);
    const active = mine.includes(type);
    await fetch("/api/public?resource=engagement", {
      method: active ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ targetType, targetId: String(targetId), engagementType: type }),
    }).catch(() => undefined);
    setBusy(null);
    load();
  };

  return (
    <div className="flex flex-wrap gap-3">
      {modes.map((type) => {
        const Icon = icons[type];
        const active = mine.includes(type);
        return (
          <button
            key={type}
            type="button"
            disabled={busy === type}
            onClick={() => toggle(type)}
            className={`px-4 py-3 border font-heading uppercase tracking-wider text-sm flex items-center gap-2 transition ${active ? "bg-neon-red border-neon-red text-black" : "border-white/20 text-white hover:text-neon-red"}`}
          >
            <Icon className="w-4 h-4" />
            {labels[type]} {counts[type] ? counts[type] : ""}
          </button>
        );
      })}
    </div>
  );
}
