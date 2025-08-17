import { BaseError, ConnectModal } from "@razorlabs/razorkit";
import AnimatedLoginOption from "app/components/Dialog/loginMethodSelect/AnimatedLoginOption";
import { useState } from "react";

export const ConnectWithRazorButton_InternalUse = ({
  onConnect,
  onModalOpenChange,
}: {
  onConnect: (walletName: string) => void;
  onModalOpenChange: (open: boolean) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  /*
      onOpenChange?: (open: boolean) => void;
    onConnectSuccess?: (walletName: string) => void;
    onConnectError?: (error: BaseError) => void;
  
  */
  const onOpenChange = (open: boolean) => {
    setShowModal(open);
    onModalOpenChange(open);
  };
  const onConnectionSuccess = (walletName: string) => {
    console.log(`connected to: ${walletName}`);
    onConnect(walletName);
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
      <AnimatedLoginOption
        imagePaths={[
          "/external_wallet_icons/nightly.png",
          "/external_wallet_icons/razor.png",
          "/external_wallet_icons/okx.svg",
          "/external_wallet_icons/leap.svg",
          "/external_wallet_icons/bitget.svg",
        ]}
        title="External Wallet"
        subtitle="Connect with your external wallet"
      />
    </ConnectModal>
  );
};

export default ConnectWithRazorButton_InternalUse;
