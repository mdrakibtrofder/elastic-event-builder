import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useEvents, useLocations, useOrgs, useTypes } from "@/hooks/use-registry";
import { useMemo } from "react";
import { CalendarClock, Building2, MapPin, Tags } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const events = useEvents();
  const orgs = useOrgs();
  const locations = useLocations();
  const types = useTypes();

  const byOrg = useMemo(() => {
    const m = new Map<string, number>();
    events.forEach((e) => m.set(e.organizationId, (m.get(e.organizationId) ?? 0) + 1));
    return orgs
      .map((o) => ({ name: o.name, count: m.get(o.id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [events, orgs]);

  const byLocation = useMemo(() => {
    const m = new Map<string, number>();
    events.forEach((e) => m.set(e.locationId, (m.get(e.locationId) ?? 0) + 1));
    return locations
      .map((l) => ({ name: l.name, count: m.get(l.id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [events, locations]);

  const byType = useMemo(() => {
    const m = new Map<string, number>();
    events.forEach((e) => m.set(e.typeId, (m.get(e.typeId) ?? 0) + 1));
    return types
      .map((t) => ({ name: t.label, color: t.colorHex, count: m.get(t.id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [events, types]);

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1.5">
          Visual breakdown of events across the registry.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={CalendarClock} label="Events" value={events.length} />
        <Stat icon={Building2} label="Organizations" value={orgs.length} />
        <Stat icon={MapPin} label="Locations" value={locations.length} />
        <Stat icon={Tags} label="Types" value={types.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <BarCard title="Events by organization" data={byOrg} accent="var(--primary)" />
        <BarCard title="Events by location" data={byLocation} accent="var(--primary-glow)" />
        <BarCard title="Events by type" data={byType} useColor />
      </div>
    </AppLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function BarCard({
  title,
  data,
  accent,
  useColor,
}: {
  title: string;
  data: { name: string; count: number; color?: string }[];
  accent?: string;
  useColor?: boolean;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 tracking-tight">{title}</h3>
      <div className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
        {data.map((d) => {
          const w = (d.count / max) * 100;
          const color = useColor && d.color ? d.color : accent;
          return (
            <div key={d.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium truncate pr-2">{d.name}</span>
                <span className="text-muted-foreground tabular-nums">{d.count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${w}%`,
                    background:
                      useColor && d.color
                        ? color
                        : "linear-gradient(90deg, var(--primary), var(--primary-glow))",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
