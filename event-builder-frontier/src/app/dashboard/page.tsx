'use client';

import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEvents, useLocations, useOrgs, useTypes, eventsApi } from "@/hooks/use-registry";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { FormattedDate } from "@/components/ui/formatted-date";

export default function DashboardPage() {
  const events = useEvents();
  const orgs = useOrgs();
  const locations = useLocations();
  const types = useTypes();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return [...events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter((e) => !ql || e.name.toLowerCase().includes(ql));
  }, [events, q]);

  return (
    <AppLayout>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1.5">
            Tabular view for bulk review and quick filtering.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary border-0">
          <Link href="/events/new">
            <Plus className="h-4 w-4" /> New event
          </Link>
        </Button>
      </header>

      <div className="mb-4">
        <Input
          placeholder="Search events…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  No events match.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((e) => {
              const t = types.find((x) => x.id === e.typeId);
              const o = orgs.find((x) => x.id === e.organizationId);
              const l = locations.find((x) => x.id === e.locationId);
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>
                    {t && (
                      <Badge style={{ background: t.colorHex }} className="text-white border-0">
                        {t.label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{o?.name ?? "—"}</TableCell>
                  <TableCell>{l?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <FormattedDate date={e.timestamp} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link href={`/events/${e.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete "${e.name}"?`)) eventsApi.remove(e.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </AppLayout>
  );
}
