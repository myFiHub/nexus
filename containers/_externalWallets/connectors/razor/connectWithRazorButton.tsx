import AnimatedLoginOption from "app/components/Dialog/loginMethodSelect/AnimatedLoginOption";
import { GlobalSelectors } from "app/containers/global/selectors";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useConfigureWallet } from "../aptosAdapter/useConfigureWallet";
import {
  imagesPathsForWallets,
  subtitleForExternalWallet,
  titleForExternalWallet,
} from "./connectWithRazorButtonConstants";

const ConnectModalLazyLoad = dynamic(
  () => import("@razorlabs/razorkit").then((mod) => mod.ConnectModal),
  {
    ssr: false,
  }
);

export { imagesPathsForWallets, subtitleForExternalWallet, titleForExternalWallet };

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
  const onConnectError = (error: any) => {
    console.log({ error });
  };

  return (
    <ConnectModalLazyLoad
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
    </ConnectModalLazyLoad>
  );
};

export default ConnectWithRazorButton_InternalUse;
