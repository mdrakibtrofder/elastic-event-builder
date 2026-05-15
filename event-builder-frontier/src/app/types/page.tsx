'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { typesApi, useTypes } from "@/hooks/use-registry";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EventType } from "@/lib/types";

const PRESET_COLORS = [
  "#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#a855f7",
];

export default function TypesPage() {
  const types = useTypes();
  const [editing, setEditing] = useState<EventType | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    setEditing({ id: typesApi.newId(), label: "", colorHex: "#8b5cf6" });
    setOpen(true);
  }

  return (
    <AppLayout>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Types</h1>
          <p className="text-muted-foreground mt-1.5">
            Taxonomy with custom color-coding for the timeline.
          </p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary border-0">
          <Plus className="h-4 w-4" /> New
        </Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <Card
            key={t.id}
            className="p-5 hover:shadow-elegant transition-all"
            style={{ borderTop: `3px solid ${t.colorHex}` }}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${t.colorHex}22` }}
              >
                <Tag className="h-5 w-5" style={{ color: t.colorHex }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{t.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{t.colorHex}</p>
              </div>
            </div>
            <div className="flex justify-end gap-1 mt-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditing({ ...t });
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
                  const r = typesApi.remove(t.id);
                  if (!r.ok) alert(r.reason);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {types.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No types yet.
          </p>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Event type</SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="space-y-4 mt-6">
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditing({ ...editing, colorHex: c })}
                      className={`h-9 w-9 rounded-lg transition-all ${
                        editing.colorHex === c ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <Input
                  value={editing.colorHex}
                  onChange={(e) => setEditing({ ...editing, colorHex: e.target.value })}
                  className="mt-2 font-mono text-sm"
                />
              </div>
              <Button
                className="w-full bg-gradient-primary border-0"
                onClick={() => {
                  if (!editing.label.trim()) return;
                  typesApi.upsert(editing);
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
