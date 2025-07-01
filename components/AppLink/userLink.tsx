import { AppLink, type AppLinkProps } from "./index";

export interface UserLinkProps extends Omit<AppLinkProps, "href"> {
  id: string;
}

export const UserLink = ({ id, ...props }: UserLinkProps) => {
  return <AppLink href={`/user/${id}`} {...props} />;
};

export default UserLink;
