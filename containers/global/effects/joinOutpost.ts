import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "app/containers/ongoingOutpost/slice";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { put, select } from "redux-saga/effects";
import { GlobalDomains } from "../selectors";
import { globalActions } from "../slice";
import { _checkLumaAccess } from "./luma";
import { EasyAccess } from "./quickAccess";
import { OutpostAccesses } from "./types";

const BuyableTicketTypes = {
  onlyFriendTechTicketHolders: "friend_tech_key_holders",
  onlyArenaTicketHolders: "arena_ticket_holders",
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
    const accesses: OutpostAccesses = yield getOutpostAccesses({ outpost });
    console.log({ accesses });
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
  ////////////////////////////////////////////////////
  const lumaAccessResponse: OutpostAccesses | undefined =
    yield _checkLumaAccess({ outpost });
  if (lumaAccessResponse) {
    return lumaAccessResponse;
  }
  ////////////////////////////////////////////////////

  /*


    if (accessIsBuyableByTicket(outpost) || speakIsBuyableByTicket(outpost)) {
      final OutpostAccesses? accesses = await checkTicket(outpost: outpost);
      if (accesses?.canEnter == false) {
        Toast.error(
          title: "Error",
          message: "You need a ticket to join this Outpost",
        );
        return OutpostAccesses(canEnter: false, canSpeak: false);
      } else {
        return accesses != null
            ? accesses
            : OutpostAccesses(canEnter: false, canSpeak: false);
      }
    }

*/
}

function* openOutpost({ outpost }: { outpost: OutpostModel }) {
  useOnGoingOutpostSlice();
  const router: AppRouterInstance = yield select(GlobalDomains.router);
  yield put(onGoingOutpostActions.setOutpost(outpost));
  router.push(`/ongoing_outpost/${outpost.uuid}`);
}

export const accessIsBuyableByTicket = (outpost: OutpostModel): boolean => {
  const groupAccessType = outpost.enter_type;
  return (
    groupAccessType === BuyableTicketTypes.onlyArenaTicketHolders ||
    groupAccessType === BuyableTicketTypes.onlyFriendTechTicketHolders ||
    groupAccessType === BuyableTicketTypes.onlyPodiumPassHolders
  );
};

export const speakIsBuyableByTicket = (outpost: OutpostModel): boolean => {
  const groupSpeakType = outpost.speak_type;
  return (
    groupSpeakType === BuyableTicketTypes.onlyArenaTicketHolders ||
    groupSpeakType === BuyableTicketTypes.onlyFriendTechTicketHolders ||
    groupSpeakType === BuyableTicketTypes.onlyPodiumPassHolders
  );
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
