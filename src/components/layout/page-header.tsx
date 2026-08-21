import { Link } from "@tanstack/react-router";

interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  title,
  description,
  crumbs = [],
  eyebrow,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  eyebrow?: string;
}) {
  return (
    <header className="border-b border-border pb-6">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
