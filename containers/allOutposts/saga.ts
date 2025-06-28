import { PAGE_SIZE } from "app/lib/constants";
import { all, put, select, takeLatest } from "redux-saga/effects";
import podiumApi from "../../services/api";
import { OutpostModel } from "../../services/api/types";
import { allOutpostsActions } from "./slice";

// This saga fetches the initial page (page 0) - only used when there's no SSR data
function* getOutposts(): Generator<any, void, any> {
  try {
    const [outposts]: [OutpostModel[]] = yield all([
      podiumApi.getOutposts(0, PAGE_SIZE),
      put(allOutpostsActions.setErrorLoadingOutposts(undefined)),
      put(allOutpostsActions.setLoadingOutposts(true)),
    ]);
    yield put(allOutpostsActions.setOutposts(outposts));
  } catch (error) {
    yield put(
      allOutpostsActions.setErrorLoadingOutposts("Error loading outposts")
    );
  } finally {
    yield put(allOutpostsActions.setLoadingOutposts(false));
  }
}

// This saga fetches subsequent pages (page 1, 2, 3, etc.) for infinite scroll
function* loadMoreOutposts(): Generator<any, void, any> {
  try {
    const state: any = yield select();
    const { currentPage, pageSize, hasMoreOutposts } = state.allOutposts || {};

    if (!hasMoreOutposts) return;

    yield put(allOutpostsActions.setLoadingMoreOutposts(true));

    // Client-side starts from page 1 (since SSR data is page 0)
    const nextPage = currentPage + 1;
    const outposts: OutpostModel[] = yield podiumApi.getOutposts(
      nextPage,
      pageSize
    );

    yield put(allOutpostsActions.appendOutposts(outposts));
  } catch (error) {
    yield put(
      allOutpostsActions.setErrorLoadingOutposts("Error loading more outposts")
    );
  } finally {
    yield put(allOutpostsActions.setLoadingMoreOutposts(false));
  }
}

export function* allOutpostsSaga(): Generator<any, void, any> {
  yield takeLatest(allOutpostsActions.getOutposts, getOutposts);
  yield takeLatest(allOutpostsActions.loadMoreOutposts, loadMoreOutposts);
}
