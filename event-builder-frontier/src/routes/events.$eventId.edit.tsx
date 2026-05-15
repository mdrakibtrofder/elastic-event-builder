import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/hooks/use-registry";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEventPage,
});

function EditEventPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const events = useEvents();
  const event = events.find((e) => e.id === eventId);

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit event</h1>
        <p className="text-muted-foreground mt-1.5">
          Update details and relationships for this event.
        </p>
      </header>

      {!event ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground mb-4">Event not found.</p>
          <Button asChild>
            <Link to="/">Back to timeline</Link>
          </Button>
        </div>
      ) : (
        <EventForm
          initial={event}
          onSaved={() => navigate({ to: "/" })}
          onCancel={() => navigate({ to: "/" })}
        />
      )}
    </AppLayout>
  );
}
