import {
  confirmDialog,
  ConfirmDialogResult,
} from "app/components/Dialog/confirmDialog";
import { detached_checkPass } from "app/containers/_assets/saga";
import { useAssetsSlice } from "app/containers/_assets/slice";
import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "app/containers/ongoingOutpost/slice";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { LiveMember, OutpostModel } from "app/services/api/types";
import { wsClient } from "app/services/wsClient/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { put, select } from "redux-saga/effects";
import { GlobalDomains } from "../selectors";
import { globalActions } from "../slice";
import { _checkLumaAccess } from "./luma";
import { EasyAccess } from "./quickAccess";
import { OutpostAccesses } from "./types";

const BuyableTicketTypes = {
  onlyPodiumPassHolders: "podium_pass_holders",
} as const;

const FreeOutpostAccessTypes = {
  public: "everyone",
  onlyLink: "having_link",
  invited_users: "invited_users",
} as const;

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

    const accesses: OutpostAccesses = yield getOutpostAccesses({
      outpost,
      joiningByLink: false,
    });
    if (accesses && accesses.canEnter) {
      yield openOutpost({ outpost, accesses });
    }
  } catch (error) {
    toast.error("error while getting outpost data");
  } finally {
    yield put(globalActions.setJoiingOutpostId(undefined));
  }
}

function* getOutpostAccesses({
  outpost,
  joiningByLink,
}: {
  outpost: OutpostModel;
  joiningByLink: boolean;
}): Generator<any, OutpostAccesses | undefined, any> {
  const myUser = EasyAccess.getInstance().myUser;
  ///////////////////////////////////////////////////
  const iAmOutpostCreator = outpost.creator_user_uuid == myUser.uuid;
  if (iAmOutpostCreator) {
    return {
      canEnter: true,
      canSpeak: true,
    };
  }
  ////////////////////////////////////////////////////
  if (outpost.is_archived) {
    toast.warning("This Outpost is Archived and no longer available");
    return {
      canEnter: false,
      canSpeak: false,
    };
  }

  //////////////////////////////////////////////////
  if (
    outpost.has_adult_content &&
    !EasyAccess.getInstance().myUser.is_over_18
  ) {
    const res: ConfirmDialogResult = yield confirmDialog({
      title: "Adult Content",
      content: "This Outpost has adult content, are you sure you want to join?",
      confirmOpts: {
        text: "I am over 18",
        colorScheme: "warning",
      },
      cancelOpts: {
        text: "cancel",
      },
    });
    if (!res.confirmed) {
      yield put(globalActions.setMyUserIsOver18(false));
      return {
        canEnter: false,
        canSpeak: false,
      };
    } else {
      yield put(globalActions.setMyUserIsOver18(true));
    }
  }
  //////////////////////////////////////////////////

  ////////////////////////////////////////////////////
  const lumaAccessResponse: OutpostAccesses | undefined =
    yield _checkLumaAccess({ outpost });
  if (lumaAccessResponse) {
    return lumaAccessResponse;
  }
  ////////////////////////////////////////////////////

  if (accessIsBuyableByTicket(outpost) || speakIsBuyableByTicket(outpost)) {
    useAssetsSlice();
    const accesses: OutpostAccesses | undefined = yield detached_checkPass({
      outpost,
    });
    if (accesses?.canEnter == false) {
      toast.error("You need a Podium Pass to join this Outpost");
      return {
        canEnter: false,
        canSpeak: false,
      };
    } else {
      return accesses !== undefined
        ? accesses
        : {
            canEnter: false,
            canSpeak: false,
          };
    }
  }
  //////////////////////////////////////////////////

  if (outpost.i_am_member)
    return {
      canEnter: true,
      canSpeak: canISpeakWithoutTicket(outpost),
    };
  if (outpost.enter_type == FreeOutpostAccessTypes.public)
    return {
      canEnter: true,
      canSpeak: canISpeakWithoutTicket(outpost),
    };
  if (outpost.enter_type == FreeOutpostAccessTypes.onlyLink) {
    if (joiningByLink == true) {
      return {
        canEnter: true,
        canSpeak: canISpeakWithoutTicket(outpost),
      };
    } else {
      toast.error("This is a private Outpost, you need an invite link to join");
      return { canEnter: false, canSpeak: false };
    }
  }
  //////////////////////////////////////////////////

  const invitedMembers = outpost.invites;
  if (outpost.enter_type == FreeOutpostAccessTypes.invited_users) {
    if (
      invitedMembers?.map((e) => e.invitee_uuid).includes(myUser.uuid) == true
    ) {
      return {
        canEnter: true,
        canSpeak: canISpeakWithoutTicket(outpost),
      };
    } else {
      toast.error("You need an invite to join this Outpost");
      return { canEnter: false, canSpeak: false };
    }
  }
  return {
    canEnter: false,
    canSpeak: false,
  };
}

