import { AppLink, type AppLinkProps } from "./index";

interface OutpostLinkProps extends Omit<AppLinkProps, "href"> {
  id: string;
}

export const OutpostLink = ({ id, ...props }: OutpostLinkProps) => {
  return <AppLink href={`/outpost_details/${id}`} {...props} />;
};

export default OutpostLink;
