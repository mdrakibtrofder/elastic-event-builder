import { useEffect, useState, useCallback } from "react";
import { seedIfEmpty, store, uid } from "@/lib/storage";
import type { EventItem, EventType, Location, Organization } from "@/lib/types";

function useStoreSlice<T>(read: () => T): [T, () => void] {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    seedIfEmpty();
    refresh();
    const handler = () => refresh();
    window.addEventListener("eb:storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("eb:storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);
  return [read(), refresh];
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

export function useEvents() {
  const [items] = useStoreSlice<EventItem[]>(() => store.events.list());
  return items;
}
export function useOrgs() {
  const [items] = useStoreSlice<Organization[]>(() => store.orgs.list());
  return items;
}
export function useLocations() {
  const [items] = useStoreSlice<Location[]>(() => store.locations.list());
  return items;
}
export function useTypes() {
  const [items] = useStoreSlice<EventType[]>(() => store.types.list());
  return items;
}

export const eventsApi = {
  upsert: (e: EventItem) => {
    const list = store.events.list();
    const idx = list.findIndex((x) => x.id === e.id);
    if (idx >= 0) list[idx] = e;
    else list.push(e);
    store.events.save(list);
  },
  remove: (id: string) => {
    store.events.save(store.events.list().filter((x) => x.id !== id));
  },
  newId: uid,
};

export const orgsApi = {
  upsert: (o: Organization) => {
    const list = store.orgs.list();
    const idx = list.findIndex((x) => x.id === o.id);
    if (idx >= 0) list[idx] = o;
    else list.push(o);
    store.orgs.save(list);
  },
  remove: (id: string) => {
    const used = store.events
      .list()
      .some((e) => e.organizationId === id || e.collaboratorIds.includes(id));
    if (used) return { ok: false, reason: "Organization is used by active events." };
    store.orgs.save(store.orgs.list().filter((x) => x.id !== id));
    return { ok: true };
  },
  newId: uid,
};

export const locationsApi = {
  upsert: (l: Location) => {
    const list = store.locations.list();
    const idx = list.findIndex((x) => x.id === l.id);
    if (idx >= 0) list[idx] = l;
    else list.push(l);
    store.locations.save(list);
  },
  remove: (id: string) => {
    const used = store.events.list().some((e) => e.locationId === id);
    if (used) return { ok: false, reason: "Location is used by active events." };
    store.locations.save(store.locations.list().filter((x) => x.id !== id));
    return { ok: true };
  },
  newId: uid,
};

export const typesApi = {
  upsert: (t: EventType) => {
    const list = store.types.list();
    const idx = list.findIndex((x) => x.id === t.id);
    if (idx >= 0) list[idx] = t;
    else list.push(t);
    store.types.save(list);
  },
  remove: (id: string) => {
    const used = store.events.list().some((e) => e.typeId === id);
    if (used) return { ok: false, reason: "Type is used by active events." };
    store.types.save(store.types.list().filter((x) => x.id !== id));
    return { ok: true };
  },
  newId: uid,
};
