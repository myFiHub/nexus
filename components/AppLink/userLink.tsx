import { type AppLinkProps } from "./index";
import { UserLinkClient } from "./userLinkClient";
import { UserLinkServer } from "./userLinkServer";

export interface UserLinkProps extends Omit<AppLinkProps, "href"> {
  id: string;
}

export const UserLink = ({ id, ...props }: UserLinkProps) => {
  if (typeof window !== "undefined") {
    return <UserLinkClient id={id} {...props} />;
  }
  return <UserLinkServer id={id} {...props} />;
};

export default UserLink;
