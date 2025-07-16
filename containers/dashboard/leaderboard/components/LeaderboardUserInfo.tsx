import UserLink from "app/components/AppLink/userLink";
import { truncate } from "app/lib/utils";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";

export const LeaderboardUserInfo = ({
  user,
}: {
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld;
}) => (
  <div className="flex flex-col">
    <span className="font-semibold text-[var(--card-foreground)] leading-tight">
      <UserLink
        id={user.podium_pass_owner_uuid}
        underline={false}
        ignore={!user.podium_pass_owner_uuid}
        className="p-0 h-4"
      >
        {user.podium_pass_owner_name ?? "External user"}
      </UserLink>
    </span>
    <span className="text-xs text-[var(--muted-foreground)]">
      {truncate(user.podium_pass_owner_address, 10)}
    </span>
  </div>
);
