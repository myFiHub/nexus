import {
  dateTimePickerDialog,
  DateTimePickerDialogResult,
} from "app/components/Calendar/date-time";
import podiumApi from "app/services/api";
import { OutpostModel, UpdateOutpostRequest } from "app/services/api/types";
import { revalidateService } from "app/services/revalidate";
import { put, select, takeLatest } from "redux-saga/effects";
import { outpostDetailsActions } from "./slice";
import { GlobalSelectors } from "../global/selectors";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function* editScheduledDate(
  action: ReturnType<typeof outpostDetailsActions.editScheduledDate>
) {
  try {
    const { outpost } = action.payload;

    yield put(outpostDetailsActions.setEditingScheduledDate(true));
    const newScheduledFor: DateTimePickerDialogResult =
      yield dateTimePickerDialog({
        initialDate: outpost.scheduled_for
          ? new Date(outpost.scheduled_for)
          : undefined,
      });
    if (!newScheduledFor) {
      yield put(outpostDetailsActions.setEditingScheduledDate(false));
      return;
    }

    const updateRequest: UpdateOutpostRequest = {
      uuid: outpost.uuid,
      scheduled_for: newScheduledFor,
    };
    const edited: boolean = yield podiumApi.updateOutpost(updateRequest);
    if (edited) {
      yield put(
        outpostDetailsActions.setOutpost({
          ...outpost,
          scheduled_for: newScheduledFor,
        })
      );
      yield revalidateService.revalidateMultiple({
        outpostId: outpost.uuid,
        allOutposts: true,
      });
      const router: AppRouterInstance | undefined = yield select(
        GlobalSelectors.router
      );
      if (router) {
        router.refresh();
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(outpostDetailsActions.setEditingScheduledDate(false));
  }
}

function* getOutpost(
  action: ReturnType<typeof outpostDetailsActions.getOutpost>
) {
  const outpost: OutpostModel | undefined = yield podiumApi.getOutpost(
    action.payload
  );
  if (!outpost) {
    return;
  }
  yield put(outpostDetailsActions.setOutpost(outpost));
}

export function* outpostDetailsSaga() {
  yield takeLatest(outpostDetailsActions.getOutpost, getOutpost);
  yield takeLatest(outpostDetailsActions.editScheduledDate, editScheduledDate);
}
