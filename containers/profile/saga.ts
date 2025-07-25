import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { NFTResponse } from "app/services/move/types";
import { put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "../global/selectors";
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

function* fetchNfts(action: ReturnType<typeof profileActions.fetchNfts>) {
  const silent = action.payload?.silent ?? false;
  try {
    if (!silent) {
      yield put(profileActions.setNftsLoading(true));
    }
    const nfts: NFTResponse[] = yield movementService.getMyNfts();
    yield put(profileActions.setNfts(nfts));
  } catch (error) {
    console.error(error);
    yield put(profileActions.setNftsError("Failed to fetch nfts"));
  } finally {
    if (!silent) {
      yield put(profileActions.setNftsLoading(false));
    }
  }
}

function* useNftAsProfilePicture(action: PayloadAction<NFTResponse>) {
  yield put(
    profileActions.settingNftAsProfilePicture(action.payload.image_url)
  );
  const tokenUri = action.payload.current_token_data.token_uri;
  try {
    const success: boolean = yield podiumApi.setNftAsProfileImage(tokenUri);

    if (!success) {
      toast.error("Failed to set nft as profile picture");
    } else {
      const user: User = yield select(GlobalSelectors.podiumUserInfo);
      if (user) {
        yield put(
          globalActions.setPodiumUserInfo({
            ...user,
            image: tokenUri,
          })
        );
        toast.success("Nft is set as profile picture");
      }
    }
  } catch (error) {
  } finally {
    yield put(profileActions.settingNftAsProfilePicture(undefined));
  }
}

export function* profileSaga() {
  yield takeLatest(profileActions.makeAccountPrimary.type, makeAccountPrimary);
  yield takeLatest(profileActions.deleteAccount.type, deleteAccount);
  yield takeLatest(profileActions.fetchNfts.type, fetchNfts);
  yield takeLatest(
    profileActions.useNftAsProfilePicture.type,
    useNftAsProfilePicture
  );
}
