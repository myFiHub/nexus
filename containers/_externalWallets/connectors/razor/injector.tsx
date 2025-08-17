import { useWallet } from "@razorlabs/razorkit";

export const Injector = () => {
  const { disconnect, account, signAndSubmitTransaction, signMessage, chain } =
    useWallet();

  return <></>;
};

export default Injector;
