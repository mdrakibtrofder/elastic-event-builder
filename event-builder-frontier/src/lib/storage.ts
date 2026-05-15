import type { EventItem, EventType, Location, Organization } from "./types";

const KEYS = {
  events: "eb.events",
  orgs: "eb.orgs",
  locations: "eb.locations",
  types: "eb.types",
  seeded: "eb.seeded.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("eb:storage", { detail: { key } }));
}

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const store = {
  events: {
    list: () => read<EventItem[]>(KEYS.events, []),
    save: (v: EventItem[]) => write(KEYS.events, v),
  },
  orgs: {
    list: () => read<Organization[]>(KEYS.orgs, []),
    save: (v: Organization[]) => write(KEYS.orgs, v),
  },
  locations: {
    list: () => read<Location[]>(KEYS.locations, []),
    save: (v: Location[]) => write(KEYS.locations, v),
  },
  types: {
    list: () => read<EventType[]>(KEYS.types, []),
    save: (v: EventType[]) => write(KEYS.types, v),
  },
};

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const orgs: Organization[] = [
    { id: uid(), name: "Acme Studio", contactEmail: "hello@acme.com" },
    { id: uid(), name: "Northwind Labs", contactEmail: "team@northwind.io" },
    { id: uid(), name: "Lumen Collective", contactEmail: "info@lumen.co" },
  ];
  const locations: Location[] = [
    { id: uid(), name: "HQ Auditorium", address: "1 Market St, SF", capacity: 200 },
    { id: uid(), name: "Riverside Hall", address: "88 River Rd, NYC", capacity: 450 },
    { id: uid(), name: "Online — Zoom", address: "Virtual", capacity: 1000 },
  ];
  const types: EventType[] = [
    { id: uid(), label: "Workshop", colorHex: "#8b5cf6", icon: "Wrench" },
    { id: uid(), label: "Webinar", colorHex: "#ec4899", icon: "Video" },
    { id: uid(), label: "Networking", colorHex: "#06b6d4", icon: "Users" },
    { id: uid(), label: "Conference", colorHex: "#f59e0b", icon: "Mic" },
  ];

  const now = Date.now();
  const day = 86400000;
  const events: EventItem[] = [
    {
      id: uid(),
      name: "Quarterly Product Strategy",
      timestamp: new Date(now - day * 5).toISOString(),
      details:
        "Cross-team alignment on the roadmap, OKRs, and launches for the upcoming quarter. Includes breakout sessions.",
      typeId: types[3].id,
      organizationId: orgs[0].id,
      collaboratorIds: [orgs[1].id],
      locationId: locations[0].id,
      relatedEventIds: [],
    },
    {
      id: uid(),
      name: "Design Systems Workshop",
      timestamp: new Date(now + day * 2).toISOString(),
      details:
        "Hands-on session on tokens, theming, and component composition. Bring your laptop and design files.",
      typeId: types[0].id,
      organizationId: orgs[2].id,
      collaboratorIds: [orgs[0].id, orgs[1].id],
      locationId: locations[2].id,
      relatedEventIds: [],
    },
    {
      id: uid(),
      name: "Founders Networking Night",
      timestamp: new Date(now + day * 9).toISOString(),
      details:
        "Casual evening of intros, demos, and conversations with founders across the region.",
      typeId: types[2].id,
      organizationId: orgs[1].id,
      collaboratorIds: [orgs[2].id],
      locationId: locations[1].id,
      relatedEventIds: [],
    },
    {
      id: uid(),
      name: "AI in Production Webinar",
      timestamp: new Date(now + day * 16).toISOString(),
      details:
        "Live talk + Q&A on shipping reliable AI features: evaluation, monitoring, and cost control.",
      typeId: types[1].id,
      organizationId: orgs[0].id,
      collaboratorIds: [],
      locationId: locations[2].id,
      relatedEventIds: [],
    },
  ];

  store.orgs.save(orgs);
  store.locations.save(locations);
  store.types.save(types);
  store.events.save(events);
  localStorage.setItem(KEYS.seeded, "1");
}

export function useStorageVersion() {
  // re-export indirection to avoid circular import in hooks file
  return null;
}
