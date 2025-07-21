"use client";
import { CheerBooAmountDialogProvider } from "app/components/Dialog/cheerBooAmountDialog";
import { ReduxProvider } from "app/store/Provider";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUsersSlice } from "../_users/slice";
import { GlobalSelectors } from "../global/selectors";
import { OutpostHeader } from "./components/header";
import { RecordingIndicator } from "./components/header/RecordingIndicator";
import { LoginState } from "./components/LoginState";
import { Meet } from "./components/meet";
import { OngoingOutpostSkeleton } from "./components/OngoingOutpostSkeleton";
import { WaitingForCreator } from "./components/waitingForCreator";
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions, useOnGoingOutpostSlice } from "./slice";

const Content = () => {
  useUsersSlice();
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

  const shouldWaitForCreator = useSelector(
    onGoingOutpostSelectors.shouldWaitForCreator
  );
  useEffect(() => {
    return () => {
      dispatch(onGoingOutpostActions.setOutpost(undefined));
    };
  }, []);

  useEffect(() => {
    if (myUser && outpost?.uuid) {
      dispatch(onGoingOutpostActions.waitForCreator(true));
    }
    if (myUser && !outpost?.uuid) {
      dispatch(onGoingOutpostActions.getOutpost({ id: id as string }));
    }
  }, [id, myUser, outpost]);

  if (!myUser?.uuid) {
    return <LoginState />;
  }

  if (
    loading ||
    !outpost ||
    (joiningOutpostId !== undefined && joiningOutpostId === outpost?.uuid)
  ) {
    return <OngoingOutpostSkeleton className="mt-4" />;
  }

  // Show waiting for creator screen if creator hasn't joined yet
  if (shouldWaitForCreator) {
    return <WaitingForCreator outpost={outpost} />;
  }

  return (
    <div className="container !max-w-full px-4 py-8">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CheerBooAmountDialogProvider />
        <OutpostHeader />
        <Meet />
        <RecordingIndicator />
      </motion.div>
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
