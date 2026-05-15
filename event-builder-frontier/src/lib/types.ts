export type Organization = {
  id: string;
  name: string;
  logo?: string;
  contactEmail?: string;
};

export type Location = {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
};

export type EventType = {
  id: string;
  label: string;
  colorHex: string;
  icon?: string;
};

export type EventItem = {
  id: string;
  name: string;
  timestamp: string; // ISO
  details: string;
  typeId: string;
  organizationId: string;
  collaboratorIds: string[];
  locationId: string;
  relatedEventIds: string[];
};
