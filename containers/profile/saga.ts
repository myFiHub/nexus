import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { put, takeLatest } from "redux-saga/effects";
import { globalActions } from "../global/slice";
import { profileActions } from "./slice";

function* makeAccountPrimary(action: PayloadAction<string>) {
  try {
    yield put(
      profileActions.setAddressOfAccountThatIsBeingMadePrimary(action.payload)
    );
    const success: boolean = yield podiumApi.setAccountAsPrimary(
      action.payload
    );
    if (!success) {
      toast.error("Failed to make account primary");
    } else {
      yield put(globalActions.setAccountAsPrimary(action.payload));
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(
      profileActions.setAddressOfAccountThatIsBeingMadePrimary(undefined)
    );
  }
}

function* deleteAccount() {
  try {
    const response: boolean = yield podiumApi.deactivateAccount();
    if (response) {
      yield put(globalActions.logout());
    }
  } catch (error) {
    console.error(error);
  }
}

export function* profileSaga() {
  yield takeLatest(profileActions.makeAccountPrimary.type, makeAccountPrimary);
  yield takeLatest(profileActions.deleteAccount.type, deleteAccount);
}
