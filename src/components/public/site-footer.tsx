import { Link } from "@tanstack/react-router";

import { AureliaLogo } from "@/components/brand/aurelia-logo";
import { productLinks, audienceLinks, trustLinks, companyLinks } from "@/config/public-nav";

const columns = [
  { title: "Explore", links: productLinks },
  { title: "Audiences", links: audienceLinks },
  { title: "Trust & legal", links: trustLinks },
  { title: "Company", links: companyLinks },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2.6fr]">
          <div>
            <AureliaLogo tagline="Create · Learn · Achieve" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A protected global creation, learning and achievement world for under-16s — and a
              separate environment for members aged 16 and over.
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Aurelia World is operated by <strong className="font-medium text-foreground">Global Solutions Management LLC</strong>, a Delaware limited liability company.
            </p>
            <p className="mt-4 text-sm">
              <Link
                to="/report-concern"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Report a concern
              </Link>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  {column.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Global Solutions Management LLC. Aurelia World. All rights reserved.</p>
          <p className="max-w-xl">
            Child safety and privacy are designed into the service. Legal and regulatory documents are maintained for qualified counsel review and jurisdiction-specific launch requirements.
          </p>
        </div>
      </div>
    </footer>
  );
}
