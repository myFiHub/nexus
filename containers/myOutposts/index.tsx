"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { LoginPrompt } from "./components/LoginPrompt";
import { InfiniteScrollOutpostsList } from "./InfiniteScrollOutpostsList";
import { myOutpostsActions, injectMyOutpostsSlice } from "./slice";
import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";

const Content = () => {
  const dispatch = useDispatch();
  injectMyOutpostsSlice();

  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    if (myUser) {
      dispatch(myOutpostsActions.getOutposts());
    }
  }, [myUser]);

  return (
    <AnimatePresence mode="wait">
      {!myUser ? (
        <motion.div
          key="login-prompt"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <LoginPrompt />
        </motion.div>
      ) : (
        <InfiniteScrollOutpostsList />
      )}
    </AnimatePresence>
  );
};

export const MyOutposts = () => {
  return (
    <>
      <RouteLoaderCleaner />
      <Content />
    </>
  );
};
