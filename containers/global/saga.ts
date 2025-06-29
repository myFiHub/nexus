import {
  IProvider,
  UserInfo,
  Web3Auth,
  WEB3AUTH_NETWORK,
} from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";
import {
  confirmDialog,
  ConfirmDialogResult,
} from "app/components/Dialog/confirmDialog";
import { CookieKeys } from "app/lib/client-cookies";
import {
  deleteServerCookieViaAPI,
  setServerCookieViaAPI,
} from "app/lib/client-server-cookies";
import { logoutFromOneSignal } from "app/lib/onesignal";
import { initOneSignalForUser } from "app/lib/onesignal-init";
import { requestPushNotificationPermission } from "app/lib/pushNotificationPermissions";
import { signMessageWithTimestamp } from "app/lib/signWithPrivateKey";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import {
  AdditionalDataForLogin,
  LoginRequest,
  OutpostModel,
  User,
} from "app/services/api/types";
import { wsClient } from "app/services/wsClient/client";
import { getStore } from "app/store";
import { AptosAccount } from "aptos";
import { ethers } from "ethers";
import {
  all,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { detached_checkPass } from "../_assets/saga";
import { myOutpostsActions, useMyOutpostsSlice } from "../myOutposts/slice";
import { joinOutpost } from "./effects/joinOutpost";
import { hasCreatorPodiumPass } from "./effects/podiumPassCheck";
import { OutpostAccesses } from "./effects/types";
import { GlobalSelectors } from "./selectors";
import { globalActions } from "./slice";

const availableSocialLogins = [
  "twitter",
  "google",
  "apple",
  "facebook",
  "github",
  "linkedin",
  "email_passwordless",
];

const stringContainsOneOfAvailableSocialLogins = (str: string) => {
  return availableSocialLogins.some((login) => str.includes(login));
};

export function* getPrivateKey() {
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  if (!web3Auth) return;
  const provider = web3Auth.provider!;
  const privateKey: unknown = yield provider.request({
    method: "private_key",
  });
  return privateKey;
}

function* initOneSignal(
  action: ReturnType<typeof globalActions.initOneSignal>
) {
  const myId: string = action.payload.myId;
  try {
    const result: boolean = yield requestPushNotificationPermission();
    if (!result) {
      toast.error("Push notification permission is denied");
      return;
    }
    yield initOneSignalForUser(myId);
  } catch (error) {
    console.warn("Error initializing OneSignal:", error);
  }
}

function* initializeWeb3Auth(
  action: ReturnType<typeof globalActions.initializeWeb3Auth>
) {
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
    uiConfig: {
      loginMethodsOrder: availableSocialLogins,
    },
    clientId: web3AuthContextConfig.web3AuthOptions.clientId,
    web3AuthNetwork: web3AuthContextConfig.web3AuthOptions.web3AuthNetwork,
  });
  try {
    yield web3auth.init();
    yield put(globalActions.setWeb3Auth(web3auth));
    const connected: boolean = yield web3auth.connected;
    if (connected) {
      yield getAndSetAccount();
    }
  } catch (error) {
    yield put(globalActions.setLogingIn(false));
    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      put(globalActions.setAptosAccount(undefined)),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
    toast.error("Failed to initialize the app");
  } finally {
    yield put(globalActions.setInitializingWeb3Auth(false));
  }
}

function* getAndSetAccount() {
  try {
    const initialized: boolean = yield select(GlobalSelectors.initialized);
    if (!initialized) {
      toast.error("app is not initialized, check your connection please", {
        action: {
          label: "retry?",
          onClick: () =>
            getStore().dispatch(globalActions.initializeWeb3Auth()),
        },
      });
      return;
    }
    yield put(globalActions.setLogingIn(true));
    const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
    const user: IProvider | null = yield web3Auth.connect();
    if (user) {
      const userInfo: Partial<UserInfo> = yield web3Auth.getUserInfo();
      if (
        userInfo.authConnection &&
        !stringContainsOneOfAvailableSocialLogins(userInfo.authConnection)
      ) {
        yield web3Auth.logout();
        yield web3Auth.clearCache();
        toast.error("Only social login is supported for now");
        return;
      }
      yield afterConnect(userInfo);
    }
    yield put(globalActions.setLogingIn(false));
  } catch (error) {
    yield put(globalActions.setLogingIn(false));
    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      put(globalActions.setAptosAccount(undefined)),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
  }
}

function* afterConnect(userInfo: Partial<UserInfo>) {
  try {
    const privateKey: string | undefined = yield getPrivateKey();
    if (privateKey) {
      const privateKeyBytes = Uint8Array.from(Buffer.from(privateKey, "hex"));
      const account = new AptosAccount(privateKeyBytes);
      yield put(globalActions.setAptosAccount(account));

      const aptosAddress = account.address().hex();
      let {
        authConnection: loginType,
        userId: identifierId,
        name,
        profileImage: image,
        email,
      } = userInfo;

      if (!identifierId) {
        console.log("Identifier ID is required");
        return;
      }
      if (identifierId.includes("|")) {
        identifierId = identifierId.split("|")[1];
      }
      const hasCreatorPass: boolean = yield hasCreatorPodiumPass({
        buyerAddress: aptosAddress,
      });

      const evmWallet = new ethers.Wallet(privateKey);
      const evmAddress = evmWallet.address;
      const { signature, timestampInUTCInSeconds } =
        yield signMessageWithTimestamp({
          privateKey,
          message: evmAddress,
        });
      const loginRequest: LoginRequest = {
        signature,
        username: evmAddress,
        timestamp: timestampInUTCInSeconds,
        aptos_address: aptosAddress,
        has_ticket: hasCreatorPass,
        login_type_identifier: identifierId,
      };
      const additionalDataForLogin: AdditionalDataForLogin = {
        loginType,
      };
      if (name) {
        additionalDataForLogin.name = name;
      }
      if (image) {
        additionalDataForLogin.image = image;
      }
      if (email) {
        additionalDataForLogin.email = email;
      }
      yield continueWithLoginRequestAndAdditionalData(
        loginRequest,
        additionalDataForLogin
      );
    }
  } catch (error) {
    yield put(globalActions.logout());
  }
}

