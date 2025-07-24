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
    <UserLink
      underline={false}
      id={creatorUUid}
      className="p-0 m-0 w-full group/creator"
    >
      <div className="bg-muted/30 rounded-lg p-3 border border-border/40 w-full hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full ring-2 ring-border/50 overflow-hidden flex-shrink-0">
            <Img
              src={outpost.creator_user_image || logoUrl}
              alt={outpost.creator_user_name}
              className="w-full h-full object-cover"
              useImgTag
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground line-clamp-1 group-hover/creator:text-primary transition-colors">
              {outpost.creator_user_name}
            </h4>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              ID:{truncate(creatorUUid)}
            </p>
          </div>
        </div>
      </div>
    </UserLink>
  );
}
