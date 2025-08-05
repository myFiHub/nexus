"use client";
import { DateTimePickerDialogProvider } from "app/components/Calendar/date-time";
import {
  BuyOrSellPassDialogProvider,
  LoginPromptDialogProvider,
  LoginSelectionDialogProvider,
  LogoutDialogProvider,
  LumaUserDialogProvider,
  NameDialogProvider,
  PodiumPassTradeDialogProvider,
  PromptNotificationsDialogProvider,
  ReferrerDialogProvider,
  SearchDialogProvider,
  UserSelectDialogProvider,
} from "app/components/Dialog";
import { ConfirmDialogProvider } from "app/components/Dialog/confirmDialog";
import { ReminderDialogProvider } from "app/components/Dialog/reminder";
import { UserSelectToInviteDialogProvider } from "app/components/Dialog/userSelectToInvite";
import { Toaster } from "app/components/toast";
import { OutpostAccessesDialogProvider } from "app/containers/_assets/outpostAccessesDialog";
import { ReduxProvider } from "app/store/Provider";
import { useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNotificationsSlice } from "../notifications/slice";
import { GlobalSelectors } from "./selectors";
import { globalActions, useGlobalSlice } from "./slice";

const Container = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialized = useSelector(GlobalSelectors.initialized);
  useGlobalSlice();
  useNotificationsSlice();

  useEffect(() => {
    dispatch(globalActions.getMovePrice());
    if (router) {
      dispatch(globalActions.setRouter(router));
    }
  }, [router, dispatch]);

  useEffect(() => {
    dispatch(globalActions.startTicker());
    if (!initialized && window.location.pathname !== "/playground") {
      dispatch(globalActions.initializeWeb3Auth());
    }
  }, []);
  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <ConfirmDialogProvider />
      <ReferrerDialogProvider />
      <NameDialogProvider />
      <UserSelectDialogProvider />
      <SearchDialogProvider />
      <OutpostAccessesDialogProvider />
      <DateTimePickerDialogProvider />
      <ReminderDialogProvider />
      <LumaUserDialogProvider />
      <UserSelectToInviteDialogProvider />
      <BuyOrSellPassDialogProvider />
      <LogoutDialogProvider />
      <PromptNotificationsDialogProvider />
      <LoginPromptDialogProvider />
      <LoginSelectionDialogProvider />
      <PodiumPassTradeDialogProvider />
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
