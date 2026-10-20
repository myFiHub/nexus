import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { cn } from "app/lib/utils";
import { CSSProperties, ReactNode } from "react";

export const SectionHeader = ({
  title,
  count,
  trailing,
  className,
}: {
  title: ReactNode;
  count?: number;
  trailing?: ReactNode;
  className?: string;
}) => (
  <div className={cn("mb-3 flex items-center gap-2", className)}>
    <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
    {count !== undefined && count > 0 && (
      <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs font-semibold text-text-muted tabular-nums">
        {count}
      </span>
    )}
    {trailing && <div className="ml-auto flex items-center">{trailing}</div>}
  </div>
);

/** Horizontal, snap-scrolling list. Children should set their own width. */
export const Rail = ({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) => (
  <div
    role="list"
    aria-label={label}
    className={cn(
      "invisible-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1",
      className
    )}
  >
    {children}
  </div>
);

export const RailItem = ({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) => (
  <div
    role="listitem"
    className={cn("animate-entrance shrink-0 snap-start", className)}
    style={{ "--i": Math.min(index, 6) } as CSSProperties}
  >
    {children}
  </div>
);

export type Tone = "accent" | "violet" | "magenta" | "success" | "warning" | "danger";

const toneVar: Record<Tone, string> = {
  accent: "var(--p-accent)",
  violet: "var(--p-violet)",
  magenta: "var(--p-magenta)",
  success: "var(--p-success)",
  warning: "var(--p-warning)",
  danger: "var(--p-danger)",
};

export const toneStyle = (tone: Tone, alpha = 16): CSSProperties => ({
  color: toneVar[tone],
  background: `color-mix(in oklab, ${toneVar[tone]} ${alpha}%, transparent)`,
});

export const Pill = ({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-0.5 text-[11px] font-bold",
      className
    )}
    style={toneStyle(tone)}
  >
    {children}
  </span>
);

export const IconTile = ({
  children,
  tone = "accent",
  size = 34,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: number;
}) => (
  <span
    className="inline-flex shrink-0 items-center justify-center rounded-[12px]"
    style={{ ...toneStyle(tone, 18), width: size, height: size }}
  >
    {children}
  </span>
);

export const LiveDot = ({ className }: { className?: string }) => (
  <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--p-danger)] opacity-60" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--p-danger)]" />
  </span>
);

export const AvatarStack = ({
  people,
  size = 20,
  max = 3,
}: {
  people: { image?: string | null; name?: string | null }[];
  size?: number;
  max?: number;
}) => (
  <span className="flex shrink-0 -space-x-1.5">
    {people.slice(0, max).map((person, i) => (
      <span
        key={i}
        className="overflow-hidden rounded-full ring-2 ring-[var(--p-surface)]"
        style={{ width: size, height: size }}
        title={person.name ?? undefined}
      >
        <Img
          src={person.image || undefined}
          alt={person.name || "Listener"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
    ))}
  </span>
);

export const OutpostThumb = ({
  image,
  name,
  size = 56,
  className,
}: {
  image?: string | null;
  name: string;
  size?: number;
  className?: string;
}) => (
  <span
    className={cn("relative block shrink-0 overflow-hidden rounded-[14px] bg-surface-raised", className)}
    style={{ width: size, height: size }}
  >
    <Img
      src={image || logoUrl}
      alt={name}
      width={size}
      height={size}
      sizes={`${size}px`}
      className="h-full w-full object-cover"
    />
  </span>
);

/** Glass card wrapper; pass `interactive` for hover lift + press scale. */
export const GlassCard = ({
  children,
  className,
  interactive,
  style,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  style?: CSSProperties;
}) => (
  <div
    className={cn(
      "glass-card",
      interactive &&
        "press transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--p-accent)_45%,transparent)]",
      className
    )}
    style={style}
  >
    {children}
  </div>
);

export const Skeleton = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <div className={cn("animate-pulse rounded-[14px] bg-surface-raised/70", className)} style={style} />
);
