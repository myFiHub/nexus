"use client";
import { ConfirmDialogProvider } from "app/components/Dialog/confirmDialog";
import { Toaster } from "app/components/toast";
import { ReduxProvider } from "app/store/Provider";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "./selectors";
import { globalActions, useGlobalSlice } from "./slice";

const Container = () => {
  const dispatch = useDispatch();
  const initialized = useSelector(GlobalSelectors.initialized);
  useGlobalSlice();
  useEffect(() => {
    if (!initialized) {
      dispatch(globalActions.initialize());
    }
  }, []);
  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <ConfirmDialogProvider />
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
