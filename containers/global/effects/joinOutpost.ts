import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "app/containers/ongoingOutpost/slice";
import { OutpostModel } from "app/services/api/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { delay, put, select } from "redux-saga/effects";
import { GlobalDomains } from "../selectors";
import { globalActions } from "../slice";

export function* joinOutpost(
  action: ReturnType<typeof globalActions.joinOutpost>
) {
  const joiningId: string | undefined = yield select(
    GlobalDomains.joiningOutpostId
  );
  if (joiningId !== undefined) {
    return;
  }
  const outpost = action.payload;
  yield put(globalActions.setJoiingOutpostId(outpost.uuid));
  try {
    yield delay(3000);
    yield openOutpost(outpost);
  } catch (error) {
  } finally {
    yield put(globalActions.setJoiingOutpostId(undefined));
  }
}

function* openOutpost(outpost: OutpostModel) {
  useOnGoingOutpostSlice();
  const router: AppRouterInstance = yield select(GlobalDomains.router);
  yield put(onGoingOutpostActions.setOutpost(outpost));
  router.push(`/ongoing_outpost/${outpost.uuid}`);
}
