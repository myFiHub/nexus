import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";
import { DetailsButton } from "./detailsButton";
import { LumaEventIndicator } from "./LumaEventIndicator";
import { MembersBadge } from "./MembersBadge";
import { OnlineUsersIndicator } from "./OnlineUsersIndicator";
import { Tags } from "./tags";

interface ImageSectionProps {
  outpost: OutpostModel;
}

export function ImageSection({ outpost }: ImageSectionProps) {
  return (
    <div className="relative w-full h-52 overflow-hidden rounded-t-xl">
      <Img
        src={outpost.image || logoUrl}
        alt={outpost.name}
        className="w-full h-full object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Simple overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Action buttons */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <DetailsButton outpost={outpost} />
        {outpost.tags && outpost.tags.length > 0 && <Tags outpost={outpost} />}
        {outpost.luma_event_id && outpost.luma_event_id.trim() !== "" && (
          <LumaEventIndicator eventId={outpost.luma_event_id} />
        )}
      </div>

      {/* Members and online users info */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <div className="bg-background/90 rounded-md border border-border/50 p-2">
          <MembersBadge membersCount={outpost.members_count} />
        </div>
        <div className="bg-background/90 rounded-md border border-border/50 p-2">
          <OnlineUsersIndicator outpost={outpost} />
        </div>
      </div>
    </div>
  );
}
