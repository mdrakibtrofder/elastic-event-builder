import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarClock,
  PlusCircle,
  LayoutDashboard,
  Building2,
  MapPin,
  Tags,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Timeline", icon: CalendarClock },
  { to: "/events/new", label: "Event Builder", icon: PlusCircle },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

const registry = [
  { to: "/organizations", label: "Organizations", icon: Building2 },
  { to: "/locations", label: "Locations", icon: MapPin },
  { to: "/types", label: "Event Types", icon: Tags },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar hidden md:flex md:flex-col">
        <div className="px-5 py-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-semibold text-sidebar-foreground tracking-tight">
              EventBuilder<span className="text-primary"> Pro</span>
            </span>
          </Link>
        </div>

        <nav className="px-3 flex-1 overflow-y-auto">
          <SectionLabel>Workspace</SectionLabel>
          <div className="space-y-0.5 mb-6">
            {nav.map((n) => (
              <NavItem key={n.to} to={n.to} label={n.label} Icon={n.icon} active={path === n.to} />
            ))}
          </div>
          <SectionLabel>Registry</SectionLabel>
          <div className="space-y-0.5">
            {registry.map((n) => (
              <NavItem key={n.to} to={n.to} label={n.label} Icon={n.icon} active={path === n.to} />
            ))}
          </div>
        </nav>

        <div className="p-4 m-3 rounded-xl bg-gradient-soft border border-sidebar-border">
          <p className="text-xs font-medium text-sidebar-foreground">Local-first</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Your data lives in this browser. No accounts, no servers.
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <MobileNav path={path} />
        <div className="px-6 md:px-10 py-8 md:py-10 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function NavItem({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-gradient-primary text-primary-foreground shadow-md"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function MobileNav({ path }: { path: string }) {
  const all = [...nav, ...registry];
  return (
    <div className="md:hidden border-b border-border bg-sidebar/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </span>
        <span className="font-semibold tracking-tight text-sm">EventBuilder Pro</span>
      </div>
      <div className="flex gap-1 px-2 pb-2 overflow-x-auto">
        {all.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium",
              path === n.to
                ? "bg-gradient-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
