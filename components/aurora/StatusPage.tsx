import { GlassCard, IconTile, type Tone } from "app/components/aurora";
import type { ReactNode } from "react";

export const primaryActionClass =
  "btn-aurora press inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--p-on-accent)]";

export const secondaryActionClass =
  "press inline-flex items-center justify-center gap-2 rounded-full border border-[var(--p-border)] px-5 py-2.5 text-sm font-semibold hover:bg-surface-raised";

/** Centered glass card for not-found, error and empty route states. */
export const StatusPage = ({
  icon,
  tone = "accent",
  title,
  message,
  children,
}: {
  icon: ReactNode;
  tone?: Tone;
  title: string;
  message: ReactNode;
  children?: ReactNode;
}) => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-12">
    <GlassCard className="animate-entrance w-full p-8 text-center">
      <div className="mb-4 flex justify-center">
        <IconTile tone={tone} size={52}>
          {icon}
        </IconTile>
      </div>
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <div className="mb-6 text-sm text-[var(--p-text-muted)]">{message}</div>
      {children && (
        <div className="flex flex-col justify-center gap-3 sm:flex-row">{children}</div>
      )}
    </GlassCard>
  </div>
);
