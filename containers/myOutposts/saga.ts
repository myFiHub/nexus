"use client";
import { PAGE_SIZE } from "app/lib/constants";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "../global/selectors";
import { myOutpostsSelectors } from "./selectors";
import { myOutpostsActions } from "./slice";

let gotOnce = false;
// This saga fetches the initial page (page 0)
function* getOutposts(
  action: ReturnType<typeof myOutpostsActions.getOutposts>
): Generator<any, void, any> {
  const viewArchivedOutposts = yield select(
    GlobalSelectors.viewArchivedOutposts
  );
  try {
    const [outposts]: [OutpostModel[]] = yield all([
      podiumApi.getMyOutposts(viewArchivedOutposts, 0, PAGE_SIZE),
      put(myOutpostsActions.setErrorLoadingOutposts(undefined)),
      ...(gotOnce ? [] : [put(myOutpostsActions.setLoadingOutposts(true))]),
    ]);

    gotOnce = true;
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
    const correntOutposts = yield select(myOutpostsSelectors.outposts);
    const currentPage = yield select(myOutpostsSelectors.currentPage);
    const pageSize = yield select(myOutpostsSelectors.pageSize);
    const hasMoreOutposts = yield select(myOutpostsSelectors.hasMoreOutposts);

    if (!hasMoreOutposts || correntOutposts.length === 0) return;

    const viewArchivedOutposts = yield select(
      GlobalSelectors.viewArchivedOutposts
    );

    yield put(myOutpostsActions.setLoadingMoreOutposts(true));

    const nextPage = currentPage + 1;
    const outposts: OutpostModel[] = yield podiumApi.getMyOutposts(
      viewArchivedOutposts,
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
