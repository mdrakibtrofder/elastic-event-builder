import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { EventForm } from "@/components/EventForm";

export const Route = createFileRoute("/events/new")({
  component: NewEventPage,
});

function NewEventPage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <PageHeader title="Build an event" subtitle="Compose details, type, organization, collaborators, and venue." />
      <EventForm onSaved={() => navigate({ to: "/" })} onCancel={() => navigate({ to: "/" })} />
    </AppLayout>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1.5">{subtitle}</p>
    </header>
  );
}
