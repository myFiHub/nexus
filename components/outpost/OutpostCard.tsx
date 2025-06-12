import { logoUrl } from "../../lib/constants";
import { OutpostModel } from "../../services/api/types";
import { Img } from "../Img";

interface OutpostCardProps {
  outpost: OutpostModel;
}

export function OutpostCard({ outpost }: OutpostCardProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative w-full">
        <Img
          src={outpost.image || logoUrl}
          alt={outpost.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-[var(--primary)] line-clamp-1">
          {outpost.name}
        </h3>
        <p className="text-[var(--muted-foreground)] mb-4 line-clamp-2 flex-1">
          {outpost.subject}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <Img
            src={outpost.creator_user_image || logoUrl}
            alt={outpost.creator_user_name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-[var(--muted-foreground)] line-clamp-1">
            {outpost.creator_user_name}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            {outpost.members_count || 0} members
          </span>
        </div>
      </div>
    </div>
  );
}
