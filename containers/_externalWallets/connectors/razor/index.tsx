"use client";
import "@razorlabs/razorkit/style.css";
import dynamic from "next/dynamic";
import React from "react";
import "./customStyles.css";

// Dynamic import for WalletProvider only
export const WalletProvider = dynamic(
  () => import("@razorlabs/razorkit").then((mod) => mod.WalletProvider),
  { ssr: false, loading: () => <></> }
);

// Direct imports for other exports
let walletExports: any = {};
const loadWalletExports = async () => {
  try {
    walletExports = await import("@razorlabs/razorkit");
  } catch (error) {
    console.error("Failed to load wallet exports:", error);
  }
};
loadWalletExports();

export const getBitgetWallet = async () => walletExports.BitgetWallet;
export const getLeapWallet = async () => walletExports.LeapWallet;
export const getNightlyWallet = async () => walletExports.NightlyWallet;
export const getOkxWallet = async () => walletExports.OkxWallet;
export const getRazorWallet = async () => walletExports.RazorWallet;

export const WProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallets, setWallets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadWallets = async () => {
      if (walletExports.BitgetWallet) {
        setWallets([
          walletExports.NightlyWallet,
          walletExports.RazorWallet,
          walletExports.OkxWallet,
          walletExports.LeapWallet,
          walletExports.BitgetWallet,
        ]);
      }
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
