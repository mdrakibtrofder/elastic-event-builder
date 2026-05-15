'use client';

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { EventForm } from "@/components/EventForm";

export default function NewEventPage() {
  const router = useRouter();
  return (
    <AppLayout>
      <PageHeader title="Build an event" subtitle="Compose details, type, organization, collaborators, and venue." />
      <EventForm onSaved={() => router.push("/")} onCancel={() => router.push("/")} />
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
