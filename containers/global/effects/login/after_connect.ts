import { UserInfo } from "@web3auth/modal";
import { CookieKeys, getClientCookie } from "app/lib/client-cookies";
import podiumApi from "app/services/api";
import {
  AdditionalDataForLogin,
  LoginRequest,
  User,
} from "app/services/api/types";
import { put, select } from "redux-saga/effects";
import { globalActions } from "../../slice";
import { movementService } from "app/services/move/aptosMovement";
import { accountType } from "app/containers/_externalWallets/slice";
import { externalWalletsSelectors } from "app/containers/_externalWallets/selectors";
import { toast } from "app/lib/toast";
import { validWalletNames } from "app/components/Dialog/loginMethodSelect";
import { GlobalSelectors } from "../../selectors";
import { hasCreatorPodiumPass } from "../podiumPassCheck";
import { getPrivateKey } from "../socialPrivateKey";
import { ethers } from "ethers";
import {
  signMessageWithTimestamp,
  signMessageWithTimestampUsingExternalWallet,
} from "app/lib/signWithPrivateKey";
import {
  referrerDialog,
  ReferrerDialogResult,
} from "app/components/Dialog/referrerDialog";
import { isUuid } from "app/lib/utils";
import { detached_checkName } from "./check_name";
import { detached_afterGettingPodiumUser } from "./afterGettingPodiumUser";

export function* detached_afterConnect(
  userInfo: Partial<UserInfo>,
  isSocialLogin = true
) {
  try {
    const token = getClientCookie(CookieKeys.token);
    if (token && !isSocialLogin) {
      podiumApi.setToken(token);
      const myUser: User | undefined = yield podiumApi.getMyUserData({});
      if (myUser) {
        const savedName: string = yield detached_checkName({ user: myUser });
        if (!savedName) {
          yield put(globalActions.logout());
          return;
        }
        movementService.connectedToExternalWallet = true;
        yield detached_afterGettingPodiumUser({
          user: myUser,
          token,
          savedName,
        });
        return;
      }
    }

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

      const publicKey = account.publicKey;
      let publicKeyString =
        typeof publicKey === "string"
          ? publicKey
          : Array.from(publicKey)
              .map((byte) => byte.toString(16).padStart(2, "0"))
              .join("");

      const aptosAddress = account.address;
      const identifierId = account.address.toString();
      const loginType: validWalletNames = yield select(
        GlobalSelectors.connectedExternalWallet
      );
      const hasCreatorPass: boolean = yield hasCreatorPodiumPass({
        buyerAddress: aptosAddress,
      });

      yield detached_continueWithLoginRequestAndAdditionalData({
        loginRequest: {
          // this will be handled and changed in next step
          signature: "placeholder",
          // this will be handled and changed in next step
          timestamp: 0,
          username: publicKeyString,
          aptos_address: aptosAddress,
          has_ticket: hasCreatorPass,
          login_type: loginType.toLowerCase().split(" ")[0],
          login_type_identifier: identifierId,
        },
        additionalDataForLogin: {},
        isSocialLogin: false,
      });
    } else {
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
      message: loginRequest.aptos_address,
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
  } else if (!response.user) {
    toast.error(response.error ?? "Error logging in, please try again");
    yield put(globalActions.logout());
    return;
  }
  const user = response.user;
  const savedName: string = yield detached_checkName({ user });
  if (!savedName) {
    yield put(globalActions.logout());
    return;
  }

  if (user) {
    yield detached_afterGettingPodiumUser({
      user,
      token: response.token ?? "",
      savedName,
    });
  } else {
    yield put(globalActions.logout());
  }
}
