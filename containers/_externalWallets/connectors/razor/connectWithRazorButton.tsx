import { BaseError, ConnectModal } from "@razorlabs/razorkit";
import { Button } from "app/components/Button";
import { useState } from "react";

export const ConnectWithRazorButton_InternalUse = () => {
  const [showModal, setShowModal] = useState(false);
  /*
      onOpenChange?: (open: boolean) => void;
    onConnectSuccess?: (walletName: string) => void;
    onConnectError?: (error: BaseError) => void;
  
  */
  const onOpenChange = (open: boolean) => {
    setShowModal(open);
  };
  const onConnectionSuccess = (walletName: string) => {
    console.log(`connected to: ${walletName}`);
  };
  const onConnectError = (error: BaseError) => {
    console.log({ error });
  };

  return (
    <ConnectModal
      open={showModal}
      onOpenChange={onOpenChange}
      onConnectSuccess={onConnectionSuccess}
      onConnectError={onConnectError}
    >
      <Button>connect to external wallet</Button>
    </ConnectModal>
  );
};

export default ConnectWithRazorButton_InternalUse;
