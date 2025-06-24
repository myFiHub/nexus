import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";
import { DetailsButton } from "./detailsButton";
import { MembersBadge } from "./MembersBadge";

interface ImageSectionProps {
  outpost: OutpostModel;
}

export function ImageSection({ outpost }: ImageSectionProps) {
  return (
    <div className="relative w-full h-48">
      <Img
        src={outpost.image || logoUrl}
        alt={outpost.name}
        className="w-full h-full object-cover"
      />
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div>
        <DetailsButton outpost={outpost} />
      </div>
      <MembersBadge membersCount={outpost.members_count} />
    </div>
  );
}
