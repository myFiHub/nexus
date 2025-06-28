import { PAGE_SIZE } from "app/lib/constants";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { myOutpostsActions } from "./slice";

// This saga fetches the initial page (page 0)
function* getOutposts(): Generator<any, void, any> {
  try {
    const [outposts]: [OutpostModel[]] = yield all([
      podiumApi.getMyOutposts(true, 0, PAGE_SIZE),
      put(myOutpostsActions.setErrorLoadingOutposts(undefined)),
      put(myOutpostsActions.setLoadingOutposts(true)),
    ]);
    yield put(myOutpostsActions.setOutposts(outposts));
  } catch (error) {
    yield put(
      myOutpostsActions.setErrorLoadingOutposts("Error loading outposts")
    );
  } finally {
    yield put(myOutpostsActions.setLoadingOutposts(false));
  }
}

// This saga fetches subsequent pages (page 1, 2, 3, etc.) for infinite scroll
function* loadMoreOutposts(): Generator<any, void, any> {
  try {
    const state: any = yield select();
    const { currentPage, pageSize, hasMoreOutposts } = state.myOutposts || {};

    if (!hasMoreOutposts) return;

    yield put(myOutpostsActions.setLoadingMoreOutposts(true));

    const nextPage = currentPage + 1;
    const outposts: OutpostModel[] = yield podiumApi.getMyOutposts(
      true,
      nextPage,
      pageSize
    );

    yield put(myOutpostsActions.appendOutposts(outposts));
  } catch (error) {
    yield put(
      myOutpostsActions.setErrorLoadingOutposts("Error loading more outposts")
    );
  } finally {
    yield put(myOutpostsActions.setLoadingMoreOutposts(false));
  }
}

export function* myOutpostsSaga(): Generator<any, void, any> {
  yield takeLatest(myOutpostsActions.getOutposts, getOutposts);
  yield takeLatest(myOutpostsActions.loadMoreOutposts, loadMoreOutposts);
}