function* openOutpost({
  outpost: receivedOutpost,
  accesses,
}: {
  outpost: OutpostModel;
  accesses: OutpostAccesses;
}) {
  useOnGoingOutpostSlice();
  const outpost = { ...receivedOutpost };
  const router: AppRouterInstance = yield select(GlobalDomains.router);
  const currentMembers: LiveMember[] = outpost.members ?? [];
  const iAmMember: LiveMember | undefined = currentMembers.find(
    (member) => member.uuid === EasyAccess.getInstance().myUser.uuid
  );
  if (!iAmMember) {
    const added: boolean = yield podiumApi.addMeAsMember(outpost.uuid);
    if (!added) {
      toast.error("Failed to add you as a member");
      return;
    }
    outpost.i_am_member = true;
    outpost.members_count = currentMembers.length + 1;
  }
  if (!accesses.canEnter) {
    toast.error("You don't have access to this Outpost");
    return;
  }

  const success: boolean = yield wsClient.asyncJoinOutpostWithRetry(
    outpost.uuid
  );
  if (success) {
    yield put(onGoingOutpostActions.setOutpost(outpost));
    yield put(onGoingOutpostActions.setAccesses(accesses));
    router.push(`/ongoing_outpost/${outpost.uuid}`);
  } else {
    toast.error("Failed to join Outpost");
  }
}

export const accessIsBuyableByTicket = (outpost: OutpostModel): boolean => {
  const groupAccessType = outpost.enter_type;
  return groupAccessType === BuyableTicketTypes.onlyPodiumPassHolders;
};

export const speakIsBuyableByTicket = (outpost: OutpostModel): boolean => {
  const groupSpeakType = outpost.speak_type;
  return groupSpeakType === BuyableTicketTypes.onlyPodiumPassHolders;
};

export const canEnterWithoutATicket = (outpost: OutpostModel): boolean => {
  const g = outpost;
  const amIInvited = g.i_am_member;

  if (g.enter_type === FreeOutpostAccessTypes.invited_users) {
    return amIInvited;
  }
  if (g.enter_type === FreeOutpostAccessTypes.public) {
    return true;
  }
  return false;
};

export const canISpeakWithoutTicket = (outpost: OutpostModel): boolean => {
  const myId = EasyAccess.getInstance().myUser.uuid;
  const iAmTheCreator = outpost.creator_user_uuid === myId;
  if (iAmTheCreator) return true;
  if (outpost.speak_type === FreeOutpostAccessTypes.invited_users) {
    // check if I am invited and am invited to speak
    const invitedMember = (outpost.invites ?? []).find(
      (element) => element.invitee_uuid === myId
    );
    if (invitedMember && invitedMember.can_speak === true) return true;
    return false;
  }

  const iAmAllowedToSpeak =
    outpost.speak_type === FreeOutpostAccessTypes.public;

  return iAmAllowedToSpeak;
};
