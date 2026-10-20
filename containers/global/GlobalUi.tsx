"use client";
import { DateTimePickerDialogProvider } from "app/components/Calendar/date-time";
import {
  BuyOrSellPassDialogProvider,
  LoginPromptDialogProvider,
  LogoutDialogProvider,
  LumaUserDialogProvider,
  NameDialogProvider,
  PodiumPassTradeDialogProvider,
  PromptNotificationsDialogProvider,
  ReferrerDialogProvider,
  SearchDialogProvider,
  TransferBalanceDialogProvider,
  UserSelectDialogProvider,
} from "app/components/Dialog";
import { ConfirmDialogProvider } from "app/components/Dialog/confirmDialog";
import { LoginMethodSelectDialogProvider } from "app/components/Dialog/loginMethodSelect";
import { ReminderDialogProvider } from "app/components/Dialog/reminder";
import { UserSelectToInviteDialogProvider } from "app/components/Dialog/userSelectToInvite";
import { OutpostAccessesDialogProvider } from "app/containers/_assets/outpostAccessesDialog";
import { CohostsDialogProvider } from "app/containers/createOutpost/components/cohosts/dialog";
import { ExternalWallets } from "../_externalWallets";

/** Dialog hosts and wallet connectors; browser-only (wallet SDKs touch `window` on import). */
const GlobalUi = () => (
  <>
    <ExternalWallets />
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
    <PodiumPassTradeDialogProvider />
    <LoginMethodSelectDialogProvider />
    <TransferBalanceDialogProvider />
  </>
);

export default GlobalUi;
