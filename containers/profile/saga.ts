import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { put, takeLatest } from "redux-saga/effects";
import { profileActions } from "./slice";
import { globalActions } from "../global/slice";

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

export function* profileSaga() {
  yield takeLatest(profileActions.makeAccountPrimary.type, makeAccountPrimary);
}
