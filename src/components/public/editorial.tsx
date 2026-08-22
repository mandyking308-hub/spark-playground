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
    return 22 + Math.abs(wave) * 70;
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
