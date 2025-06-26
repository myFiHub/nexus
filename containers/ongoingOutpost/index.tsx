"use client";
import { User } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { OutpostHeader } from "./components/header";
import { Meet } from "./components/meet";
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions, useOnGoingOutpostSlice } from "./slice";

const OngoingOutpostContent = ({
  myUser,
  loading,
}: {
  myUser?: User;
  loading: boolean;
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!myUser) {
    return <div>Please login to view this page</div>;
  }
  return (
    <div className="space-y-6">
      <OutpostHeader />
      <Meet />
    </div>
  );
};

const Content = () => {
  useOnGoingOutpostSlice();
  const dispatch = useDispatch();
  const { id } = useParams();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const gettingMyUser = useSelector(GlobalSelectors.logingIn);
  const isGettingOutpost = useSelector(
    onGoingOutpostSelectors.isGettingOutpost
  );
  const loading = gettingMyUser || isGettingOutpost;
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const joiningOutpostId = useSelector(GlobalSelectors.joiningOutpostId);
  useEffect(() => {
    if (myUser && !outpost) {
      dispatch(onGoingOutpostActions.getOutpost({ id: id as string }));
    }
  }, [id, myUser]);
  if (joiningOutpostId !== undefined && joiningOutpostId === outpost?.uuid) {
    return <div>Joining outpost...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <OngoingOutpostContent myUser={myUser} loading={loading} />
    </div>
  );
};

export const OngoingOutpost = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
