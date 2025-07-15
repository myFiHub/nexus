import { AppPages } from "app/lib/routes";
import { AppLink, type AppLinkProps } from "./index";

export interface UserLinkProps extends Omit<AppLinkProps, "href"> {
  id: string;
}

export const UserLink = ({ id, ignore, children, ...props }: UserLinkProps) => {
  if (ignore) {
    return <>{children}</>;
  }
  return (
    <AppLink href={AppPages.userDetails(id)} {...props}>
      {children}
    </AppLink>
  );
};

export default UserLink;
