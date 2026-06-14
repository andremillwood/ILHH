import { Instagram, MessageCircle, Music2 } from "lucide-react";
import { socialLinks } from "@/react-app/lib/socialLinks";

export default function SocialCtas({ compact = false }: { compact?: boolean }) {
  const items = [
    { ...socialLinks.whatsapp, icon: MessageCircle, needsUrl: true },
    { ...socialLinks.instagram, icon: Instagram },
    { ...socialLinks.tiktok, icon: Music2 },
  ];

  return (
    <div className={compact ? "flex flex-wrap gap-3" : "grid gap-3 sm:grid-cols-3"}>
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <Icon className="h-5 w-5 text-neon-red group-hover:text-black" />
            <span>
              <span className="block font-heading text-sm uppercase tracking-wider">{item.label}</span>
              <span className="block text-xs text-gray-400 group-hover:text-black/70">{item.handle}</span>
            </span>
          </>
        );

        if (item.url) {
          return (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 border border-neon-red/50 bg-black/80 px-4 py-3 text-white hover:bg-neon-red hover:text-black transition"
            >
              {content}
            </a>
          );
        }

        return (
          <div
            key={item.label}
            className="group flex items-center gap-3 border border-white/15 bg-black/60 px-4 py-3 text-white"
            title="Set VITE_WHATSAPP_GROUP_URL to activate this link."
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
