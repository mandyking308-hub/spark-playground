import { cn } from "@/lib/utils";

/**
 * Aurelia brand mark.
 *
 * A stylised "A" formed by two rising rays, a dawn spark at the apex and a
 * horizon arc as the crossbar. Designed to stay legible at 16px.
 */
export function AureliaMark({
  className,
  tone = "brand",
  title,
}: {
  className?: string;
  /** brand = gold spark on ink strokes, mono = inherits currentColor */
  tone?: "brand" | "mono" | "inverse";
  title?: string;
}) {
  const spark =
    tone === "brand" ? "var(--color-gold)" : tone === "inverse" ? "var(--color-gold)" : "currentColor";
  const strokes =
    tone === "brand"
      ? "var(--color-ink)"
      : tone === "inverse"
        ? "var(--color-ink-foreground)"
        : "currentColor";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="16" cy="6.6" r="3.4" fill={spark} />
      <g
        fill="none"
        stroke={strokes}
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.3 26 L13.9 12.6" />
        <path d="M24.7 26 L18.1 12.6" />
      </g>
      <path
        d="M10.6 19.6 Q16 23 21.4 19.6"
        fill="none"
        stroke={spark}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AureliaLogo({
  className,
  tone = "brand",
  showWordmark = true,
  tagline,
}: {
  className?: string;
  tone?: "brand" | "mono" | "inverse";
  showWordmark?: boolean;
  tagline?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AureliaMark tone={tone} title="Aurelia" className="size-8 shrink-0" />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-tight">Aurelia</span>
          {tagline ? (
            <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
