import { Button } from "app/components/Button";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { OutpostCardActions } from "./actions";

interface OutpostCardProps {
  outpost: OutpostModel;
}

export function OutpostCard({ outpost }: OutpostCardProps) {
  const creatorId = outpost.creator_user_uuid;

  return (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-[var(--border)]">
      {/* Image Section */}
      <div className="relative w-full h-48">
        <Img
          src={outpost.image || logoUrl}
          alt={outpost.name}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Members count badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          {outpost.members_count || 0} members
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Subject */}
        <h3 className="text-xl font-bold mb-2 text-[var(--primary)] line-clamp-1">
          {outpost.name}
        </h3>
        <p className="text-[var(--muted-foreground)] mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
          {outpost.subject}
        </p>

        {/* Creator Information Section */}
        <div className="mb-4 p-3 bg-[var(--muted)]/30 rounded-lg border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Img
                src={outpost.creator_user_image || logoUrl}
                alt={outpost.creator_user_name}
                className="w-10 h-10 rounded-full border-2 border-[var(--border)]"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--card-bg)]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[var(--foreground)] line-clamp-1">
                {outpost.creator_user_name}
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] font-mono">
                {truncate(creatorId)}
              </p>
            </div>
          </div>

          {/* Tags */}
          {outpost.tags && outpost.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {outpost.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
              {outpost.tags.length > 3 && (
                <span className="px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)] text-xs rounded-md">
                  +{outpost.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <OutpostCardActions outpost={outpost} />
      </div>
    </div>
  );
}
