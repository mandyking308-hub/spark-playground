import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { AureliaLogo } from "@/components/brand/aurelia-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav } from "@/config/public-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-8">
        <Link to="/" className="rounded-md" aria-label="Aurelia home">
          <AureliaLogo />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {primaryNav.map((group) => (
            <div key={group.label} className="group relative">
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-haspopup="true"
              >
                {group.label}
              </button>
              <div className="invisible absolute start-0 top-full z-50 w-80 translate-y-1 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-lg transition-[opacity,visibility] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <span className="block text-sm font-medium text-foreground">{link.label}</span>
                    {link.description ? (
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth/join">Join with invitation</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-start">
                  <AureliaLogo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="space-y-6 px-4 pb-10">
                {primaryNav.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {group.label}
                    </p>
                    <ul className="space-y-1">
                      {group.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  <Button asChild variant="outline">
                    <Link to="/auth/sign-in" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/join" onClick={() => setOpen(false)}>
                      Join with invitation
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
