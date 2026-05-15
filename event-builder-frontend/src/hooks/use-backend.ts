import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/api";
import type { EventItem, EventType, Location, Organization } from "@/lib/types";

// --- Events ---
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: backendApi.events.list,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => backendApi.events.get(id),
    enabled: !!id,
  });
}

// --- Organizations ---
export function useOrgs() {
  return useQuery({
    queryKey: ["orgs"],
    queryFn: backendApi.orgs.list,
  });
}

// --- Locations ---
export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: backendApi.locations.list,
  });
}

// --- Types ---
export function useTypes() {
  return useQuery({
    queryKey: ["types"],
    queryFn: backendApi.types.list,
  });
}

// --- API Objects (Modified for Async/Mutations) ---
export const eventsApi = {
  useUpsert: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (e: any) => {
        const { id, ...data } = e;
        // In a real backend, we'd decide between POST/PATCH
        // For simplicity, let's assume if it's a new ID (from frontend), it's a POST
        // But better is to check if we're editing
        return e.isNew ? backendApi.events.create(data) : backendApi.events.update(id, data);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    });
  },
  useRemove: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: backendApi.events.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    });
  },
};
