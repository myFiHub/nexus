import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { put, takeLatest } from "redux-saga/effects";
import { onGoingOutpostActions } from "./slice";

function* getOutpost(
  action: ReturnType<typeof onGoingOutpostActions.getOutpost>
) {
  try {
    const { id } = action.payload;
    yield put(onGoingOutpostActions.isGettingOutpost(true));
    const outpost: OutpostModel | undefined = yield podiumApi.getOutpost(id);
    console.log("Outpost:", outpost);
    if (outpost) {
      yield put(onGoingOutpostActions.setOutpost(outpost));
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(onGoingOutpostActions.isGettingOutpost(false));
  }
}

export function* onGoingOutpostSaga() {
  yield takeLatest(onGoingOutpostActions.getOutpost, getOutpost);
}
