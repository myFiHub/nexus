import { Web3Auth } from "@web3auth/modal";
import { select } from "redux-saga/effects";
import { GlobalSelectors } from "../selectors";

export function* getPrivateKey() {
  const web3Auth: Web3Auth = yield select(GlobalSelectors.web3Auth);
  if (!web3Auth) return;
  const provider = web3Auth.provider!;
  const privateKey: unknown = yield provider.request({
    method: "private_key",
  });
  return privateKey;
}
