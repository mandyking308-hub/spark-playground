import { Outlet, Link, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { Button } from "@/components/ui/button";
import { authenticatedHomeForRole, canEnterAlumniExperience } from "@/domain/auth-routing";
import { getCurrentActorFn } from "@/functions/auth";

export const Route = createFileRoute("/alumni")({
  beforeLoad: async () => {
    const actor = await getCurrentActorFn();
    if (!actor) throw redirect({ to: "/auth/sign-in" });
    if (!canEnterAlumniExperience(actor.role)) {
      throw redirect({ to: authenticatedHomeForRole(actor.role) });
    }
    return { actor };
  },
  component: AlumniLayout,
});

const alumniLinks = [
  { label: "Overview", to: "/alumni" },
  { label: "Portfolio", to: "/alumni/portfolio" },
  { label: "Opportunities", to: "/alumni/opportunities" },
  { label: "Community", to: "/alumni/community" },
] as const;

function AlumniLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { actor } = Route.useRouteContext();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-2 sm:px-8">
          <Link to="/alumni" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">A</span>
            <span className="font-display text-sm tracking-tight">Aurelia Alumni</span>
          </Link>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">16+</span>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:ml-4 sm:w-auto" aria-label="Alumni navigation">
            {alumniLinks.map((item) => (
              <Button key={item.to} asChild variant={pathname === item.to ? "secondary" : "ghost"} size="sm">
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden max-w-40 truncate text-xs text-muted-foreground md:inline">{actor.displayName}</span>
            <RoleSwitcher role={actor.role} />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8"><Outlet /></main>
    </div>
  );
}