function* continueWithLoginRequestAndAdditionalData(
  loginRequest: LoginRequest,
  additionalDataForLogin: AdditionalDataForLogin,
  retried = false
): any {
  const response: {
    user: User | null;
    error: string | null;
    statusCode: number | null;
    token: string | null;
  } = yield podiumApi.login(loginRequest, additionalDataForLogin);
  let referrerId = "";
  if (response.statusCode === 428 && !retried) {
    const { confirmed, enteredText }: ConfirmDialogResult = yield confirmDialog(
      {
        title: "do you have a referrer",
        content: "",
        inputOpts: {
          inputType: "text",
          inputPlaceholder: "referrer id",
        },
      }
    );
    if (confirmed && enteredText) {
      referrerId = enteredText;
      loginRequest.referrer_user_uuid = referrerId;
      yield continueWithLoginRequestAndAdditionalData(
        loginRequest,
        additionalDataForLogin,
        true
      );
      return;
    }
  } else if (!response.user && response.error) {
    toast.error(response.error);
    yield put(globalActions.logout());
    return;
  }

  let savedName = response.user?.name;
  let canContinue = true;
  if (!savedName) {
    canContinue = false;
    const { confirmed, enteredText }: ConfirmDialogResult = yield confirmDialog(
      {
        title: "please enter your name",
        content: "",
        inputOpts: {
          inputType: "text",
          inputPlaceholder: "name",
        },
      }
    );
    if (confirmed && (enteredText?.trim().length || 0) > 0) {
      const resultsForUpdate: User | undefined =
        yield podiumApi.updateMyUserData({ name: enteredText });
      if (resultsForUpdate) {
        canContinue = true;
        savedName = enteredText;
      }
    }
  }
  if (!canContinue) {
    yield put(globalActions.logout());
    return;
  }

  if (response?.user) {
    yield put(
      globalActions.setPodiumUserInfo({ ...response.user, name: savedName })
    );
    yield put(globalActions.initOneSignal({ myId: response.user.uuid }));
    yield setServerCookieViaAPI(CookieKeys.myUserId, response.user.uuid);
    if (response.token) {
      yield wsClient.connect(
        response.token,
        process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!
      );
    }
    useMyOutpostsSlice();
    yield put(myOutpostsActions.getOutposts());
  } else {
    yield put(globalActions.logout());
  }
}

function* logout() {
  yield put(globalActions.setLogingOut(true));
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  try {
    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      put(globalActions.setAptosAccount(undefined)),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
    yield logoutFromOneSignal();
    yield web3Auth?.logout();
    yield web3Auth?.clearCache();
  } catch (error) {
    console.error(error);
  }
  yield put(globalActions.setLogingOut(false));
}

function* startTicker(): any {
  yield put(globalActions.increaseTick_());
  yield delay(1000);
  yield startTicker();
}

function* checkIfIHavePass(
  action: ReturnType<typeof globalActions.checkIfIHavePass>
) {
  const incomingOutpost = action.payload.outpost;
  yield put(globalActions.setCheckingOutpostForPass(incomingOutpost));
  const outpostDetails: OutpostModel = yield podiumApi.getOutpost(
    action.payload.outpost.uuid
  );
  try {
    const accesses: OutpostAccesses = yield detached_checkPass({
      outpost: outpostDetails,
    });
    if (!accesses.canEnter) {
      toast.error("You don't have a pass");
    } else if (!accesses.canSpeak) {
      toast.error("you can enter but can not speak");
    } else {
      toast.success("You have a full pass");
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(globalActions.setCheckingOutpostForPass(undefined));
  }
}

function* setViewArchivedOutposts(
  action: ReturnType<typeof globalActions.setViewArchivedOutposts>
) {
  useMyOutpostsSlice();
  yield put(myOutpostsActions.getOutposts());
}

export function* globalSaga() {
  yield takeLatest(globalActions.startTicker, startTicker);
  yield takeLatest(globalActions.initializeWeb3Auth, initializeWeb3Auth);
  yield takeLatest(globalActions.initOneSignal, initOneSignal);
  yield takeLatest(globalActions.getAndSetWeb3AuthAccount, getAndSetAccount);
  yield takeLatest(globalActions.logout, logout);
  yield takeEvery(globalActions.joinOutpost, joinOutpost);
  yield takeLatest(globalActions.checkIfIHavePass, checkIfIHavePass);
  yield takeLatest(
    globalActions.setViewArchivedOutposts,
    setViewArchivedOutposts
  );
}
