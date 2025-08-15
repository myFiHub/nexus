import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";

export const LeaderboardAvatar = ({
  user,
}: {
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld;
}) => (
  <UserLink
    id={user.podium_pass_owner_uuid}
    underline={false}
    ignore={!user.podium_pass_owner_uuid}
    className="p-0"
  >
    <Img
      src={user.podium_pass_owner_image}
      alt={user.podium_pass_owner_name ?? user.podium_pass_owner_address}
      useImgTag
      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
    />
  </UserLink>
);
