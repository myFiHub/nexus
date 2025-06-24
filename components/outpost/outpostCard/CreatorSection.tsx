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
    <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <Img
            src={outpost.creator_user_image || logoUrl}
            alt={outpost.creator_user_name}
            className="w-10 h-10 rounded-full border-2 border-border"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground line-clamp-1">
            {outpost.creator_user_name}
          </h4>
          <p className="text-xs text-muted-foreground font-mono">
            {truncate(creatorUUid)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {outpost.tags && outpost.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {outpost.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
          {outpost.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              +{outpost.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
