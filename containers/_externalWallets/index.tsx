import { AccountInfo } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getStore, RootState } from "app/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { filter, firstValueFrom, map, Observable } from "rxjs";
import { ExternalWalletsProvider } from "./connectors/nightly";
import { externalWalletsSelectors } from "./selectors";
import { externalWalletActions } from "./slice";

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

// Create an observable from Redux store state changes
function createStoreObservable<T>(
  selector: (state: RootState) => T
): Observable<T> {
  return new Observable<T>((subscriber) => {
    const store = getStore();
    let currentValue = selector(store.getState());

    // Emit initial value
    subscriber.next(currentValue);

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      const newValue = selector(store.getState());
      if (newValue !== currentValue) {
        currentValue = newValue;
        subscriber.next(newValue);
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  });
}

// Async function to connect wallet and return account
export const connectAsync = async (
  walletName: string
): Promise<AccountInfo | null> => {
  const store = getStore();
  const state = store.getState();

  // Get connect function from store
  const connectFn = externalWalletsSelectors.connect("aptos")(state);

  // Create observables for connected state and account
  const connected$ = createStoreObservable((state: RootState) =>
    externalWalletsSelectors.connected("aptos")(state)
  );

  // Call connect function
  connectFn(walletName);

  // Wait for connection to be established and account to be available
  return firstValueFrom(
    connected$.pipe(
      filter((connected) => connected === true),
      map(() => {
        const currentState = store.getState();
        return externalWalletsSelectors.account("aptos")(currentState);
      }),
      filter((account) => account !== null)
    )
  );
};

const Container = () => {
  const dispatch = useDispatch();
  const {
    connected,
    isLoading,
    account,
    network,
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

  return <></>;
};

export const ExternalWallets = () => {
  return (
    <ExternalWalletsProvider>
      <Container />
    </ExternalWalletsProvider>
  );
};
