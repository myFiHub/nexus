import { CookieKeys } from "app/lib/cookies";
import { getServerCookie } from "app/lib/server-cookies";
import { AppLink } from ".";
import { UserLinkProps } from "./userLink";

interface UserLinkServerProps extends UserLinkProps {
  myUserId: string | undefined;
}

const Content = ({ id, myUserId, ...props }: UserLinkServerProps) => {
  const isMyUser = myUserId === id;
  if (isMyUser) {
    return <AppLink href={`/profile`} {...props} />;
  }
  return <AppLink href={`/user/${id}`} {...props} />;
};

export const UserLinkServer = async ({ id, ...props }: UserLinkProps) => {
  const myUserId = await getServerCookie(CookieKeys.myUserId);
  return <Content id={id} {...props} myUserId={myUserId} />;
};
