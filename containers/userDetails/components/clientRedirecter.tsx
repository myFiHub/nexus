"use client";

import { AppPages } from "app/lib/routes";
import { ReduxProvider } from "app/store/Provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GlobalSelectors } from "../../global/selectors";

const Content = ({ id }: { id: string }) => {
  const router = useRouter();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  useEffect(() => {
    if (myUser?.uuid === id || myUser?.aptos_address === id) {
      //   redirect to profile page
      router.replace(AppPages.profile);
    }
  }, [myUser]);

  return <></>;
};

export const ClientRedirecter = ({ id }: { id: string }) => {
  return (
    <ReduxProvider>
      <Content id={id} />
    </ReduxProvider>
  );
};
