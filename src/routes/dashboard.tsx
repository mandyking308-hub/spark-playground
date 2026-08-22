import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { BackendStatus } from "@/components/system/backend-status";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authenticatedHomeForRole, canEnterDashboardPath } from "@/domain/auth-routing";
import { getCurrentActorFn } from "@/functions/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const actor = await getCurrentActorFn();
    if (!actor) {
      throw redirect({ to: "/auth/sign-in" });
    }

    if (!canEnterDashboardPath(actor.role, location.pathname)) {
      throw redirect({ to: authenticatedHomeForRole(actor.role) });
    }

    return { actor };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { actor } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={actor.role} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{actor.displayName}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Verified Aurelia workspace</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <BackendStatus />
              <RoleSwitcher role={actor.role} />
              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 px-4 py-8 sm:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
