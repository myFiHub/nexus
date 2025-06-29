import { Img } from "app/components/Img";
import { localLogoUrl } from "app/lib/constants";
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
    <div className="relative w-full h-48">
      <Img
        src={outpost.image || localLogoUrl}
        alt={outpost.name}
        className="w-full h-full object-cover"
      />
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Action buttons positioned at top-left */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <DetailsButton outpost={outpost} />
        <Tags outpost={outpost} />
        {outpost.luma_event_id && (
          <LumaEventIndicator eventId={outpost.luma_event_id} />
        )}
      </div>

      {/* Members and online users info positioned at top-right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <MembersBadge membersCount={outpost.members_count} />
        <OnlineUsersIndicator outpost={outpost} />
      </div>
    </div>
  );
}
