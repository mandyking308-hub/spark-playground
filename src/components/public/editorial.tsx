import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Editorial presentation primitives for the public marketing site.
 * Presentation only — no data, no backend behaviour.
 */

export function EditorialImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  ratio = "landscape",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  ratio?: "landscape" | "portrait" | "square" | "wide" | "free";
}) {
  const ratioClass =
    ratio === "portrait"
      ? "aspect-[3/4]"
      : ratio === "square"
        ? "aspect-square"
        : ratio === "wide"
          ? "aspect-[16/7]"
          : ratio === "free"
            ? ""
            : "aspect-[4/3]";

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-muted", ratioClass, className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={cn("size-full object-cover", imgClassName)}
      />
    </div>
  );
}

export function ProjectLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "brand-label inline-flex items-center gap-2 rounded-md border border-border/70 bg-card/95 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("brand-rule-gold block", className)} />;
}

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  label,
  ratio = "landscape",
  className,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  label?: string;
  ratio?: "landscape" | "portrait" | "square" | "wide" | "free";
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("relative", className)}>
      <EditorialImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        ratio={ratio}
        {...(priority ? { priority } : {})}
      />
      {label ? <ProjectLabel className="absolute start-4 top-4">{label}</ProjectLabel> : null}
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Full-bleed image band with an overlaid editorial panel. */
export function ImageBand({
  src,
  alt,
  width,
  height,
  children,
  className,
  align = "start",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  children?: ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-border/70", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
        <div className={cn("max-w-xl text-ink-foreground", align === "end" && "ms-auto")}>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Two-column editorial split: image on one side, prose on the other. */
export function SplitFeature({
  image,
  children,
  reverse = false,
  className,
}: {
  image: ReactNode;
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      <div className={cn(reverse && "lg:order-2")}>{image}</div>
      <div className={cn(reverse && "lg:order-1")}>{children}</div>
    </div>
  );
}

/** A paper-textured note with a tape accent — used for human, hand-made moments. */
export function PaperNote({
  children,
  className,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "lined";
}) {
  return (
    <div
      className={cn(
        "brand-paper relative rounded-lg border border-border/70 p-6 text-sm leading-relaxed text-muted-foreground",
        tone === "lined" && "brand-lined",
        className,
      )}
    >
      <span aria-hidden="true" className="brand-tape" />
      {children}
    </div>
  );
}

/** Small audio waveform strip — decorative texture for audio/podcast contexts. */
export function WaveformStrip({ className, bars = 42 }: { className?: string; bars?: number }) {
  const heights = Array.from({ length: bars }, (_, index) => {
    const wave = Math.sin(index * 0.7) * Math.cos(index * 0.23);
    return Math.round(22 + Math.abs(wave) * 70);
  });


  return (
    <span
      aria-hidden="true"
      className={cn("flex h-8 items-center gap-[3px] opacity-70", className)}
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className="w-[3px] rounded-full bg-gold"
          style={{ height: `${height}%` }}
        />
      ))}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-xl tracking-tight">{value}</dd>
    </div>
  );
}

/* --- Hero collage primitives (presentation only, local shapes + local assets) --- */

type GlyphName = "microphone" | "camera" | "pencil" | "notebook" | "prototype" | "controller";

/** Decorative line-drawn object glyph used in editorial collages. */
export function ObjectGlyph({
  name,
  className,
}: {
  name: GlyphName;
  className?: string;
}) {
  const paths: Record<GlyphName, ReactNode> = {
    microphone: (
      <>
        <rect x="9" y="2.5" width="6" height="11" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
        <path d="M12 18v3.5M8.5 21.5h7" />
      </>
    ),
    camera: (
      <>
        <path d="M3 7.5h4l1.5-2.5h7L17 7.5h4v12H3z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    pencil: (
      <>
        <path d="M4 20.5l1-4L16.5 5a2.1 2.1 0 0 1 3 3L8 19.5z" />
        <path d="M14.5 7L17.5 10" />
      </>
    ),
    notebook: (
      <>
        <path d="M6 3h13v18H6z" />
        <path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2" />
        <path d="M9.5 8.5h6M9.5 12h6M9.5 15.5h3.5" />
      </>
    ),
    prototype: (
      <>
        <path d="M4 8.5L12 4l8 4.5v7L12 20l-8-4.5z" />
        <path d="M4 8.5L12 13l8-4.5M12 13v7" />
      </>
    ),
    controller: (
      <>
        <path d="M7.5 8h9a5 5 0 0 1 5 5.4l-.3 3a2.6 2.6 0 0 1-4.6 1.4L15 16H9l-1.6 1.8a2.6 2.6 0 0 1-4.6-1.4l-.3-3A5 5 0 0 1 7.5 8z" />
        <path d="M7 11.5v3M5.5 13h3M15.5 12h.01M17.5 14h.01" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

/** Hand-drawn style gold marker underline. */
export function MarkerUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 12"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
      className={cn("block h-2.5 w-full text-gold", className)}
    >
      <path
        d="M3 8.5C48 3.5 108 2.5 217 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

/** A small pinned object detail card used inside the hero collage. */
export function DetailCard({
  glyph,
  label,
  title,
  children,
  className,
}: {
  glyph: GlyphName;
  label: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "brand-card rounded-2xl border border-border/70 bg-card/95 p-4 backdrop-blur",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <ObjectGlyph name={glyph} className="size-4 text-accent-foreground" />
        {label}
      </span>
      <p className="mt-2 font-display text-sm leading-snug tracking-tight">{title}</p>
      {children ? (
        <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}
