"use client";
import { ConfirmDialogProvider } from "app/components/Dialog/confirmDialog";
import { Toaster } from "app/components/toast";
import { OutpostAccessesDialogProvider } from "app/containers/_assets/outpostAccessesDialog";
import { ReduxProvider } from "app/store/Provider";
import { useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "./selectors";
import { globalActions, useGlobalSlice } from "./slice";

const Container = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialized = useSelector(GlobalSelectors.initialized);
  useGlobalSlice();

  useEffect(() => {
    if (router) {
      dispatch(globalActions.setRouter(router));
    }
  }, [router]);

  useEffect(() => {
    dispatch(globalActions.startTicker());
    if (!initialized) {
      dispatch(globalActions.initialize());
    }
  }, []);
  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <ConfirmDialogProvider />
      <OutpostAccessesDialogProvider />
    </>
  );
};

export const GlobalContainer = memo(
  () => {
    return (
      <ReduxProvider>
        <Container />
      </ReduxProvider>
    );
  },
  () => true
);
