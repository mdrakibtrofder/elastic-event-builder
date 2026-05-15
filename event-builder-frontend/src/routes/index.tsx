import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TimelineCard } from "@/components/TimelineCard";
import { useEvents, useOrgs, useLocations, useTypes } from "@/hooks/use-registry";
import { Button } from "@/components/ui/button";
import { Plus, CalendarRange } from "lucide-react";

export const Route = createFileRoute("/")({
  component: TimelinePage,
});

function TimelinePage() {
  const events = useEvents();
  const orgs = useOrgs();
  const locations = useLocations();
  const types = useTypes();

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [events],
  );

  return (
    <AppLayout>
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
          <CalendarRange className="h-3.5 w-3.5" />
          Vertical Timeline
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent leading-[1.1] pb-1">
          Your event story
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-24 bg-gradient-primary rounded-full" />
        <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
          A scrollable, chronological thread of every event — color-coded by type and connected to
          its organization, collaborators, and venue.
        </p>
      </header>

      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative">
          <div
            aria-hidden
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-line md:-translate-x-1/2 rounded-full opacity-60"
          />
          <ol className="space-y-12 md:space-y-16">
            {sorted.map((e, i) => {
              const type = types.find((t) => t.id === e.typeId);
              const org = orgs.find((o) => o.id === e.organizationId);
              const loc = locations.find((l) => l.id === e.locationId);
              const collab = e.collaboratorIds
                .map((id) => orgs.find((o) => o.id === id))
                .filter(Boolean) as typeof orgs;
              const side = i % 2 === 0 ? "right" : "left";
              const accent = type?.colorHex ?? "#8b5cf6";
              const date = new Date(e.timestamp);
              const dateChip = date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <li key={e.id} className="relative">
                  {/* date chip */}
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:-top-7 mb-3 md:mb-0 flex md:justify-center pl-14 md:pl-0">
                    <span
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                      }}
                    >
                      {dateChip}
                    </span>
                  </div>

                  {/* node */}
                  <span
                    aria-hidden
                    className="absolute left-6 md:left-1/2 top-2 md:top-2 h-4 w-4 rounded-full border-4 border-background md:-translate-x-1/2 shadow-md ring-2"
                    style={{
                      background: accent,
                      // @ts-expect-error css var
                      "--tw-ring-color": `${accent}55`,
                    }}
                  />

                  <div
                    className={`grid md:grid-cols-2 gap-0 pl-14 md:pl-0 ${
                      side === "left" ? "" : "md:[&>*:first-child]:col-start-2"
                    }`}
                  >
                    <TimelineCard
                      event={e}
                      type={type}
                      org={org}
                      location={loc}
                      collaborators={collab}
                      side={side}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </AppLayout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-gradient-soft">
      <h2 className="text-xl font-semibold mb-2">No events yet</h2>
      <p className="text-muted-foreground mb-6">
        Build your first event to start the timeline.
      </p>
      <Button asChild className="bg-gradient-primary border-0">
        <Link to="/events/new">
          <Plus className="h-4 w-4" /> Create event
        </Link>
      </Button>
    </div>
  );
}
