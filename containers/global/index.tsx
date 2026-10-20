"use client";
import { Toaster } from "app/components/toast";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { memo, useEffect, useRef } from "react";
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

  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const sessionActiveRef = useRef(false);
  useEffect(() => {
    sessionActiveRef.current = isLoggedIn && !logingIn;
  }, [isLoggedIn, logingIn]);

  useEffect(() => {
    podiumApi.onUnauthorized = () => {
      if (!sessionActiveRef.current) return;
      sessionActiveRef.current = false;
      toast.error("Your session expired. Please log in again.");
      dispatch(globalActions.logout());
    };
    return () => {
      podiumApi.onUnauthorized = undefined;
    };
  }, [dispatch]);

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
