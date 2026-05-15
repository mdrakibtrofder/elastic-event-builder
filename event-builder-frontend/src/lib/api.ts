import axios from 'axios';
import type { EventItem, EventType, Location, Organization } from "./types";

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

// Helper to map backend entity to frontend type
const mapEvent = (e: any): EventItem => ({
  id: e.id,
  name: e.name,
  timestamp: e.timestamp,
  details: e.details,
  typeId: e.type?.id,
  organizationId: e.organization?.id,
  collaboratorIds: e.collaborators?.map((c: any) => c.id) || [],
  locationId: e.location?.id,
  relatedEventIds: e.relatedEvents?.map((r: any) => r.id) || [],
});

export const backendApi = {
  events: {
    list: () => api.get('/events').then(res => res.data.data.map(mapEvent)),
    get: (id: string) => api.get(`/events/${id}`).then(res => mapEvent(res.data.data)),
    create: (data: any) => api.post('/events', data).then(res => res.data.data),
    update: (id: string, data: any) => api.patch(`/events/${id}`, data).then(res => res.data.data),
    remove: (id: string) => api.delete(`/events/${id}`).then(res => res.data.data),
  },
  orgs: {
    list: () => api.get('/organizations').then(res => res.data.data),
    create: (data: any) => api.post('/organizations', data).then(res => res.data.data),
    update: (id: string, data: any) => api.patch(`/organizations/${id}`, data).then(res => res.data.data),
    remove: (id: string) => api.delete(`/organizations/${id}`).then(res => res.data.data),
  },
  locations: {
    list: () => api.get('/locations').then(res => res.data.data),
    create: (data: any) => api.post('/locations', data).then(res => res.data.data),
    update: (id: string, data: any) => api.patch(`/locations/${id}`, data).then(res => res.data.data),
    remove: (id: string) => api.delete(`/locations/${id}`).then(res => res.data.data),
  },
  types: {
    list: () => api.get('/event-types').then(res => res.data.data),
    create: (data: any) => api.post('/event-types', data).then(res => res.data.data),
    update: (id: string, data: any) => api.patch(`/event-types/${id}`, data).then(res => res.data.data),
    remove: (id: string) => api.delete(`/event-types/${id}`).then(res => res.data.data),
  },
};
