import {
  confirmDialog,
  ConfirmDialogResult,
} from "app/components/Dialog/confirmDialog";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import {
  LiveMember,
  OutpostLiveData,
  OutpostModel,
  User,
} from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { wsClient } from "app/services/wsClient/client";
import {
  OutgoingMessage,
  OutgoingMessageType,
} from "app/services/wsClient/types";
import { put, select, takeLatest } from "redux-saga/effects";
import { EasyAccess } from "../global/effects/quickAccess";
import { GlobalSelectors } from "../global/selectors";
import { onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions } from "./slice";

// Add type definition for cheerBoo parameters
type CheerBooParams = Parameters<typeof movementService.cheerBoo>[0];

function* getOutpost(
  action: ReturnType<typeof onGoingOutpostActions.getOutpost>
) {
  try {
    const { id } = action.payload;
    yield put(onGoingOutpostActions.isGettingOutpost(true));
    const outpost: OutpostModel | undefined = yield podiumApi.getOutpost(id);
    console.log("Outpost:", outpost);
    if (outpost) {
      yield put(onGoingOutpostActions.setOutpost(outpost));
    }
  } catch (error) {
    console.error(error);
  } finally {
    yield put(onGoingOutpostActions.isGettingOutpost(false));
  }
}

function* leaveOutpost(
  action: ReturnType<typeof onGoingOutpostActions.leaveOutpost>
) {
  const outpost = action.payload;
  yield put(onGoingOutpostActions.setOutpost(undefined));
  yield put(
    onGoingOutpostActions.setAccesses({ canEnter: false, canSpeak: false })
  );
  const leaveMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.LEAVE,
    outpost_uuid: outpost.uuid,
  };
  wsClient.send(leaveMessage);
}

function* like(action: ReturnType<typeof onGoingOutpostActions.like>) {
  const { targetUserAddress } = action.payload;
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to like");
    return;
  }
  const likeMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.LIKE,
    outpost_uuid: outpost.uuid,
    data: {
      react_to_user_address: targetUserAddress,
    },
  };
  wsClient.send(likeMessage);
}

function* dislike(action: ReturnType<typeof onGoingOutpostActions.dislike>) {
  const { targetUserAddress } = action.payload;
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to dislike");
    return;
  }
  const dislikeMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.DISLIKE,
    outpost_uuid: outpost.uuid,
    data: {
      react_to_user_address: targetUserAddress,
    },
  };
  wsClient.send(dislikeMessage);
}

function* startSpeaking(
  action: ReturnType<typeof onGoingOutpostActions.startSpeaking>
) {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to start speaking");
    return;
  }
  const startSpeakingMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.START_SPEAKING,
    outpost_uuid: outpost.uuid,
  };
  wsClient.send(startSpeakingMessage);
}

function* stopSpeaking(
  action: ReturnType<typeof onGoingOutpostActions.stopSpeaking>
) {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to stop speaking");
    return;
  }
  const stopSpeakingMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.STOP_SPEAKING,
    outpost_uuid: outpost.uuid,
  };
  wsClient.send(stopSpeakingMessage);
}

function* startRecording(
  action: ReturnType<typeof onGoingOutpostActions.startRecording>
) {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to start recording");
    return;
  }
  const startRecordingMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.START_RECORDING,
    outpost_uuid: outpost.uuid,
  };
  wsClient.send(startRecordingMessage);
}

