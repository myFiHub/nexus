"use client";
import {
  IProvider,
  UserInfo,
  Web3Auth,
  WEB3AUTH_NETWORK,
} from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";
import {
  nameDialog,
  NameDialogResult,
  promptNotifications,
  referrerDialog,
  ReferrerDialogResult,
} from "app/components/Dialog";
import { CookieKeys } from "app/lib/client-cookies";
import {
  deleteServerCookieViaAPI,
  setServerCookieViaAPI,
} from "app/lib/client-server-cookies";
import { logoutFromOneSignal } from "app/lib/onesignal";
import { initOneSignalForUser } from "app/lib/onesignal-init";
import { requestPushNotificationPermission } from "app/lib/pushNotificationPermissions";
import {
  signMessage,
  signMessageWithTimestamp,
  signMessageWithTimestampUsingExternalWallet,
} from "app/lib/signWithPrivateKey";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
// Removed: import { fetchMovePrice } from "app/services/api/coingecko/priceFetch";
import {
  LoginMethod,
  loginMethodSelectDialog,
  LoginMethodSelectDialogResult,
  validWalletNames,
} from "app/components/Dialog/loginMethodSelectDialog";
import { isDev, isUuid } from "app/lib/utils";
import {
  AdditionalDataForLogin,
  ConnectNewAccountRequest,
  LoginRequest,
  OutpostModel,
  User,
} from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { wsClient } from "app/services/wsClient/client";
import { getStore } from "app/store";
import { ethers } from "ethers";
import {
  all,
  debounce,
  delay,
  put,
  select,
  takeLatest,
} from "redux-saga/effects";
import { detached_checkPass } from "../_assets/saga";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { externalWalletsSelectors } from "../_externalWallets/selectors";
import {
  accountType,
  connectType,
  disconnectType,
} from "../_externalWallets/slice";
import { myOutpostsActions, useMyOutpostsSlice } from "../myOutposts/slice";
import {
  notificationsActions,
  useNotificationsSlice,
} from "../notifications/slice";
import { profileActions, useProfileSlice } from "../profile/slice";
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
    const askedOnceForNotifs: string | null =
      localStorage.getItem("askedOnceForNotifs");
    if (!askedOnceForNotifs) {
      const result: boolean = yield promptNotifications();
      localStorage.setItem("askedOnceForNotifs", "true");
      if (!result) {
        return;
      }
    }
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
      ssr: false,
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
      yield getAndSetAccountUsingSocialLogin();
    }
  } catch (error) {
    yield put(globalActions.setLogingIn(false));
    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      movementService.clearAccount(),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
    toast.error("Failed to initialize the app");
  } finally {
    yield put(globalActions.setInitializingWeb3Auth(false));
  }
}

function* login() {
  const selectedMethod: LoginMethodSelectDialogResult =
    yield loginMethodSelectDialog();
  if (selectedMethod === LoginMethod.SOCIAL) {
    yield getAndSetAccountUsingSocialLogin();
    return;
  }
  if (selectedMethod === LoginMethod.NIGHTLY) {
    const connect: connectType = yield select(
      externalWalletsSelectors.connect("aptos")
    );
    yield connect(selectedMethod);
    // rest will be handled in _externalWallets index file, in a useEffect that depends on the account state and network state
    // if the account is not null, and the network is not null, and the network.chainId is 126, then we can login with the external wallet using loginWithExternalWallet
    return;
  }
}
function* loginWithExternalWallet(
  action: ReturnType<typeof globalActions.loginWithExternalWallet>
) {
  const { network, account } = action.payload;
  if (network.chainId !== 126) {
    toast.error(
      "Please switch to the Movement Mainnet network on your wallet to login"
    );
    return;
  }
  if (account) {
    yield put(globalActions.setLogingIn(true));
    yield detached_afterConnect({}, false);
    yield put(globalActions.setLogingIn(false));
  }
}

