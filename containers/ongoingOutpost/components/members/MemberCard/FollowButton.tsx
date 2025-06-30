import { FollowButton } from "app/containers/_users/components/followButton";
import { LiveMember } from "app/services/api/types";

interface FollowButtonProps {
  member: LiveMember;
}

export const FollowUserButton = ({ member }: FollowButtonProps) => {
  return (
    <FollowButton
      id={member.uuid}
      followed={member.followed_by_me ?? false}
      address={member.address}
      size="xxs"
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
  );
};
