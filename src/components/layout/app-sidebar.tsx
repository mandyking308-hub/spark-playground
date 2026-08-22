import { Link, useRouterState } from "@tanstack/react-router";

import { AureliaMark } from "@/components/brand/aurelia-logo";
import { dashboardNav, platformModules, roles } from "@/config/navigation";

import type { PlatformRole } from "@/domain/access-control";
import { canEnterAlumniExperience, canEnterDashboardPath } from "@/domain/auth-routing";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ role }: { role: PlatformRole }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleModules = platformModules.filter((module) => canEnterDashboardPath(role, module.to));
  const visibleWorkspaces = roles.filter((workspace) => canEnterDashboardPath(role, workspace.to));
  const showAlumni = canEnterAlumniExperience(role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Aurelia home">
          <AureliaMark tone="brand" className="size-7 shrink-0" />
          <span className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm tracking-tight">Aurelia</span>
            <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Create · Learn · Achieve
            </span>
          </span>
        </Link>
      </SidebarHeader>


      <SidebarContent>
        {visibleModules.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Core modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleModules.map((module) => (
                  <SidebarMenuItem key={module.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === module.to}
                      tooltip={`${module.label} · ${module.audience}`}
                    >
                      <Link to={module.to}>
                        <module.icon />
                        <span>{module.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {visibleWorkspaces.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleWorkspaces.map((workspace) => (
                  <SidebarMenuItem key={workspace.key}>
                    <SidebarMenuButton asChild isActive={pathname === workspace.to} tooltip={workspace.label}>
                      <Link to={workspace.to}>
                        <workspace.icon />
                        <span>{workspace.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {showAlumni ? (
          <SidebarGroup>
            <SidebarGroupLabel>Separate environment</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/alumni")}
                    tooltip={dashboardNav.alumni.label}
                  >
                    <Link to={dashboardNav.alumni.to}>
                      <dashboardNav.alumni.icon />
                      <span>{dashboardNav.alumni.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        Verified identity · least-privilege navigation
      </SidebarFooter>
    </Sidebar>
  );
}
