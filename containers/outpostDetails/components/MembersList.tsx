import UserLink from "app/components/AppLink/userLink";
import { CopyButton } from "app/components/copyButton";
import { FollowButton } from "app/containers/_users/components/followButton";
import { truncate } from "app/lib/utils";
import { User, Users } from "lucide-react";
import { Img } from "../../../components/Img";
import { logoUrl } from "../../../lib/constants";
import { OutpostModel } from "../../../services/api/types";

interface MembersListProps {
  outpost: OutpostModel;
}

export function MembersList({ outpost }: MembersListProps) {
  if (!outpost.members || outpost.members.length === 0) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            Members ({outpost.members.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Community participants
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {outpost.members.map((member) => (
          <div
            key={member.uuid}
            className="group flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
          >
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <Img
                src={member.image || logoUrl}
                alt={member.name}
                className="w-12 h-12 rounded-full border-2 border-primary/20 shadow-sm"
                useImgTag
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <UserLink
                  id={member.uuid}
                  className="font-semibold text-base text-foreground hover:text-primary transition-colors"
                >
                  {member.name}
                </UserLink>
              </div>

              {member.aptos_address && (
                <div className="flex items-center gap-0 mb-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">
                    {truncate(member.aptos_address, 16)}
                  </span>
                  <CopyButton text={member.aptos_address} />
                </div>
              )}

              <FollowButton
                id={member.uuid}
                followed={member.followed_by_me ?? false}
                address={member.address}
                size="sm"
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
