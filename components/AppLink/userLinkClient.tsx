"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";
import { AppLink } from ".";
import { UserLinkProps } from "./userLink";

const Content = ({ id, ...props }: UserLinkProps) => {
  const myUserId = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = myUserId?.uuid === id;
  if (isMyUser) {
    return <AppLink href={`/profile`} {...props} />;
  }
  return <AppLink href={`/user/${id}`} {...props} />;
};

export const UserLinkClient = ({ id, ...props }: UserLinkProps) => {
  return (
    <ReduxProvider>
      <Content id={id} {...props} />
    </ReduxProvider>
  );
};
