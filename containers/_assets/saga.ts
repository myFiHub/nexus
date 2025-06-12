import { movementService } from "app/services/move/aptosMovement";
import { put, takeLatest } from "redux-saga/effects";
import { assetsActions } from "./slice";

function* getBalance() {
  yield put(assetsActions.setBalance({ value: "100", loading: true }));
  try {
    const balance: bigint = yield movementService.balance();
    const balanceString = balance.toString();
    yield put(
      assetsActions.setBalance({
        value: balanceString,
        loading: false,
        error: undefined,
      })
    );
  } catch (error) {
    yield put(
      assetsActions.setBalance({
        value: "0",
        loading: false,
        error: "Failed to get balance",
      })
    );
  }
}

export function* assetsSaga() {
  yield takeLatest(assetsActions.getBalance.type, getBalance);
}
