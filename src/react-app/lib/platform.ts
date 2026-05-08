import type { EventWithDJs } from "@/shared/types";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatEventDate = (eventDate: string) => {
  const [year, month, day] = eventDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const isDesignatedRsvpEvent = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  return normalizedTitle.includes("i luv hip hop") || normalizedTitle.includes("own the night");
};

export const getEventProfileNames = (events: EventWithDJs[]) => {
  const names = new Map<string, { name: string; eventCount: number; residentCount: number }>();

  events.forEach((event) => {
    event.djs.forEach((dj) => {
      const slug = slugify(dj.dj_name);
      const current = names.get(slug) || { name: dj.dj_name, eventCount: 0, residentCount: 0 };
      names.set(slug, {
        ...current,
        eventCount: current.eventCount + 1,
        residentCount: current.residentCount + (dj.is_resident === 1 ? 1 : 0),
      });
    });
  });

  return Array.from(names.entries()).map(([slug, profile]) => ({ slug, ...profile }));
};
