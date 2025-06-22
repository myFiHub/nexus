import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { all, put, takeLatest } from "redux-saga/effects";
import { myOutpostsActions } from "./slice";

function* getOutposts() {
  try {
    const [outposts]: [OutpostModel[]] = yield all([
      podiumApi.getMyOutposts(),
      put(myOutpostsActions.setErrorLoadingOutposts(undefined)),
      put(myOutpostsActions.setLoadingOutposts(true)),
    ]);
    yield put(myOutpostsActions.setOutposts(outposts));
  } catch (error) {
    yield put(
      myOutpostsActions.setErrorLoadingOutposts("error loading outposts")
    );
  } finally {
    yield put(myOutpostsActions.setLoadingOutposts(false));
  }
}

export function* myOutpostsSaga() {
  yield takeLatest(myOutpostsActions.getOutposts, getOutposts);
}
