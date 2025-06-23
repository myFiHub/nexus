import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "app/containers/ongoingOutpost/slice";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { OutpostModel, User } from "app/services/api/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { put, select } from "redux-saga/effects";
import { GlobalDomains } from "../selectors";
import { globalActions } from "../slice";
import { EasyAccess } from "./quickAccess";
import { OutpostAccesses } from "./types";

export function* joinOutpost(
  action: ReturnType<typeof globalActions.joinOutpost>
) {
  const joiningId: string | undefined = yield select(
    GlobalDomains.joiningOutpostId
  );
  if (joiningId !== undefined) {
    return;
  }
  const { outpost: outpostData } = action.payload;
  yield put(globalActions.setJoiingOutpostId(outpostData.uuid));
  try {
    const outpost: OutpostModel | undefined = yield podiumApi.getOutpost(
      outpostData.uuid
    );
    if (!outpost) {
      toast.error("Outpost not found");
      return;
    }
  } catch (error) {
    toast.error("error while getting outpost data");
  } finally {
    yield put(globalActions.setJoiingOutpostId(undefined));
  }
}

function* getOutpostAccesses({
  outpost,
}: {
  outpost: OutpostModel;
}): Generator<any, OutpostAccesses, any> {
  const myUser: User = yield EasyAccess.myUser();
  return {
    canEnter: false,
    canSpeak: false,
  };
}

function* openOutpost({ outpost }: { outpost: OutpostModel }) {
  useOnGoingOutpostSlice();
  const router: AppRouterInstance = yield select(GlobalDomains.router);
  yield put(onGoingOutpostActions.setOutpost(outpost));
  router.push(`/ongoing_outpost/${outpost.uuid}`);
}
