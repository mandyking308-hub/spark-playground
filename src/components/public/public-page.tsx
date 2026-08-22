import { Children, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

import {
  AureliaProductPreview,
  AureliaProductTour,
} from "@/components/public/aurelia-product-story";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { cn } from "@/lib/utils";

export function PublicPage({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const sections = Children.toArray(children);
  const homepage = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className={cn("flex-1", className)}>
        {homepage && sections.length > 0 ? (
          <>
            <div className="relative">
              {sections[0]}
              <div className="pointer-events-none absolute right-8 top-12 z-20 hidden w-[46%] max-w-[34rem] lg:block xl:right-[calc((100vw-72rem)/2+2rem)]">
                <AureliaProductPreview />
              </div>
            </div>
            <AureliaProductTour />
            {sections.slice(1)}
          </>
        ) : (
          children
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
