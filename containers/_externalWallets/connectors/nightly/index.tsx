import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export const useExternalWallet = () => {
  return [];
};

export const ExternalWalletsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
