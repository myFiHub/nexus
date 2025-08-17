import { WProvider } from "../razor";
import { useConfigureWallet } from "./useConfigureWallet";

const Container = () => {
  useConfigureWallet();
  return <></>;
};

export const AptosWalletAdapter = () => {
  return (
    <WProvider>
      <Container />
    </WProvider>
  );
};
