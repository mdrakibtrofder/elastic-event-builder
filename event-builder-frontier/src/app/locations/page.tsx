'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { locationsApi, useLocations } from "@/hooks/use-registry";
import { Pencil, Trash2, Plus, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Location } from "@/lib/types";

export default function LocationsPage() {
  const locations = useLocations();
  const [editing, setEditing] = useState<Location | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    setEditing({ id: locationsApi.newId(), name: "", address: "", capacity: 0 });
    setOpen(true);
  }

  return (
    <AppLayout>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground mt-1.5">Venues, addresses, and capacities.</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary border-0">
          <Plus className="h-4 w-4" /> New
        </Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((l) => (
          <Card key={l.id} className="p-5 hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-soft flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{l.name}</h3>
                {l.address && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{l.address}</p>
                )}
                {!!l.capacity && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Capacity: {l.capacity}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-1 mt-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditing({ ...l });
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  const r = locationsApi.remove(l.id);
                  if (!r.ok) alert(r.reason);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {locations.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No locations yet.
          </p>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Location</SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="space-y-4 mt-6">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={editing.address ?? ""}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={editing.capacity ?? 0}
                  onChange={(e) =>
                    setEditing({ ...editing, capacity: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <Button
                className="w-full bg-gradient-primary border-0"
                onClick={() => {
                  if (!editing.name.trim()) return;
                  locationsApi.upsert(editing);
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