function* cheerBoo(action: ReturnType<typeof onGoingOutpostActions.cheerBoo>) {
  const { user, cheer } = action.payload;
  const myUser: User | undefined = yield select(GlobalSelectors.podiumUserInfo);
  if (!myUser) {
    toast.error("you are not logged in");
    return;
  }
  const targetUserAddress = user.address;
  let targetUserAptosAddress = user.primary_aptos_address || user.aptos_address;

  if (!targetUserAptosAddress) {
    toast.error("No movement address found");
    return;
  }

  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to boo");
    return;
  }
  let amount = "0";
  const results: ConfirmDialogResult = yield confirmDialog({
    title: `${cheer ? "cheer" : "boo"}`,
    content: `How much do you want to pay to ${cheer ? "cheer" : "boo"}?`,
    confirmOpts: {
      confirmText: "Boo",
    },
    inputOpts: {
      inputType: "number",
      inputPlaceholder: "Enter amount",
    },
  });

  if (results.confirmed) {
    amount = results.enteredText ?? "0";
  }
  if (amount === "0") {
    toast.error("Amount is 0");
    return;
  }

  const liveMembers: LiveMember[] = yield detatched_getLiveMembers();
  if (liveMembers.length == 0) {
    toast.error("No live members");
    yield put(onGoingOutpostActions.leaveOutpost(outpost));
    return;
  }

  let rawReceiverAddresses: (string | undefined)[] = liveMembers
    .map((member) => member.primary_aptos_address || member.aptos_address)
    .filter((address): address is string => address !== undefined);

  const isSelfReaction =
    targetUserAddress === EasyAccess.getInstance().myUser?.address;
  const isBoo = !cheer;

  if (isSelfReaction && cheer) {
    const myAptosAddress = myUser.aptos_address;
    const myPrimaryAptosAddress =
      liveMembers.find((member) => member.uuid === myUser.uuid)
        ?.primary_aptos_address || myUser.aptos_address;
    // remove both this addresses from rawReceiverAddresses
    rawReceiverAddresses = rawReceiverAddresses.filter(
      (address) =>
        address !== myAptosAddress && address !== myPrimaryAptosAddress
    );

    if (rawReceiverAddresses.length == 0) {
      toast.error("No receiver addresses");
      return;
    }
  }

  if (rawReceiverAddresses.length == 0) {
    targetUserAptosAddress = process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!;
    rawReceiverAddresses = [process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!];
  }

  const scCallOpts: CheerBooParams = {
    target: targetUserAptosAddress,
    receiverAddresses: [],
    amount: Number(amount),
    cheer: cheer,
    outpostId: outpost.uuid,
  };

  const resultFromScInteraction: [boolean | null, string | null] =
    yield movementService.cheerBoo(scCallOpts);

  if (resultFromScInteraction[0] === true) {
    toast.success(`${cheer ? "Cheer" : "Boo"} successful`);
    const booMessage: OutgoingMessage = {
      message_type: cheer ? OutgoingMessageType.CHEER : OutgoingMessageType.BOO,
      outpost_uuid: outpost.uuid,
      data: {
        chain_id: 126,
        react_to_user_address: targetUserAddress,
        tx_hash: resultFromScInteraction[1]!,
      },
    };
    wsClient.send(booMessage);
  } else {
    toast.error("Boo failed");
  }
}

function* getLiveMembers(
  action: ReturnType<typeof onGoingOutpostActions.getLiveMembers>
) {
  yield put(onGoingOutpostActions.isGettingLiveMembers(true));
  yield detatched_getLiveMembers();
  yield put(onGoingOutpostActions.isGettingLiveMembers(false));
}

function* detatched_getLiveMembers() {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to get live members");
    return [];
  }
  const liveData: OutpostLiveData | undefined =
    yield podiumApi.getLatestLiveData(outpost.uuid);
  if (!liveData) {
    console.error("Failed to get live members");
    return [];
  }
  const liveMembers: { [address: string]: LiveMember } = {};
  liveData.members.forEach((member) => {
    liveMembers[member.address] = member;
  });
  yield put(onGoingOutpostActions.setLiveMembers(liveMembers));
  return liveData.members;
}

export function* onGoingOutpostSaga() {
  yield takeLatest(onGoingOutpostActions.getOutpost, getOutpost);
  yield takeLatest(onGoingOutpostActions.leaveOutpost, leaveOutpost);
  yield takeLatest(onGoingOutpostActions.like, like);
  yield takeLatest(onGoingOutpostActions.dislike, dislike);
  yield takeLatest(onGoingOutpostActions.startSpeaking, startSpeaking);
  yield takeLatest(onGoingOutpostActions.stopSpeaking, stopSpeaking);
  yield takeLatest(onGoingOutpostActions.startRecording, startRecording);
  yield takeLatest(onGoingOutpostActions.cheerBoo, cheerBoo);
  yield takeLatest(onGoingOutpostActions.getLiveMembers, getLiveMembers);
}
