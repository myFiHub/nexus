"use client";
import { OutpostModel, User } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { Meet } from "./components/meet";
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions, useOnGoingOutpostSlice } from "./slice";

const OngoingOutpostContent = ({
  outpost,
  myUser,
  loading,
}: {
  outpost?: OutpostModel;
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
    <div>
      <Meet />
    </div>
  );
};

const Content = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  useOnGoingOutpostSlice();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const gettingMyUser = useSelector(GlobalSelectors.logingIn);
  const isGettingOutpost = useSelector(
    onGoingOutpostSelectors.isGettingOutpost
  );
  const loading = gettingMyUser || isGettingOutpost;
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  useEffect(() => {
    if (myUser && !outpost) {
      dispatch(onGoingOutpostActions.getOutpost({ id: id as string }));
    }
  }, [id, myUser]);
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <OngoingOutpostContent
        outpost={outpost}
        myUser={myUser}
        loading={loading}
      />
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