function* getAndSetAccountUsingSocialLogin() {
  try {
    const initialized: boolean = yield select(GlobalSelectors.initialized);
    if (!initialized) {
      toast.error("app is not initialized, check your connection please", {
        action: {
          label: "retry?",
          onClick: () =>
            getStore()!.dispatch(globalActions.initializeWeb3Auth()),
        },
      });
      return;
    }
    yield put(globalActions.setLogingIn(true));
    const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
    const provider: IProvider | null = yield web3Auth.connect();

    if (provider) {
      const userInfo: Partial<UserInfo> = yield web3Auth.getUserInfo();
      if (
        userInfo.authConnection &&
        !stringContainsOneOfAvailableSocialLogins(userInfo.authConnection)
      ) {
        yield web3Auth.logout();
        yield web3Auth.clearCache();
        toast.error("Only social login is supported for now");
        return;
      } else if (!userInfo.authConnection) {
        const accounts: string[] | undefined = yield provider?.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          yield web3Auth.logout();
          yield web3Auth.clearCache();
          yield put(globalActions.setLogingIn(false));

          toast.error("Only social login is supported for now");
          return;
        }
      }
      yield detached_afterConnect(userInfo);
    }
    yield put(globalActions.setLogingIn(false));
  } catch (error) {
    yield put(globalActions.setLogingIn(false));
    yield all([
      movementService.clearAccount(),
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
  }
}

function* switchAccount() {
  yield put(globalActions.setSwitchingAccount(true));
  try {
    let thereWasAnError = false;
    const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
    const correntAccountPrivateKey: string | undefined = yield getPrivateKey();

    if (!correntAccountPrivateKey) {
      thereWasAnError = true;
    } else {
      yield web3Auth.logout();
      yield web3Auth.clearCache();
      const provider: IProvider | null = yield web3Auth.connect();

      if (!provider) {
        thereWasAnError = true;
      } else {
        const userInfo: Partial<UserInfo> = yield web3Auth.getUserInfo();
        const newAccountPrivateKey: string | undefined = yield provider.request(
          {
            method: "private_key",
          }
        );

        if (!newAccountPrivateKey) {
          thereWasAnError = true;
          return;
        } else {
          const correntAccountAddress = new ethers.Wallet(
            correntAccountPrivateKey
          ).address;
          const newAccountAddress = new ethers.Wallet(newAccountPrivateKey)
            .address;

          if (correntAccountAddress === newAccountAddress) {
            thereWasAnError = true;
          } else {
            movementService.setAccount(newAccountPrivateKey);
            const newAccountAptosAddress = movementService.address;

            const currentAccountAddressSignedByNewAccount: string =
              yield signMessage({
                privateKey: newAccountPrivateKey,
                message: correntAccountAddress,
              });
            const newAccountAddressSignedByCurrentAccount: string =
              yield signMessage({
                privateKey: correntAccountPrivateKey,
                message: newAccountAddress,
              });

            if (!userInfo.authConnection) {
              thereWasAnError = true;
            } else if (
              userInfo.authConnection &&
              !stringContainsOneOfAvailableSocialLogins(userInfo.authConnection)
            ) {
              thereWasAnError = true;
              toast.error("Only social login methods are supported for now");
            } else {
              let identifierId = userInfo.authConnectionId ?? "";
              if (identifierId.includes("|")) {
                identifierId = identifierId.split("|")[1];
              }

              const request: ConnectNewAccountRequest = {
                aptos_address: newAccountAptosAddress,
                current_address_signature:
                  currentAccountAddressSignedByNewAccount,
                image: userInfo.profileImage ?? "",
                login_type: userInfo.authConnection,
                login_type_identifier: identifierId,
                new_address: newAccountAddress,
                new_address_signature: newAccountAddressSignedByCurrentAccount,
              };

              const connected: boolean = yield podiumApi.connectNewAccount(
                request
              );
              if (!connected) {
                thereWasAnError = true;
              } else {
                const {
                  signature: newAccountSignature,
                  timestampInUTCInSeconds,
                }: {
                  signature: string;
                  timestampInUTCInSeconds: number;
                } = yield signMessageWithTimestamp({
                  privateKey: newAccountPrivateKey,
                  message: newAccountAddress,
                });

                const loginRequest: LoginRequest = {
                  signature: newAccountSignature,
                  username: newAccountAddress,
                  timestamp: timestampInUTCInSeconds,
                  aptos_address: movementService.address,
                  has_ticket: false,
                  login_type: userInfo?.authConnection ?? "",
                  login_type_identifier: userInfo?.authConnectionId ?? "",
                };

                const response: {
                  user: User | null;
                  error: string | null;
                  statusCode: number | null;
                  token: string | null;
                } = yield podiumApi.login(loginRequest, {});
                if (response.user) {
                  yield detached_afterGettingPodiumUser({
                    user: response.user,
                    token: response.token ?? "",
                  });
                } else {
                  thereWasAnError = true;
                }
              }
            }
          }
        }
      }
    }
    if (thereWasAnError) {
      toast.error("there was an error, please try again");
      yield put(globalActions.logout());
    }
  } catch (error) {
    yield put(globalActions.logout());
    toast.error("there was an error, please try again");
  } finally {
    yield put(globalActions.setSwitchingAccount(false));
  }
}

function* detached_afterConnect(
  userInfo: Partial<UserInfo>,
  isSocialLogin = true
) {
  try {
    let {
      authConnection: loginType,
      userId: identifierId,
      name,
      profileImage: image,
      email,
    } = userInfo;

    if (!isSocialLogin) {
      const account: accountType = yield select(
        externalWalletsSelectors.account("aptos")
      );
      if (!account) {
        toast.error("Account not found");
        return;
      }
      const publicKey = account.publicKey.toString();
      const aptosAddress = account.address.toString();
      const identifierId = account.address.toString();
      const loginType: validWalletNames = LoginMethod.NIGHTLY;
      const hasCreatorPass: boolean = yield hasCreatorPodiumPass({
        buyerAddress: aptosAddress,
      });

      yield detached_continueWithLoginRequestAndAdditionalData({
        loginRequest: {
          // this will be handled and changed in next step
          signature: "placeholder",
          // this will be handled and changed in next step
          timestamp: 0,
          username: publicKey,
          aptos_address: aptosAddress,
          has_ticket: hasCreatorPass,
          login_type: loginType.toLowerCase(),
          login_type_identifier: identifierId,
        },
        additionalDataForLogin: {},
        isSocialLogin: false,
      });
    }

    const privateKey: string | undefined = yield getPrivateKey();
    if (privateKey) {
      movementService.setAccount(privateKey);
      const aptosAddress = movementService.address;

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

      const loginRequest: LoginRequest = {
        signature: "placeholder", //this will be handled and changed in next step
        username: evmAddress,
        timestamp: 0, //this will be handled and changed in next step
        aptos_address: aptosAddress,
        has_ticket: hasCreatorPass,
        login_type: loginType ?? "",
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
      yield detached_continueWithLoginRequestAndAdditionalData({
        loginRequest,
        additionalDataForLogin,
        privateKey,
        isSocialLogin: true,
      });
    }
  } catch (error) {
    yield put(globalActions.logout());
  }
}

function* detached_continueWithLoginRequestAndAdditionalData({
  loginRequest,
  additionalDataForLogin,
  retried = false,
  privateKey,
  isSocialLogin = true,
}: {
  loginRequest: LoginRequest;
  additionalDataForLogin: AdditionalDataForLogin;
  retried?: boolean;
  privateKey?: string;
  isSocialLogin?: boolean;
}): any {
  let signature: string;
  let timestampInUTCInSeconds: number;
  if (!isSocialLogin) {
    const {
      signature: signatureExternalWallet,
      timestampInUTCInSeconds: timestampInUTCInSecondsExternalWallet,
    } = yield signMessageWithTimestampUsingExternalWallet({
      walletName: "aptos",
      message: loginRequest.username,
    });

    signature = signatureExternalWallet!;
    timestampInUTCInSeconds = timestampInUTCInSecondsExternalWallet!;
    movementService.connectedToExternalWallet = true;
  } else {
    const {
      signature: signaturePrivateKey,
      timestampInUTCInSeconds: timestampInUTCInSecondsPrivateKey,
    }: {
      signature: string;
      timestampInUTCInSeconds: number;
    } = yield signMessageWithTimestamp({
      privateKey: privateKey!,
      message: loginRequest.username,
    });
    signature = signaturePrivateKey!;
    timestampInUTCInSeconds = timestampInUTCInSecondsPrivateKey!;
    movementService.connectedToExternalWallet = false;
  }
  if (!signature || !timestampInUTCInSeconds) {
    toast.error("Logging in failed, please try again");
    yield put(globalActions.logout());
    return;
  }

  loginRequest.signature = signature;
  loginRequest.timestamp = timestampInUTCInSeconds;

  const response: {
    user: User | null;
    error: string | null;
    statusCode: number | null;
    token: string | null;
  } = yield podiumApi.login(loginRequest, additionalDataForLogin);
  let referrerId = "";
  if (response.statusCode === 428 && !retried) {
    const { confirmed, enteredText }: ReferrerDialogResult =
      yield referrerDialog();
    if (confirmed && enteredText && isUuid(enteredText)) {
      referrerId = enteredText;
      loginRequest.referrer_user_uuid = referrerId;
      yield detached_continueWithLoginRequestAndAdditionalData({
        loginRequest,
        additionalDataForLogin,
        privateKey,
        retried: true,
        isSocialLogin,
      });
      return;
    } else {
      toast.error("you need to be referred by a user to join");
      yield put(globalActions.logout());
      return;
    }
  } else if (!response.user && response.error) {
    toast.error(response.error);
    yield put(globalActions.logout());
    return;
  }
  let savedName = response.user?.name;
  let canContinue = true;
  if (!savedName || savedName.includes("@")) {
    canContinue = false;
    const { confirmed, enteredText }: NameDialogResult = yield nameDialog();
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
      globalActions.setPodiumUserInfo({
        ...response.user,
        name: savedName,
      })
    );
    yield detached_afterGettingPodiumUser({
      user: response.user,
      token: response.token ?? "",
    });
  } else {
    yield put(globalActions.logout());
  }
}
function* detached_afterGettingPodiumUser({
  user,
  token,
}: {
  user: User;
  token: string;
}) {
  useMyOutpostsSlice();
  useProfileSlice();
  useAssetsSlice();
  useNotificationsSlice();
  yield put(globalActions.initOneSignal({ myId: user.uuid }));
  yield all([
    put(notificationsActions.getNotifications()),
    put(assetsActions.getMyBlockchainPasses()),
    put(assetsActions.getBalance()),
    put(myOutpostsActions.getOutposts()),
    put(profileActions.fetchNfts({ silent: true })),
    put(assetsActions.getPassesBoughtByMe({ page: 0 })),
    setServerCookieViaAPI(CookieKeys.myUserId, user.uuid),
    setServerCookieViaAPI(CookieKeys.myMoveAddress, user.aptos_address!),
    wsClient.connect(token, process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!),
  ]);
}

function* logout() {
  yield put(globalActions.setLogingOut(true));
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);

  try {
    yield all([
      put(globalActions.setWeb3AuthUserInfo(undefined)),
      movementService.clearAccount(),
      put(globalActions.setPodiumUserInfo(undefined)),
    ]);
    deleteServerCookieViaAPI(CookieKeys.myUserId);
    yield logoutFromOneSignal();
    try {
      yield web3Auth?.logout();
    } catch (error) {}
    try {
      yield web3Auth?.clearCache();
    } catch (error) {}
  } catch (error) {
    console.error(error);
  } finally {
    const disconnect: disconnectType = yield select(
      externalWalletsSelectors.disconnect("aptos")
    );
    try {
      disconnect?.();
    } catch (error) {
      if (isDev) {
        console.error(error);
      }
    }
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

function* getLatestOnlineUsersForOutposts(
  action: ReturnType<typeof globalActions.toggleOutpostFromOnlineObject>
) {
  try {
    const objectOfOnlineUsersToGet: { [outpostId: string]: boolean } =
      yield select(GlobalSelectors.objectOfOnlineUsersToGet);
    const arrayToCheck = Object.keys(objectOfOnlineUsersToGet);
    const arrayToCall: Promise<number>[] = [];
    for (const outpostId of arrayToCheck) {
      arrayToCall.push(podiumApi.getNumberOfOnlineMembers(outpostId));
    }
    const results: number[] = yield all(arrayToCall);
    const objectToPut: { [outpostId: string]: number } = {};
    for (let i = 0; i < arrayToCheck.length; i++) {
      objectToPut[arrayToCheck[i]] = results[i];
    }
    yield put(globalActions.setNumberOfOnlineUsers(objectToPut));
  } catch (error) {
    console.error(error);
  }
}

function* getMovePrice(): Generator<any, void, any> {
  let movePrice = 0;
  try {
    const response = yield fetch("/api/coingecko/price");
    if (response.ok) {
      const data = yield response.json();
      const price = Number(data?.movement?.usd);
      if (!isNaN(price)) {
        movePrice = price;
      }
    }
  } catch (error) {
    // Optionally log error
  }
  yield put(globalActions.setMovePrice(movePrice));
  yield delay(60 * 1000);
  yield put(globalActions.getMovePrice());
}

export function* globalSaga() {
  yield takeLatest(globalActions.startTicker, startTicker);
  yield takeLatest(globalActions.initializeWeb3Auth, initializeWeb3Auth);
  yield takeLatest(globalActions.initOneSignal, initOneSignal);
  yield takeLatest(globalActions.login, login);
  yield takeLatest(
    globalActions.loginWithExternalWallet,
    loginWithExternalWallet
  );
  yield takeLatest(globalActions.switchAccount, switchAccount);
  yield takeLatest(globalActions.logout, logout);
  yield takeLatest(globalActions.joinOutpost, joinOutpost);
  yield takeLatest(globalActions.checkIfIHavePass, checkIfIHavePass);
  yield takeLatest(
    globalActions.setViewArchivedOutposts,
    setViewArchivedOutposts
  );
  yield debounce(
    5000,
    globalActions.toggleOutpostFromOnlineObject,
    getLatestOnlineUsersForOutposts
  );
  yield takeLatest(globalActions.getMovePrice, getMovePrice);
  // Example retry usage - uncomment and replace with your actual action and function
  // yield retry(
  //   5,
  //   globalActions.yourAction, // Replace with your actual action
  //   yourRetryableFunction
  // );
}
