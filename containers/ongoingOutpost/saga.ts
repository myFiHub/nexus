import {
  cheerBooAmountDialog,
  CheerBooAmountDialogResult,
} from "app/components/Dialog/cheerBooAmountDialog";
import { checkAudioPermission } from "app/lib/audioPermissions";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { isDev } from "app/lib/utils";
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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  all,
  debounce,
  delay,
  put,
  select,
  takeLatest,
} from "redux-saga/effects";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { GlobalSelectors } from "../global/selectors";
import { globalActions } from "../global/slice";
import { confettiEventBus } from "./eventBusses/confetti";
import { onGoingOutpostDomains, onGoingOutpostSelectors } from "./selectors";
import { onGoingOutpostActions } from "./slice";

// Add type definition for cheerBoo parameters

function* getOutpost(
  action: ReturnType<typeof onGoingOutpostActions.getOutpost>
) {
  try {
    const hasAudioPermission: boolean = yield checkAudioPermission();
    if (!hasAudioPermission) {
      yield put(onGoingOutpostActions.setHasAudioPermission(false));
      toast.error("Microphone permission is denied");
    }
    yield put(onGoingOutpostActions.setHasAudioPermission(true));

    const { id } = action.payload;
    yield put(onGoingOutpostActions.isGettingOutpost(true));
    const outpost: OutpostModel | undefined = yield podiumApi.getOutpost(id);
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
  yield put(onGoingOutpostActions.setLeaving(true));
  yield all([
    put(
      onGoingOutpostActions.setAccesses({ canEnter: false, canSpeak: false })
    ),
    put(onGoingOutpostActions.setMeetApiObj(undefined)),
    put(onGoingOutpostActions.setJoined(false)),
    put(onGoingOutpostActions.setAmIMuted(true)),
    put(onGoingOutpostActions.setLiveMembers({})),
  ]);
  const leaveMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.LEAVE,
    outpost_uuid: outpost.uuid,
  };
  yield wsClient.send(leaveMessage);
  const router: AppRouterInstance = yield select(GlobalSelectors.router);
  router.replace(AppPages.outpostDetails(outpost.uuid));
  yield delay(5000);
  yield put(onGoingOutpostActions.setLeaving(false));
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
  try {
    if (cheer) {
      yield put(
        onGoingOutpostActions.setIsCheeringAddress({ address: user.address })
      );
    } else {
      yield put(
        onGoingOutpostActions.setIsBooingAddress({ address: user.address })
      );
    }
    const myUser: User | undefined = yield select(
      GlobalSelectors.podiumUserInfo
    );
    if (!myUser) {
      toast.error("you are not logged in");
      return;
    }
    const targetUserAddress = user.address;
    let targetUserAptosAddress =
      user.primary_aptos_address || user.aptos_address;

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

    const isSelfReaction = targetUserAddress === myUser.address;
    let amount = "0";
    const results: CheerBooAmountDialogResult = yield cheerBooAmountDialog({
      cheer,
      member: user,
      isMe: isSelfReaction,
    });
    if (results !== undefined) {
      amount = results.toString();
    }
    if (amount === "0") {
      if (cheer) {
        yield put(
          onGoingOutpostActions.setIsCheeringAddress({ address: undefined })
        );
      } else {
        yield put(
          onGoingOutpostActions.setIsBooingAddress({ address: undefined })
        );
      }
      return;
    }
    // amount is absolute value
    amount = Math.abs(Number(amount)).toString();

    const liveMembers: LiveMember[] = yield detatched_getLiveMembers();
    if (liveMembers.length == 0) {
      toast.error("No live members");
      yield put(onGoingOutpostActions.leaveOutpost(outpost));
      return;
    }

    let rawReceiverAddresses: string[] = liveMembers
      .map((member) => member.primary_aptos_address || member.aptos_address)
      .filter((address): address is string => !!address);

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
        targetUserAptosAddress = process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!;
        rawReceiverAddresses = [process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!];
      }
    }
    if (rawReceiverAddresses.length == 0) {
      targetUserAptosAddress = process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!;
      rawReceiverAddresses = [process.env.NEXT_PUBLIC_FIHUB_ADDRESS_APTOS!];
    }
    const scCallOpts: Parameters<typeof movementService.cheerBoo>[0] = {
      target: targetUserAptosAddress,
      receiverAddresses: rawReceiverAddresses,
      amount: Number(amount),
      cheer: cheer,
      outpostId: outpost.uuid,
    };

    const resultFromScInteraction: [boolean | null, string | null] =
      yield movementService.cheerBoo(scCallOpts);

    if (resultFromScInteraction[0] === true) {
      toast.success(
        `${
          cheer && isSelfReaction
            ? "you cheered yourself"
            : cheer
            ? "Cheer"
            : "Boo"
        } successful${isSelfReaction ? "ly!" : ""}`
      );
      const booMessage: OutgoingMessage = {
        message_type: cheer
          ? OutgoingMessageType.CHEER
          : OutgoingMessageType.BOO,
        outpost_uuid: outpost.uuid,
        data: {
          chain_id: 126,
          amount: Number(amount),
          react_to_user_address: targetUserAddress,
          tx_hash: resultFromScInteraction[1]!,
        },
      };
      wsClient.send(booMessage);
    } else {
      toast.error(`${cheer ? "Cheer" : "Boo"} failed`);
    }
  } catch (error) {
  } finally {
    useAssetsSlice();
    yield put(assetsActions.getBalance());
    if (cheer) {
      yield put(
        onGoingOutpostActions.setIsCheeringAddress({ address: undefined })
      );
    } else {
      yield put(
        onGoingOutpostActions.setIsBooingAddress({ address: undefined })
      );
    }
  }
}

