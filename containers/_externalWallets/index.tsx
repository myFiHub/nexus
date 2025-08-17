import { AptosWalletAdapter } from "./connectors/aptosAdapter";

import { RazorWallet } from "./connectors/razor";

export const ExternalWallets = () => {
  return (
    <>
      <RazorWallet />
      <AptosWalletAdapter />
    </>
  );
};
