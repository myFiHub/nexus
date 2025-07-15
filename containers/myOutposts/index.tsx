"use client";

import { ReduxProvider } from "app/store/Provider";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { LoginPrompt } from "./components/LoginPrompt";
import { InfiniteScrollOutpostsList } from "./InfiniteScrollOutpostsList";
import { myOutpostsActions, useMyOutpostsSlice } from "./slice";

const Content = () => {
  const dispatch = useDispatch();
  useMyOutpostsSlice();

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
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
