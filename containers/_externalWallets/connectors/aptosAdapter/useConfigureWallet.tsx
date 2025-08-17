import { useWallet } from "@razorlabs/razorkit";
import { validWalletNames } from "app/components/Dialog/loginMethodSelect";
import { globalActions } from "app/containers/global/slice";
import { isDev } from "app/lib/utils";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { externalWalletActions } from "../../slice";

/*
    configuredWallets: IWallet[];
    detectedWallets: IWallet[];
    allAvailableWallets: IWallet[];
    chains: Chain[];
    chain: Chain | undefined;
    name: string | undefined;
    adapter: IWalletAdapter | undefined;
    account: WalletAccount | undefined;
    address: string | undefined;
    connecting: boolean;
    reconnecting: boolean;
    connected: boolean;
    status: 'disconnected' | 'connected' | 'connecting' | 'reconnecting';
    select: (walletName: string) => Promise<void>;
    disconnect: () => Promise<void>;
    getAccounts: () => readonly WalletAccount[];
    changeNetwork: (input: number) => Promise<UserResponse<AptosChangeNetworkOutput>>;
    signAndSubmitTransaction(input: AptosSignAndSubmitTransactionInput): Promise<UserResponse<AptosSignAndSubmitTransactionOutput>>;
    signTransaction(transaction: AnyRawTransaction, asFeePayer?: boolean): Promise<UserResponse<AptosSignTransactionOutput>>;
    signMessage(input: AptosSignMessageInput): Promise<UserResponse<AptosSignMessageOutput>>;

*/

export const useConfigureWallet = () => {
  const triedOnce = useRef(false);
  const dispatch = useDispatch();
  const {
    connected,
    connecting: isLoading,
    account,
    chain,
    signAndSubmitTransaction,
    signMessage,
    disconnect,
    changeNetwork,
    name,
  } = useWallet();

  if (isDev) {
    console.log({
      connected,
      isLoading,
      account,
      chain,
      name,
      signAndSubmitTransaction,
      signMessage,
      disconnect,
      changeNetwork,
    });
  }

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
    dispatch(
      externalWalletActions.setChain({
        walletName: "aptos",
        chain: chain,
      })
    );
  }, [chain]);
  useEffect(() => {
    if (account && !isLoading && !triedOnce.current && chain) {
      if (isDev) {
        console.log({ account, chain, name });
      }
      triedOnce.current = true;
      dispatch(
        globalActions.loginWithExternalWallet({
          account,
          chain,
          selectedExternalWallet: name as validWalletNames,
        })
      );
      setTimeout(() => {
        triedOnce.current = false;
      }, 1000);
    }
  }, [account?.address.toString()]);

  return {
    connected,
    isLoading,
    account,
    chain,
    name,
    signAndSubmitTransaction,
    signMessage,
    disconnect,
    changeNetwork,
  };
};
