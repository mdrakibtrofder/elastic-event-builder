'use client';

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/hooks/use-registry";
import { Button } from "@/components/ui/button";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
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
            <Link href="/">Back to timeline</Link>
          </Button>
        </div>
      ) : (
        <EventForm
          initial={event}
          onSaved={() => router.push("/")}
          onCancel={() => router.push("/")}
        />
      )}
    </AppLayout>
  );
}
