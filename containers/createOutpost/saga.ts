import {
  reminderDialog,
  ReminderDialogResult,
} from "app/components/Dialog/reminder";
import { BuyableTicketTypes } from "app/components/outpost/types";
import { toast } from "app/lib/toast";
import { generateOutpostShareUrl } from "app/lib/utils";
import podiumApi from "app/services/api";
import {
  AddGuestModel,
  AddHostModel,
  lumaApi,
  LumaCreateEvent,
  LumaEventModel,
} from "app/services/api/luma";
import {
  CreateOutpostRequest,
  OutpostModel,
  SetOrRemoveReminderRequest,
  UpdateOutpostRequest,
} from "app/services/api/types";
import { outpostImageService } from "app/services/imageUpload";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "../global/selectors";
import { revalidateAllOutpostsPage } from "../userDetails/serverActions/revalidateAllOutpostsPage";
import { revalidateOutpostDetailsPage } from "../userDetails/serverActions/revalidateOutpostDetailsPage";
import { createOutpostSelectors } from "./selectors";
import { createOutpostActions } from "./slice";
function* validateFields(
  params: CreateOutpostRequest
): Generator<unknown, boolean, unknown> {
  const trimmedName = params.name?.trim();
  if (!trimmedName || trimmedName.length < 5) {
    yield put(
      createOutpostActions.setError({
        field: "name",
        message: "Name must be at least 5 characters",
      })
    );
    return false;
  }
  if (params.subject.length > 50) {
    yield put(
      createOutpostActions.setError({
        field: "subject",
        message: "Subject must be less than 50 characters",
      })
    );
    return false;
  }
  if (params.tags.length > 10) {
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

function* detached_setReminder({
  outpost,
  scheduledFor,
}: {
  outpost: OutpostModel;
  scheduledFor: number;
}) {
  const reminderMinutes: ReminderDialogResult = yield reminderDialog({
    title: "Set Reminder",
    content: "Do you want to be reminded to attend this outpost?",
    scheduledFor,
    confirmOpts: {
      text: "confirm",
    },
    cancelOpts: {
      text: "close",
    },
  });
  if (reminderMinutes.confirmed) {
    const minutesBefore = reminderMinutes.reminderMinutes ?? 0;

    const remindRequest: SetOrRemoveReminderRequest = {
      uuid: outpost.uuid,
      reminder_offset_minutes:
        // -1 means remove the reminder
        minutesBefore !== -1 ? minutesBefore : undefined,
    };
    const isSetReminder: boolean = yield podiumApi.setOrRemoveReminder(
      remindRequest
    );
    if (!isSetReminder) {
      toast.error("Failed to set reminder");
      return false;
    }
    return true;
  }

  return false;
}

function* detached_createLumaEvent({
  guests,
  hosts,
  outpost,
}: {
  guests: AddGuestModel[];
  hosts: AddHostModel[];
  outpost: OutpostModel;
}): Generator<unknown, boolean, unknown> {
  const isoDate = new Date(outpost.scheduled_for).toISOString();
  const oneHourAfter = new Date(
    outpost.scheduled_for + 60 * 60 * 1000
  ).toISOString();

  const createRequest: LumaCreateEvent = {
    name: outpost.name,
    start_at: isoDate,
    meeting_url: generateOutpostShareUrl(outpost.uuid),
    timezone: "UTC",
    end_at: oneHourAfter,
    require_rsvp_approval: true,
  };

  const lumaEvent: LumaEventModel | undefined = (yield lumaApi.createEvent(
    createRequest
  )) as LumaEventModel | undefined;
  if (!lumaEvent) {
    return false;
  }
  const { event } = lumaEvent;
  const { api_id } = event;
  try {
    const callArray: any = [];
    hosts.forEach((host) => {
      callArray.push(
        lumaApi.addHost({
          name: host.name,
          email: host.email,
          event_api_id: api_id,
        })
      );
    });
    yield all(callArray);
  } catch (error) {
    toast.warning("failed to add hosts");
  }
  try {
    const guestsList = guests.map((guest) => ({
      email: guest.email,
      name: guest.name,
    }));
    yield lumaApi.addGuests(guestsList, api_id);
  } catch (error) {
    toast.warning("failed to add guests");
  }
  if (lumaEvent) {
    try {
      const updatedOutpost: boolean = (yield podiumApi.updateOutpost({
        uuid: outpost.uuid,
        luma_event_id: lumaEvent.event.api_id,
      })) as boolean;
      return updatedOutpost;
    } catch (error) {
      return false;
    }
  }
  return false;
}

function* createOutpost(
  action: ReturnType<typeof createOutpostActions.submit>
) {
  yield put(createOutpostActions.setIsSubmitting(true));
  try {
    const params: CreateOutpostRequest = yield select(
      createOutpostSelectors.allFields
    );
    if (
      !params.tickets_to_enter ||
      params.enter_type !== BuyableTicketTypes.onlyPodiumPassHolders
    ) {
      params.tickets_to_enter = [];
    }
    if (
      !params.tickets_to_speak ||
      params.speak_type !== BuyableTicketTypes.onlyPodiumPassHolders
    ) {
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
    } else if (imageFile && imageFile instanceof File) {
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

      if (params.scheduled_for) {
        yield detached_setReminder({
          outpost,
          scheduledFor: params.scheduled_for,
        });
      }
      if (
        params.enabled_luma &&
        params.luma_guests &&
        params.luma_hosts &&
        params.luma_hosts.length > 0
      ) {
        const lumaEventCreated: boolean = yield detached_createLumaEvent({
          guests: params.luma_guests || [],
          hosts: params.luma_hosts || [],
          outpost,
        });
        if (!lumaEventCreated) {
          toast.error("Failed to create luma event");
        }
      }

      yield put(createOutpostActions.setIsSubmitting(false));
      yield put(createOutpostActions.reset());
      const router: AppRouterInstance = yield select(GlobalSelectors.router);
      revalidateAllOutpostsPage();
      revalidateOutpostDetailsPage(outpost.uuid);
      router.replace(`/outpost_details/${outpost.uuid}`);
    }
  } catch (error) {
  } finally {
    yield put(createOutpostActions.setIsSubmitting(false));
  }
}

export function* createOutpostSaga() {
  yield takeLatest(createOutpostActions.submit.type, createOutpost);
}
