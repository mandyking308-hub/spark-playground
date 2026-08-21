import { Link, useRouterState } from "@tanstack/react-router";
import { Check, ChevronsUpDown } from "lucide-react";

import { roles } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RoleSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = roles.find((r) => r.to === pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {active ? <active.icon className="size-4" /> : null}
          <span className="hidden sm:inline">{active ? active.label : "Choose a role"}</span>
          <ChevronsUpDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Preview as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem key={role.key} asChild>
            <Link to={role.to} className="flex items-center gap-2">
              <role.icon className="size-4" />
              <span className="flex-1">{role.label}</span>
              {active?.key === role.key && <Check className="size-4" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