function* getLiveMembers(
  action: ReturnType<typeof onGoingOutpostActions.getLiveMembers>
) {
  const { silent, forceJoin } = action.payload || { silent: false };
  yield put(onGoingOutpostActions.setIsRefreshingLiveMembers(true));

  if (!silent) {
    yield put(onGoingOutpostActions.isGettingLiveMembers(true));
  }

  yield detatched_getLiveMembers(forceJoin);
  if (!silent) {
    yield put(onGoingOutpostActions.isGettingLiveMembers(false));
  }
  yield put(onGoingOutpostActions.setIsRefreshingLiveMembers(false));
}

function* detatched_getLiveMembers(forceJoin?: boolean) {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to get live members");
    return [];
  }
  if (isDev) console.log("getting live members");

  let liveData: OutpostLiveData | undefined | false =
    yield podiumApi.getLatestLiveData(outpost.uuid);

  if (liveData === false && !forceJoin) {
    if (isDev) console.log("live data is false");
    return [];
  } else if (!liveData && forceJoin) {
    const joined: boolean = yield wsClient.asyncJoin(outpost.uuid);
    if (joined) {
      liveData = yield podiumApi.getLatestLiveData(outpost.uuid);
    }
  }
  if (!liveData) {
    if (isDev) console.error("Failed to get live members");
    return [];
  }
  if (isDev) console.log({ members: liveData.members });
  const members = liveData.members.filter((member) => member.is_present);
  const liveMembers: { [address: string]: LiveMember } = {};
  members.forEach((member) => {
    member.last_speaked_at_timestamp ??= 0;
    liveMembers[member.address] = member;
  });
  yield put(onGoingOutpostActions.setLiveMembers(liveMembers));
  return members;
}

function* clockTicked() {
  const liveMembers: { [address: string]: LiveMember } = yield select(
    onGoingOutpostDomains.members
  );
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    return;
  }
  for (const member of Object.values(liveMembers)) {
    const isCreator = member.uuid === outpost.creator_user_uuid;
    const remainingTime = member.remaining_time;
    if (member.is_speaking && !isCreator && remainingTime > 0) {
      yield put(
        onGoingOutpostActions.updateRemainingTime({
          userAddress: member.address,
          remainingTime: member.remaining_time - 1,
        })
      );
    }
  }
}

function* incomingUserReaction(
  action: ReturnType<typeof onGoingOutpostActions.incomingUserReaction>
) {
  const { userAddress: address, reaction } = action.payload;
  confettiEventBus.next({ address, type: reaction });
}

function* setIsRecording(
  action: ReturnType<typeof onGoingOutpostActions.statrtStopRecording>
) {
  const myUser: User | undefined = yield select(GlobalSelectors.podiumUserInfo);
  if (!myUser) {
    toast.error("you are not logged in");
    return;
  }
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to start recording");
    return;
  }
  const amICreator = outpost.creator_user_uuid === myUser.uuid;
  if (!amICreator) {
    console.error("You are not the creator of the outpost");
    return;
  }
  const isRecording = action.payload;
  wsClient.send({
    message_type: isRecording
      ? OutgoingMessageType.START_RECORDING
      : OutgoingMessageType.STOP_RECORDING,
    outpost_uuid: outpost.uuid,
  });
}

function* setJoined(
  action: ReturnType<typeof onGoingOutpostActions.setJoined>
) {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to set joined");
    return;
  }
  const myUser: User | undefined = yield select(GlobalSelectors.podiumUserInfo);
  if (!myUser) {
    console.error("You are not logged in");
    return;
  }
  const iAmCreator = outpost.creator_user_uuid === myUser.uuid;
  const isJoined = action.payload;
  if (outpost.creator_joined != true && iAmCreator && isJoined) {
    yield podiumApi.setCreatorJoinedToTrue(outpost.uuid);
  }
}

function* waitForCreator() {
  const outpost: OutpostModel | undefined = yield select(
    onGoingOutpostSelectors.outpost
  );
  if (!outpost) {
    console.error("Outpost not found to wait for creator");
    return;
  }
  const myUser: User | undefined = yield select(GlobalSelectors.podiumUserInfo);
  if (!myUser) {
    console.error("You are not logged in");
    return;
  }
  const outgoingMessage: OutgoingMessage = {
    message_type: OutgoingMessageType.WAIT_FOR_CREATOR,
    outpost_uuid: outpost.uuid,
  };
  wsClient.send(outgoingMessage);
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
  yield debounce(500, onGoingOutpostActions.getLiveMembers, getLiveMembers);
  yield takeLatest(onGoingOutpostActions.statrtStopRecording, setIsRecording);
  yield takeLatest(onGoingOutpostActions.setJoined, setJoined);
  yield takeLatest(onGoingOutpostActions.waitForCreator, waitForCreator);
  yield takeLatest(
    onGoingOutpostActions.incomingUserReaction,
    incomingUserReaction
  );
  yield takeLatest(globalActions.increaseTick_, clockTicked);
}
