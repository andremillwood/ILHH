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

export const isDesignatedRsvpEvent = (eventOrTitle: string | Pick<EventWithDJs, "title" | "theme" | "venue_name" | "event_date">) => {
  if (typeof eventOrTitle === "string") {
    const normalizedTitle = eventOrTitle.toLowerCase();
    return normalizedTitle.includes("i luv hip hop") || normalizedTitle.includes("own the night") || normalizedTitle.includes("shutdown") || normalizedTitle.includes("rave mode");
  }

  const haystack = [eventOrTitle.title, eventOrTitle.theme, eventOrTitle.venue_name].filter(Boolean).join(" ").toLowerCase();
  const [year, month, day] = eventOrTitle.event_date.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const isThursday = eventDate.getDay() === 4;
  const isDulce = haystack.includes("dulce");
  const isIlhhSeries = haystack.includes("i luv hip hop") || haystack.includes("global bass") || haystack.includes("breeze") || haystack.includes("hip-so") || haystack.includes("love songs");
  const explicitlyNamed = haystack.includes("shutdown") || haystack.includes("rave mode") || haystack.includes("own the night");

  return explicitlyNamed || (isThursday && isDulce && isIlhhSeries);
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
