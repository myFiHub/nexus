"use client";
import { CheerBooAmountDialogProvider } from "app/components/Dialog/cheerBooAmountDialog";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectUsersSlice } from "../_users/slice";
import { GlobalSelectors } from "../global/selectors";
import { OutpostHeader } from "./components/header";
import { RecordingIndicator } from "./components/header/RecordingIndicator";
import { LoginState } from "./components/LoginState";
import { Meet } from "./components/meet";
import { OngoingOutpostSkeleton } from "./components/OngoingOutpostSkeleton";
import { WaitingForCreator } from "./components/waitingForCreator";
import { OngoingOutpostTutorial } from "./tutorial/OngoingOutpostTutorial";
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions, injectOnGoingOutpostSlice } from "./slice";
import { injectAssetsSlice } from "../_assets/slice";
import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { useClock } from "app/lib/clock";
import { shouldWaitForCreator as checkShouldWaitForCreator } from "./utils/shouldWaitForCreator";

const Content = () => {
  injectUsersSlice();
  injectAssetsSlice();
  injectOnGoingOutpostSlice();
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

  const shouldWaitForCreator = useClock(
    (now) =>
      !!outpost && now !== null && !!checkShouldWaitForCreator({ outpost, now })
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
        <OngoingOutpostTutorial />
        <RecordingIndicator />
      </motion.div>
    </div>
  );
};

export const OngoingOutpost = () => {
  return (
    <>
      <RouteLoaderCleaner />
      <Content />
    </>
  );
};
