"use client";
import { Toaster } from "app/components/toast";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useExternalWalletSlice } from "../_externalWallets/slice";
import { useNotificationsSlice } from "../notifications/slice";
import { GlobalSelectors } from "./selectors";
import { globalActions, useGlobalSlice } from "./slice";

const GlobalUi = dynamic(() => import("./GlobalUi"), { ssr: false });

const Container = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialized = useSelector(GlobalSelectors.initialized);
  useGlobalSlice();
  useNotificationsSlice();
  useExternalWalletSlice();

  useEffect(() => {
    dispatch(globalActions.getMovePrice());
    if (router) {
      dispatch(globalActions.setRouter(router));
    }
  }, [router, dispatch]);

  useEffect(() => {
    if (!initialized && window.location.pathname !== "/playground") {
      dispatch(globalActions.initializeWeb3Auth());
    }
  }, []);
  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <GlobalUi />
    </>
  );
};

export const GlobalContainer = memo(Container, () => true);
