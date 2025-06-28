import {
  reminderDialog,
  ReminderDialogResult,
} from "app/components/Dialog/reminder";
import { BuyableTicketTypes } from "app/components/outpost/types";
import { toast } from "app/lib/toast";
import { generateOutpostShareUrl, isDev } from "app/lib/utils";
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
import { revalidateService } from "../../services/revalidate";
import { GlobalSelectors } from "../global/selectors";
import { myOutpostsActions, useMyOutpostsSlice } from "../myOutposts/slice";
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
    if (isDev) {
      console.error("lumaEvent is undefined");
    }
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
    if (isDev) {
      console.error("failed to add hosts");
    }
    toast.warning("failed to add hosts");
  }
  try {
    const guestsList = guests.map((guest) => ({
      email: guest.email,
      name: guest.name,
    }));
    yield lumaApi.addGuests(guestsList, api_id);
    if (isDev) {
      console.log("guests added");
    }
  } catch (error) {
    if (isDev) {
      console.error("failed to add guests");
    }
    toast.warning("failed to add guests");
  }
  if (lumaEvent) {
    try {
      const updatedOutpost: boolean = (yield podiumApi.updateOutpost({
        uuid: outpost.uuid,
        luma_event_id: lumaEvent.event.api_id,
      })) as boolean;
      if (isDev) {
        console.log("updatedOutpost", updatedOutpost);
      }
      return updatedOutpost;
    } catch (error) {
      if (isDev) {
        console.error("error", error);
      }
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

    const { luma_guests, luma_hosts, enabled_luma, ...rest } = params;

    const outpost: OutpostModel | undefined = yield podiumApi.createOutpost(
      rest
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
    }

    if (params.scheduled_for) {
      console.log("calling setReminder");
      yield detached_setReminder({
        outpost,
        scheduledFor: params.scheduled_for,
      });
    }
    if (enabled_luma && luma_guests && luma_hosts && luma_hosts.length > 0) {
      console.log("calling createLumaEvent");
      const lumaEventCreated: boolean = yield detached_createLumaEvent({
        guests: luma_guests || [],
        hosts: luma_hosts || [],
        outpost,
      });
      if (!lumaEventCreated) {
        toast.error("Failed to create luma event");
      }
    }

    yield put(createOutpostActions.setIsSubmitting(false));
    yield put(createOutpostActions.reset());
    const router: AppRouterInstance = yield select(GlobalSelectors.router);

    // Use client-side revalidation service instead of server actions
    try {
      yield revalidateService.revalidateMultiple({
        outpostId: outpost.uuid,
        allOutposts: true,
      });
      useMyOutpostsSlice();
      yield put(myOutpostsActions.getOutposts());
    } catch (error) {
      console.error("Failed to revalidate pages:", error);
    }
    router.push(`/outpost_details/${outpost.uuid}`);
  } catch (error) {
    console.log({ error });
  } finally {
    yield put(createOutpostActions.setIsSubmitting(false));
  }
}

export function* createOutpostSaga() {
  yield takeLatest(createOutpostActions.submit.type, createOutpost);
}
