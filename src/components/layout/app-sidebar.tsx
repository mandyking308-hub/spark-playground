import { Link, useRouterState } from "@tanstack/react-router";

import { dashboardNav, platformModules, roles } from "@/config/navigation";
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

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="font-display text-sm tracking-tight group-data-[collapsible=icon]:hidden">
            Aurelia
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformModules.map((module) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roles.map((role) => (
                <SidebarMenuItem key={role.key}>
                  <SidebarMenuButton asChild isActive={pathname === role.to} tooltip={role.label}>
                    <Link to={role.to}>
                      <role.icon />
                      <span>{role.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        Protected child world · verified adult communities
      </SidebarFooter>
    </Sidebar>
  );
}
