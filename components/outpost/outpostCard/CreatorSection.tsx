import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";

interface CreatorSectionProps {
  outpost: OutpostModel;
}

export function CreatorSection({ outpost }: CreatorSectionProps) {
  const creatorUUid = outpost.creator_user_uuid;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground min-h-[1.5rem]">
      <div className="w-6 h-6 rounded-full ring-1 ring-border/50 overflow-hidden flex-shrink-0">
        <Img
          src={outpost.creator_user_image || logoUrl}
          alt={outpost.creator_user_name}
          className="w-full h-full object-cover"
          useImgTag
        />
      </div>

      <UserLink
        underline={false}
        id={creatorUUid}
        className="p-0 m-0 flex-1 min-w-0"
      >
        <span className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
          {outpost.creator_user_name}
        </span>
      </UserLink>

      <span className="text-xs opacity-60 flex-shrink-0">•</span>

      <span className="text-xs font-mono flex-shrink-0">
        {truncate(creatorUUid)}
      </span>
    </div>
  );
}
