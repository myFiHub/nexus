import {
  IProvider,
  UserInfo,
  Web3Auth,
  WEB3AUTH_NETWORK,
} from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";
import { AptosAccount } from "aptos";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { GlobalSelectors } from "./selectors";
import { globalActions } from "./slice";

export function* getPrivateKey() {
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  if (!web3Auth) return;
  const provider = web3Auth.provider!;
  const privateKey: unknown = yield provider.request({
    method: "private_key",
  });
  return privateKey;
}

function* initialize(action: ReturnType<typeof globalActions.initialize>) {
  yield put(globalActions.setInitializingWeb3Auth(true));
  const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
      web3AuthNetwork:
        process.env.NODE_ENV === "development"
          ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
          : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      ssr: true,
    },
  };

  const web3auth = new Web3Auth({
    clientId: web3AuthContextConfig.web3AuthOptions.clientId,
    web3AuthNetwork: web3AuthContextConfig.web3AuthOptions.web3AuthNetwork,
  });

  yield web3auth.init();
  yield put(globalActions.setWeb3Auth(web3auth));
  try {
    const connected: boolean = yield web3auth.connected;
    console.log({ connected });
    if (connected) {
      yield getAndSetAccount();
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(globalActions.setInitializingWeb3Auth(false));
  }
}

function* getAndSetAccount() {
  yield put(globalActions.setLogingIn(true));
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  const user: IProvider | null = yield web3Auth.connect();
  if (user) {
    const userInfo: Partial<UserInfo> = yield web3Auth.getUserInfo();
    yield afterConnect(userInfo);
  }
  yield put(globalActions.setLogingIn(false));
}

function* afterConnect(userInfo: Partial<UserInfo>) {
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(web3Auth.provider!),
  });
  const address: string = yield walletClient.getAddresses();
  console.log({ address });

  const privateKey: string | undefined = yield getPrivateKey();
  if (privateKey) {
    const privateKeyBytes = Uint8Array.from(Buffer.from(privateKey, "hex"));
    const account = new AptosAccount(privateKeyBytes);
    yield put(globalActions.setAptosAccount(account));
  }
}

function* disconnectWeb3Auth() {
  yield put(globalActions.setLogingOut(true));
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  try {
    yield web3Auth?.logout();
    yield web3Auth?.clearCache();

    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      put(globalActions.setAptosAccount(undefined)),
    ]);
  } catch (error) {
    console.error(error);
  }
  yield put(globalActions.setLogingOut(false));
}

export function* globalSaga() {
  yield takeLatest(globalActions.initialize, initialize);
  yield takeLatest(globalActions.getAndSetWeb3AuthAccount, getAndSetAccount);
  yield takeLatest(globalActions.disconnectWeb3Auth, disconnectWeb3Auth);
}
