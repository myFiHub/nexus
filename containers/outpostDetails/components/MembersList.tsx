import UserLink from "app/components/AppLink/userLink";
import { FollowButton } from "app/containers/_users/components/followButton";
import { Mic, Users } from "lucide-react";
import { Img } from "../../../components/Img";
import { logoUrl } from "../../../lib/constants";
import { OutpostModel } from "../../../services/api/types";

interface MembersListProps {
  outpost: OutpostModel;
}

export function MembersList({ outpost }: MembersListProps) {
  if (!outpost.members || outpost.members.length === 0) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">
          Members ({outpost.members.length})
        </h3>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {outpost.members.map((member) => (
          <div
            key={member.uuid}
            className="flex items-center gap-3 p-2 rounded-lg bg-background hover:bg-background/80 transition-colors"
          >
            <Img
              src={member.image || logoUrl}
              alt={member.name}
              className="w-8 h-8 rounded-full border border-primary/20 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <UserLink
                id={member.uuid}
                className="font-medium text-sm text-card-foreground block truncate"
              >
                {member.name}
              </UserLink>
              <div className="flex items-center gap-2 mt-1">
                <FollowButton
                  id={member.uuid}
                  followed={member.followed_by_me ?? false}
                  address={member.address}
                  size="xxs"
                  className="max-h-[20px]"
                />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {member.is_present && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Online
                    </span>
                  )}
                  {member.can_speak && (
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      Speaker
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
