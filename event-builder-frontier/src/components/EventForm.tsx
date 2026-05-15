import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Trash2 } from "lucide-react";
import { eventsApi, useEvents, useLocations, useOrgs, useTypes } from "@/hooks/use-registry";
import type { EventItem } from "@/lib/types";

type Props = {
  initial?: EventItem;
  onSaved: () => void;
  onCancel: () => void;
};

function toLocalInputValue(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ initial, onSaved, onCancel }: Props) {
  const orgs = useOrgs();
  const locations = useLocations();
  const types = useTypes();
  const allEvents = useEvents();

  const [name, setName] = useState(initial?.name ?? "");
  const [when, setWhen] = useState(toLocalInputValue(initial?.timestamp));
  const [details, setDetails] = useState(initial?.details ?? "");
  const [typeId, setTypeId] = useState(initial?.typeId ?? "");
  const [organizationId, setOrganizationId] = useState(initial?.organizationId ?? "");
  const [locationId, setLocationId] = useState(initial?.locationId ?? "");
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>(
    initial?.collaboratorIds ?? [],
  );
  const [relatedEventIds, setRelatedEventIds] = useState<string[]>(
    initial?.relatedEventIds ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  const collabPool = useMemo(
    () => orgs.filter((o) => o.id !== organizationId && !collaboratorIds.includes(o.id)),
    [orgs, organizationId, collaboratorIds],
  );

  const relatedPool = useMemo(
    () =>
      allEvents.filter(
        (e) => e.id !== initial?.id && !relatedEventIds.includes(e.id),
      ),
    [allEvents, initial?.id, relatedEventIds],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required");
    if (!typeId) return setError("Pick an event type");
    if (!organizationId) return setError("Pick an organization");
    if (!locationId) return setError("Pick a location");
    setError(null);

    const payload: EventItem = {
      id: initial?.id ?? eventsApi.newId(),
      name: name.trim(),
      timestamp: new Date(when).toISOString(),
      details: details.trim(),
      typeId,
      organizationId,
      collaboratorIds,
      locationId,
      relatedEventIds,
    };
    eventsApi.upsert(payload);
    onSaved();
  }

  function deleteEvent() {
    if (!initial) return;
    if (!confirm("Delete this event?")) return;
    eventsApi.remove(initial.id);
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Event name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Quarterly product review"
            />
          </Field>
          <Field label="Date & time" required>
            <Input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Details (markdown supported)">
          <Textarea
            value={details}
            rows={5}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Agenda, links, what to bring…"
          />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Categorization & ownership</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Event type" required>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: t.colorHex }}
                      />
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Primary organization" required>
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger>
                <SelectValue placeholder="Owner org" />
              </SelectTrigger>
              <SelectContent>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location" required>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Collaborating organizations</SectionTitle>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {collaboratorIds.length === 0 && (
            <span className="text-sm text-muted-foreground">No collaborators yet.</span>
          )}
          {collaboratorIds.map((id) => {
            const o = orgs.find((x) => x.id === id);
            if (!o) return null;
            return (
              <Badge key={id} variant="secondary" className="gap-1.5 pr-1 py-1">
                {o.name}
                <button
                  type="button"
                  onClick={() => setCollaboratorIds((p) => p.filter((x) => x !== id))}
                  className="rounded hover:bg-background/50 p-0.5"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
        <Select
          value=""
          onValueChange={(v) => v && setCollaboratorIds((p) => [...p, v])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add collaborator…" />
          </SelectTrigger>
          <SelectContent>
            {collabPool.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No more orgs</div>
            )}
            {collabPool.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Related events</SectionTitle>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {relatedEventIds.length === 0 && (
            <span className="text-sm text-muted-foreground">No relations yet.</span>
          )}
          {relatedEventIds.map((id) => {
            const ev = allEvents.find((x) => x.id === id);
            if (!ev) return null;
            return (
              <Badge key={id} variant="secondary" className="gap-1.5 pr-1 py-1">
                {ev.name}
                <button
                  type="button"
                  onClick={() => setRelatedEventIds((p) => p.filter((x) => x !== id))}
                  className="rounded hover:bg-background/50 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
        <Select value="" onValueChange={(v) => v && setRelatedEventIds((p) => [...p, v])}>
          <SelectTrigger>
            <SelectValue placeholder="Link a related event…" />
          </SelectTrigger>
          <SelectContent>
            {relatedPool.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No more events</div>
            )}
            {relatedPool.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <div>
          {initial && (
            <Button type="button" variant="ghost" onClick={deleteEvent} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gradient-primary border-0 shadow-md">
            {initial ? "Save changes" : "Create event"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold tracking-wide text-foreground/80">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold tracking-tight">{children}</h3>;
}
