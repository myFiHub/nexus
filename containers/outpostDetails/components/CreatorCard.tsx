import UserLink from "app/components/AppLink/userLink";
import { Users } from "lucide-react";
import { Img } from "../../../components/Img";
import { logoUrl } from "../../../lib/constants";
import { OutpostModel } from "../../../services/api/types";

interface CreatorCardProps {
  outpost: OutpostModel;
}

export function CreatorCard({ outpost }: CreatorCardProps) {
  return (
    <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="font-semibold text-lg flex items-center gap-2">
            <p>Hosted by </p>
            <Img
              src={outpost.creator_user_image || logoUrl}
              alt={outpost.creator_user_name}
              className="w-6 h-6 rounded-full border-1 border-primary"
            />
            <UserLink
              id={outpost.creator_user_uuid}
              className="font-semibold text-lg m-0 p-0 h-fit"
            >
              {outpost.creator_user_name}
            </UserLink>
          </div>
          <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
            <Users className="w-4 h-4" />
            <span>{outpost.members_count || 0} members</span>
            {outpost.online_users_count ? (
              <>
                <span>•</span>
                <span>{outpost.online_users_count} online</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            This event is organized by {outpost.creator_user_name}. Join to
            connect with other members and participate in the discussion.
          </p>
        </div>
      </div>
    </div>
  );
}
