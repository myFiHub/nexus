import UserLink from "app/components/AppLink/userLink";
import { CopyButton } from "app/components/copyButton";
import { FollowButton } from "app/containers/_users/components/followButton";
import { truncate } from "app/lib/utils";
import { User } from "lucide-react";
import { Img } from "../../../../components/Img";
import { LiveMember } from "../../../../services/api/types";

interface MemberCardProps {
  member: LiveMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <Img
          src={member.image}
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
          noRouterRefresh
          followed={member.followed_by_me ?? false}
          address={member.address}
          noScale
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
}
