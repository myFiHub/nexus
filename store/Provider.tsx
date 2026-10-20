"use client";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { getStore } from "./index";

interface ProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ProviderProps) {
  const [store] = useState(getStore);
  return <Provider store={store}>{children}</Provider>;
}
