import { Outlet, Link, createFileRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { BackendStatus } from "@/components/system/backend-status";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Dashboards</span>
            <div className="ml-auto flex items-center gap-2">
              <BackendStatus />
              <RoleSwitcher />
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth/sign-in">Sign in</Link>
              </Button>
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
