'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { orgsApi, useOrgs } from "@/hooks/use-registry";
import { Pencil, Trash2, Plus, Building2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Organization } from "@/lib/types";

export default function OrgsPage() {
  const orgs = useOrgs();
  const [editing, setEditing] = useState<Organization | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    setEditing({ id: orgsApi.newId(), name: "", contactEmail: "" });
    setOpen(true);
  }
  function openEdit(o: Organization) {
    setEditing({ ...o });
    setOpen(true);
  }

  return (
    <AppLayout>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-1.5">
            Internal departments and external partners.
          </p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary border-0">
          <Plus className="h-4 w-4" /> New
        </Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((o) => (
          <Card key={o.id} className="p-5 hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-soft flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{o.name}</h3>
                {o.contactEmail && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {o.contactEmail}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-1 mt-3">
              <Button size="icon" variant="ghost" onClick={() => openEdit(o)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  const r = orgsApi.remove(o.id);
                  if (!r.ok) alert(r.reason);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {orgs.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No organizations yet.
          </p>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Organization</SheetTitle>
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
                <Label>Contact email</Label>
                <Input
                  value={editing.contactEmail ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, contactEmail: e.target.value })
                  }
                />
              </div>
              <Button
                className="w-full bg-gradient-primary border-0"
                onClick={() => {
                  if (!editing.name.trim()) return;
                  orgsApi.upsert(editing);
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
