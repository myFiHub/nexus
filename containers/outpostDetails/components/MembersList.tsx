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
        <h2 className="text-2xl font-semibold">Members</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outpost.members.map((member) => (
          <div
            key={member.uuid}
            className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-background/80 transition-colors shadow-sm dark:shadow-none"
          >
            <Img
              src={member.image || logoUrl}
              alt={member.name}
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
            <div className="flex flex-col gap-1">
              <UserLink
                id={member.uuid}
                className="font-medium m-0 p-0 h-fit text-base text-card-foreground"
              >
                {member.name}
              </UserLink>
              <FollowButton
                id={member.uuid}
                followed={member.followed_by_me ?? false}
                address={member.address}
                size="xxs"
                className="max-h-[24px]  "
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {member.is_present && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Online
                  </span>
                )}
                {member.can_speak && (
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Can Speak
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
