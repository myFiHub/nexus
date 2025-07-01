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
    <div className="mb-2 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Img
            src={outpost.creator_user_image || logoUrl}
            alt={outpost.creator_user_name}
            className="w-10 h-10 rounded-full border-2 border-border"
            useImgTag
          />
          {/* Online indicator */}
        </div>
        <div className="flex-1 min-w-0">
          <UserLink underline={false} id={creatorUUid} className="p-0 m-0">
            <h4 className="font-semibold text-foreground line-clamp-1">
              {outpost.creator_user_name}
            </h4>
          </UserLink>
          <p className="text-xs text-muted-foreground font-mono">
            {truncate(creatorUUid)}
          </p>
        </div>
      </div>
    </div>
  );
}
