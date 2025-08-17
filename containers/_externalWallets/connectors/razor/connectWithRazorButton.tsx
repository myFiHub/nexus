import { BaseError, ConnectModal } from "@razorlabs/razorkit";
import AnimatedLoginOption from "app/components/Dialog/loginMethodSelect/AnimatedLoginOption";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useConfigureWallet } from "../aptosAdapter/useConfigureWallet";

export const imagesPathsForWallets = [
  "/external_wallet_icons/nightly.png",
  "/external_wallet_icons/razor.png",
  "/external_wallet_icons/okx.svg",
  "/external_wallet_icons/leap.svg",
  "/external_wallet_icons/bitget.svg",
];
export const titleForExternalWallet = "External Wallet";
export const subtitleForExternalWallet = "Connect with your external wallet";

export const ConnectWithRazorButton_InternalUse = ({
  onConnect,
  onModalOpenChange,
}: {
  onConnect: (walletName: string) => void;
  onModalOpenChange: (open: boolean) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  useConfigureWallet();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const logingIn = useSelector(GlobalSelectors.logingIn);
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
      open={showModal && !myUser && !logingIn}
      onOpenChange={onOpenChange}
      onConnectSuccess={onConnectionSuccess}
      onConnectError={onConnectError}
    >
      <AnimatedLoginOption
        imagePaths={imagesPathsForWallets}
        title={titleForExternalWallet}
        subtitle={subtitleForExternalWallet}
      />
    </ConnectModal>
  );
};

export default ConnectWithRazorButton_InternalUse;
