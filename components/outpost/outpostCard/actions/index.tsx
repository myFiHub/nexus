"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { JoinButton } from "app/containers/outpostDetails/components/JoinButton";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { ArchiveButton } from "./archiveButton";
import { LeaveButton } from "./leaveButton";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  if (!myUser) {
    return <div className="h-12 w-full" />;
  }

  return (
    <motion.div
      className="flex gap-3 mt-auto"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex-1">
        <JoinButton outpost={outpost} fromCard={true} />
      </div>
      <div className="flex gap-2">
        <LeaveButton outpost={outpost} />
        <ArchiveButton outpost={outpost} />
      </div>
    </motion.div>
  );
};

export const OutpostCardActions = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
