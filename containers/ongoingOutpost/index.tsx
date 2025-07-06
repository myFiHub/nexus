"use client";
import { CheerBooAmountDialogProvider } from "app/components/Dialog/cheerBooAmountDialog";
import { User } from "app/services/api/types";
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
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions, useOnGoingOutpostSlice } from "./slice";

const OngoingOutpostContent = ({
  myUser,
  loading,
}: {
  myUser?: User;
  loading: boolean;
}) => {
  useUsersSlice();
  if (loading) {
    return <OngoingOutpostSkeleton />;
  }
  if (!myUser) {
    return <LoginState />;
  }
  return (
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
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
          />
          <p className="text-lg font-medium text-foreground">
            Joining outpost...
          </p>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="container !max-w-full px-4 py-8">
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
