import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EventItem, EventType, Location, Organization } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Users, Calendar, ArrowRight } from "lucide-react";

type Props = {
  event: EventItem;
  type?: EventType;
  org?: Organization;
  location?: Location;
  collaborators: Organization[];
  side: "left" | "right";
};

export function TimelineCard({ event, type, org, location, collaborators, side }: Props) {
  const date = new Date(event.timestamp);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const accent = type?.colorHex ?? "var(--primary)";

  return (
    <article
      className={`group relative ${side === "left" ? "md:pr-12 md:text-right" : "md:pl-12"}`}
    >
      <Card
        className="p-6 bg-card border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant relative overflow-hidden"
        style={{ borderTop: `3px solid ${accent}` }}
      >
        <div
          className="absolute -top-px left-0 right-0 h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        <div
          className={`flex items-center gap-2 text-xs text-muted-foreground mb-3 ${side === "left" ? "md:justify-end" : ""}`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-medium">{dateLabel}</span>
          <span className="opacity-50">·</span>
          <span>{timeLabel}</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 leading-snug">
          {event.name}
        </h3>

        {type && (
          <Badge
            className={`mb-3 border-0 text-white ${side === "left" ? "md:ml-auto" : ""}`}
            style={{ background: accent }}
          >
            {type.label}
          </Badge>
        )}

        {event.details && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {event.details}
          </p>
        )}

        <div
          className={`flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground ${side === "left" ? "md:justify-end" : ""}`}
        >
          {org && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              <span className="font-medium text-foreground">{org.name}</span>
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {location.name}
            </span>
          )}
          {collaborators.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {collaborators.map((c) => c.name).join(", ")}
            </span>
          )}
        </div>

        <Link
          to="/events/$eventId/edit"
          params={{ eventId: event.id }}
          className={`inline-flex items-center gap-1 text-xs font-medium text-primary mt-4 hover:gap-2 transition-all ${side === "left" ? "md:ml-auto" : ""}`}
        >
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>
    </article>
  );
}
