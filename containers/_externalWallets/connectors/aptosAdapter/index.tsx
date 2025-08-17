import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  isNetworkValidForExternalWalletLogin,
  validWalletNames,
} from "app/components/Dialog/loginMethodSelect";
import { globalActions } from "app/containers/global/slice";
import { toast } from "app/lib/toast";
import { isDev } from "app/lib/utils";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { externalWalletActions } from "../../slice";

/*
  connected: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: string): void;
  signIn(args: {
    walletName: string;
    input: AptosSignInInput;
  }): Promise<AptosSignInOutput | void>;
  signAndSubmitTransaction(
    transaction: InputTransactionData
  ): Promise<AptosSignAndSubmitTransactionOutput>;
  signTransaction(args: {
    transactionOrPayload: AnyRawTransaction | InputTransactionData;
    asFeePayer?: boolean;
  }): Promise<{
    authenticator: AccountAuthenticator;
    rawTransaction: Uint8Array;
  }>;
  signMessage(message: AptosSignMessageInput): Promise<AptosSignMessageOutput>;
  signMessageAndVerify(message: AptosSignMessageInput): Promise<boolean>;
  disconnect(): void;
  changeNetwork(network: Network): Promise<AptosChangeNetworkOutput>;
  submitTransaction(
    transaction: InputSubmitTransactionData
  ): Promise<PendingTransactionResponse>;
  wallet: AdapterWallet | null;
  wallets: ReadonlyArray<AdapterWallet>;
  notDetectedWallets: ReadonlyArray<AdapterNotDetectedWallet>;

*/

const Container = () => {
  const triedOnce = useRef(false);
  const dispatch = useDispatch();
  const {
    connected,
    isLoading,
    account,
    network,
    wallet,
    connect,
    signAndSubmitTransaction,
    signMessage,
    disconnect,
    changeNetwork,
  } = useWallet();
  useEffect(() => {
    dispatch(
      externalWalletActions.setIsLoading({
        walletName: "aptos",
        isLoading: isLoading,
      })
    );
  }, [isLoading]);

  useEffect(() => {
    dispatch(
      externalWalletActions.setConnected({
        walletName: "aptos",
        connected: true,
      })
    );
  }, [connected]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setAccount({
        walletName: "aptos",
        account: account,
      })
    );
  }, [account]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setNetwork({
        walletName: "aptos",
        network: network,
      })
    );
  }, [network]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setConnect({
        walletName: "aptos",
        connect: connect,
      })
    );
  }, [connect]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setDisconnect({
        walletName: "aptos",
        disconnect: disconnect,
      })
    );
  }, [disconnect]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setSignAndSubmitTransaction({
        walletName: "aptos",
        signAndSubmitTransaction: signAndSubmitTransaction,
      })
    );
  }, [signAndSubmitTransaction]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setSignMessage({
        walletName: "aptos",
        signMessage: signMessage,
      })
    );
  }, [signMessage]);
  useEffect(() => {
    dispatch(
      externalWalletActions.setChangeNetwork({
        walletName: "aptos",
        changeNetwork: changeNetwork,
      })
    );
  }, [changeNetwork]);
  useEffect(() => {
    if (
      account &&
      network &&
      isNetworkValidForExternalWalletLogin(network) &&
      !isLoading &&
      !triedOnce.current &&
      wallet?.name
    ) {
      triedOnce.current = true;
      dispatch(
        globalActions.loginWithExternalWallet({
          account,
          network,
          selectedExternalWallet: wallet?.name as validWalletNames,
        })
      );
      setTimeout(() => {
        triedOnce.current = false;
      }, 1000);
    } else if (account && network && network.chainId !== 126) {
      if (isDev) {
        console.log({ account, network });
      }
      toast.error(
        "Please switch to the Movement Mainnet network on your wallet"
      );
    }
  }, [account?.address.toString(), network?.chainId, wallet?.name]);

  return <></>;
};

export const AptosWalletAdapter = () => {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <Container />
    </AptosWalletAdapterProvider>
  );
};
