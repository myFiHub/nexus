"use client";
import "@razorlabs/razorkit/style.css";
import dynamic from "next/dynamic";
import React from "react";
import "./customStyles.css";

// Dynamic imports for all exports
export const WalletProvider = dynamic(
  () =>
    import("@razorlabs/razorkit").then((mod) => ({
      default: mod.WalletProvider,
    })),
  { ssr: false, loading: () => <></> }
);

// For wallet configurations, we'll import them lazily
let walletConfigs: any = null;

const loadWalletConfigs = async () => {
  if (!walletConfigs) {
    const mod = await import("@razorlabs/razorkit");
    walletConfigs = {
      BitgetWallet: mod.BitgetWallet,
      LeapWallet: mod.LeapWallet,
      NightlyWallet: mod.NightlyWallet,
      OkxWallet: mod.OkxWallet,
      RazorWallet: mod.RazorWallet,
    };
  }
  return walletConfigs;
};

export const getBitgetWallet = async () =>
  (await loadWalletConfigs()).BitgetWallet;
export const getLeapWallet = async () => (await loadWalletConfigs()).LeapWallet;
export const getNightlyWallet = async () =>
  (await loadWalletConfigs()).NightlyWallet;
export const getOkxWallet = async () => (await loadWalletConfigs()).OkxWallet;
export const getRazorWallet = async () =>
  (await loadWalletConfigs()).RazorWallet;

export const WProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallets, setWallets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadWallets = async () => {
      const configs = await loadWalletConfigs();
      setWallets([
        configs.NightlyWallet,
        configs.RazorWallet,
        configs.OkxWallet,
        configs.LeapWallet,
        configs.BitgetWallet,
      ]);
    };
    loadWallets();
  }, []);

  if (wallets.length === 0) {
    return <></>;
  }

  return (
    <WalletProvider autoConnect={true} defaultWallets={wallets}>
      {children}
    </WalletProvider>
  );
};

const CButton = dynamic(() => import("./connectWithRazorButton"), {
  ssr: false,
  loading: () => <></>,
});

export const RazorConnectButton = ({
  onConnect,
  onModalOpenChange,
}: {
  onConnect: (walletName: string) => void;
  onModalOpenChange: (open: boolean) => void;
}) => {
  return (
    <WProvider>
      <CButton onConnect={onConnect} onModalOpenChange={onModalOpenChange} />
    </WProvider>
  );
};
