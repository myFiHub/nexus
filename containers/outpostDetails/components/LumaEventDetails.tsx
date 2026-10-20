import { GlassCard, IconTile, Pill, Skeleton } from "app/components/aurora";
import { Img } from "app/components/Img";
import { getLumaEvent } from "app/services/api/luma/server";
import { CalendarDays, ExternalLink } from "lucide-react";

interface LumaEventDetailsProps {
  eventId: string;
}

/** Formats in the event's own timezone so server rendering is deterministic. */
const formatEventTime = (iso: string, timeZone?: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    timeZoneName: "short",
  };
  try {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(date);
  }
};

const Unavailable = () => (
  <GlassCard className="p-5 text-center text-sm text-[var(--p-text-muted)]">
    Luma event details are unavailable right now.
  </GlassCard>
);

export async function LumaEventDetails({ eventId }: LumaEventDetailsProps) {
  const eventData = await getLumaEvent(eventId);
  if (!eventData?.event) return <Unavailable />;

  const { event, hosts } = eventData;
  const start = formatEventTime(event.start_at, event.timezone);
  const end = formatEventTime(event.end_at, event.timezone);

  return (
    <GlassCard className="overflow-hidden">
      {event.cover_url && (
        <div className="relative h-40 w-full">
          <Img
            src={event.cover_url}
            alt={event.name}
            useImgTag
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <IconTile tone="violet">
            <CalendarDays className="h-4 w-4" />
          </IconTile>
          <div className="min-w-0 flex-1">
            <p className="label-caps text-[var(--p-text-muted)]">On Luma</p>
            <h3 className="truncate text-base font-bold">{event.name}</h3>
          </div>
          {event.visibility && (
            <Pill tone="accent" className="capitalize">
              {event.visibility}
            </Pill>
          )}
        </div>

        {event.description && (
          <p className="line-clamp-4 text-sm text-[var(--p-text-muted)]">
            {event.description}
          </p>
        )}

        {(start || end) && (
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {start && (
              <div>
                <dt className="label-caps text-[var(--p-text-muted)]">Starts</dt>
                <dd>{start}</dd>
              </div>
            )}
            {end && (
              <div>
                <dt className="label-caps text-[var(--p-text-muted)]">Ends</dt>
                <dd>{end}</dd>
              </div>
            )}
          </dl>
        )}

        {hosts && hosts.length > 0 && (
          <div>
            <p className="label-caps mb-2 text-[var(--p-text-muted)]">
              Hosts ({hosts.length})
            </p>
            <ul className="space-y-2">
              {hosts.map((host) => (
                <li key={host.api_id} className="flex items-center gap-3 text-sm font-medium">
                  {host.avatar_url && (
                    <Img
                      src={host.avatar_url}
                      alt={host.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full"
                      useImgTag
                    />
                  )}
                  {host.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-aurora press inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
          >
            Open on Luma
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </GlassCard>
  );
}

export const LumaEventDetailsSkeleton = () => (
  <GlassCard className="space-y-3 p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-[34px] w-[34px]" />
      <Skeleton className="h-5 w-1/2" />
    </div>
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </GlassCard>
);
