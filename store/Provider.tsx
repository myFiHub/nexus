"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { getStore } from "./index";

interface ProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ProviderProps) {
  return <Provider store={getStore()}>{children}</Provider>;
}
