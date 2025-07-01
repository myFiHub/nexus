"use client";
import { easyAccess } from "app/containers/global/effects/quickAccess";
import {
  NOTIFICATIONS_UPDATED,
  notificationsEventBus,
} from "app/containers/notifications/eventBus";
import { notificationsActions } from "app/containers/notifications/slice";
import { onGoingOutpostActions } from "app/containers/ongoingOutpost/slice";
import { isDev } from "app/lib/utils";
import { getStore } from "app/store";
import { WebSocketService } from "./client";
import { IncomingMessage, IncomingMessageType } from "./types";

export type IncomingReactionType =
  | IncomingMessageType.USER_BOOED
  | IncomingMessageType.USER_CHEERED
  | IncomingMessageType.USER_DISLIKED
  | IncomingMessageType.USER_LIKED;

/**
 * Handles WebSocket message routing to appropriate controllers
 */
export class WebSocketMessageRouter {
  static routeMessage(message: IncomingMessage): void {
    if (isDev) {
      console.log(
        `%c[DEBUG] Routing message: ${message.name}`,
        "color: #2196F3; font-weight: bold;"
      );
    }

    switch (message.name) {
      case IncomingMessageType.USER_JOINED:
        this.handleUserJoined(message);
        break;
      case IncomingMessageType.USER_LEFT:
        this.handleUserLeft(message);
        break;
      case IncomingMessageType.REMAINING_TIME_UPDATED:
        this.handleRemainingTimeUpdated(message);
        break;
      case IncomingMessageType.USER_STARTED_SPEAKING:
        this.handleUserSpeaking(message, true);
        break;
      case IncomingMessageType.USER_STOPPED_SPEAKING:
        this.handleUserSpeaking(message, false);
        break;
      case IncomingMessageType.USER_LIKED:
      case IncomingMessageType.USER_DISLIKED:
      case IncomingMessageType.USER_BOOED:
      case IncomingMessageType.USER_CHEERED:
        this.handleUserReaction(message);
        break;
      case IncomingMessageType.TIME_IS_UP:
        this.handleTimeIsUp(message);
        break;
      case IncomingMessageType.USER_INVITED:
      case IncomingMessageType.USER_FOLLOWED:
        this.handleNotification(message);
        break;
      case IncomingMessageType.WAITLIST_UPDATED:
        this.handleWaitlistUpdated(message);
        break;
      case IncomingMessageType.CREATOR_JOINED:
        this.handleCreatorJoined(message);
        break;
      case IncomingMessageType.USER_STARTED_RECORDING:
        this.handleUserRecording(message, true);
        break;
      case IncomingMessageType.USER_STOPPED_RECORDING:
        this.handleUserRecording(message, false);
        break;
    }
  }

  private static handleUserJoined(message: IncomingMessage): void {
    const myUserAddress = easyAccess.myUser?.address;

    if (message.data.address === myUserAddress) {
      const joinId = `join-${myUserAddress}`;
      if (isDev) {
        console.log(
          `%c[DEBUG] User joined joinId: ${joinId}`,
          "color: #4CAF50; font-weight: bold;"
        );
      }
      WebSocketService.instance.completeJoinRequest(joinId);
    }
    const store = getStore();
    store!.dispatch(onGoingOutpostActions.getLiveMembers());
  }

  private static handleUserLeft(message: IncomingMessage): void {
    const userAddress = message.data.address;
    const store = getStore();
    if (userAddress !== easyAccess.myUser?.address) {
      store!.dispatch(onGoingOutpostActions.getLiveMembers());
    }
  }

  private static handleRemainingTimeUpdated(message: IncomingMessage): void {
    const store = getStore();
    store!.dispatch(
      onGoingOutpostActions.updateRemainingTime({
        userAddress: message.data.address!,
        remainingTime: message.data.remaining_time!,
      })
    );
  }

  private static handleUserSpeaking(
    message: IncomingMessage,
    isTalking: boolean
  ): void {
    const store = getStore();
    store!.dispatch(
      onGoingOutpostActions.updateUserIsTalking({
        userAddress: message.data.address!,
        isTalking: isTalking,
      })
    );
  }

  private static handleUserReaction(message: IncomingMessage): void {
    if (isDev) {
      console.log(
        `%c[DEBUG] User reaction: ${message.name}`,
        "color: #2196F3; font-weight: bold;"
      );
    }
    const store = getStore();
    store!.dispatch(
      onGoingOutpostActions.incomingUserReaction({
        userAddress: message.data.address!,
        reaction: message.name as IncomingReactionType,
      })
    );
  }

  private static handleTimeIsUp(message: IncomingMessage): void {
    const store = getStore();
    store!.dispatch(
      onGoingOutpostActions.handleTimeIsUp({
        userAddress: message.data.address!,
      })
    );
  }

  private static handleNotification(_: IncomingMessage): void {
    notificationsEventBus.next(NOTIFICATIONS_UPDATED);
    const store = getStore();
    store!.dispatch(notificationsActions.getNotifications());
  }

  private static handleWaitlistUpdated(message: IncomingMessage): void {
    // TODO: Call outpost detail controller to handle waitlist update
    // if (Get.isRegistered<OutpostDetailController>()) {
    //   const controller = Get.find<OutpostDetailController>();
    //   controller.onMembersUpdated(message);
    // }
  }

  private static handleCreatorJoined(message: IncomingMessage): void {
    // TODO: Call outpost detail controller to handle creator joined
    // if (Get.isRegistered<OutpostDetailController>()) {
    //   const controller = Get.find<OutpostDetailController>();
    //   controller.onCreatorJoined(message);
    // }
  }

  private static handleUserRecording(
    message: IncomingMessage,
    isRecording: boolean
  ): void {
    const store = getStore();
    store!.dispatch(
      onGoingOutpostActions.updateUserIsRecording({
        userAddress: message.data.address!,
        isRecording: isRecording,
      })
    );
  }

  // private static withController<T>(action: (controller: T) => void): void {
  //   // TODO: Implement controller lookup logic
  //   // if (!Get.isRegistered<T>()) {
  //   //   if (isDev) {
  //   //     console.warn(`[WARN] ${T.toString()} not registered, cannot process message`);
  //   //   }
  //   //   return;
  //   // }
  //   // action(Get.find<T>());
  // }
}
