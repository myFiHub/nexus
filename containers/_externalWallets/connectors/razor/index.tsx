"use client";
import {
  BitgetWallet,
  LeapWallet,
  NightlyWallet,
  OkxWallet,
  RazorWallet as RW,
} from "@razorlabs/razorkit";
import "@razorlabs/razorkit/style.css";
import dynamic from "next/dynamic";

export const WalletProvider = dynamic(
  () =>
    import("@razorlabs/razorkit").then((mod) => ({
      default: mod.WalletProvider,
    })),
  { ssr: false, loading: () => <></> }
);

const App = dynamic(() => import("./injector"), {
  ssr: false,
  loading: () => <></>,
});
export const RazorWallet = () => {
  return (
    <WalletProvider
      defaultWallets={[
        // order defined by you
        RW,
        BitgetWallet,
        NightlyWallet,
        OkxWallet,
        LeapWallet,
        // ...
      ]}
    >
      <App />
    </WalletProvider>
  );
};

const CButton = dynamic(() => import("./connectWithRazorButton"), {
  ssr: false,
  loading: () => <></>,
});

export const RazorConnectButton = () => {
  return (
    <WalletProvider>
      <CButton />
    </WalletProvider>
  );
};
