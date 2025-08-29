import { IProvider, UserInfo, Web3Auth } from "@web3auth/modal";
import { put, select } from "redux-saga/effects";
import { GlobalSelectors } from "../../selectors";
import { getPrivateKey } from "../socialPrivateKey";
import { ethers } from "ethers";
import { movementService } from "app/services/move/aptosMovement";
import {
  signMessage,
  signMessageWithTimestamp,
} from "app/lib/signWithPrivateKey";
import { stringContainsOneOfAvailableSocialLogins } from "../../utils/social_login_types";
import { toast } from "app/lib/toast";
import {
  ConnectNewAccountRequest,
  LoginRequest,
  User,
} from "app/services/api/types";
import podiumApi from "app/services/api";
import { detached_afterGettingPodiumUser } from "../login/afterGettingPodiumUser";
import { globalActions } from "../../slice";

export function* detached_connectSocialToSocial() {
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
                    savedName: response.user?.name ?? "",
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
