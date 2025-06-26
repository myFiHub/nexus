import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import {
  CreateOutpostRequest,
  OutpostModel,
  UpdateOutpostRequest,
} from "app/services/api/types";
import { outpostImageService } from "app/services/imageUpload";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "../global/selectors";
import { revalidateAllOutpostsPage } from "../userDetails/serverActions/revalidateAllOutpostsPage";
import { createOutpostSelectors } from "./selectors";
import { createOutpostActions } from "./slice";
function* validateFields(
  params: CreateOutpostRequest
): Generator<unknown, boolean, unknown> {
  if (!params.name || params.name.length < 5) {
    yield put(
      createOutpostActions.setError({
        field: "name",
        message: "Name must be at least 5 characters",
      })
    );
    return false;
  }
  if (!params.subject || params.subject.length > 50) {
    yield put(
      createOutpostActions.setError({
        field: "subject",
        message: "Subject must be less than 50 characters",
      })
    );
    return false;
  }
  if (!params.tags || params.tags.length > 10) {
    yield put(
      createOutpostActions.setError({
        field: "tags",
        message: "Tags must be less than 10",
      })
    );
    return false;
  }
  return true;
}

function* createOutpost(
  action: ReturnType<typeof createOutpostActions.submit>
) {
  yield put(createOutpostActions.setIsSubmitting(true));
  try {
    const params: CreateOutpostRequest = yield select(
      createOutpostSelectors.allFields
    );
    if (!params.tickets_to_enter) {
      params.tickets_to_enter = [];
    }
    if (!params.tickets_to_speak) {
      params.tickets_to_speak = [];
    }
    const validated: boolean = yield validateFields(params);
    if (!validated) {
      yield put(createOutpostActions.setIsSubmitting(false));
      return;
    }
    const imageFile = params.image as unknown as File;
    params.image = "";
    const outpost: OutpostModel | undefined = yield podiumApi.createOutpost(
      params
    );
    if (!outpost) {
      toast.error("Failed to create outpost");
      return;
    } else {
      const uploadedImageUrl: string | undefined =
        yield outpostImageService.uploadImage(imageFile, outpost.uuid);
      if (uploadedImageUrl) {
        outpost.image = uploadedImageUrl;
      }
      const updateRequest: UpdateOutpostRequest = {
        uuid: outpost.uuid,
        image: uploadedImageUrl,
      };
      const updatedOutpost: boolean = yield podiumApi.updateOutpost(
        updateRequest
      );
      if (!updatedOutpost) {
        toast.error("Failed to upload the image, change it later");
      }
      yield put(createOutpostActions.setIsSubmitting(false));
      yield put(createOutpostActions.reset());
      const router: AppRouterInstance = yield select(GlobalSelectors.router);
      router.replace(`/outpost_details/${outpost.uuid}`);
      revalidateAllOutpostsPage();
    }
  } catch (error) {
  } finally {
    yield put(createOutpostActions.setIsSubmitting(false));
  }
}

export function* createOutpostSaga() {
  yield takeLatest(createOutpostActions.submit.type, createOutpost);
}
