import { AptosWalletAdapter } from "./connectors/aptosAdapter";

import { RazorWalletWrapper } from "./connectors/razor";

export const ExternalWallets = () => {
  return (
    <>
      <RazorWalletWrapper />
      <AptosWalletAdapter />
    </>
  );
};
