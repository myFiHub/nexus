import { WebSocketService } from "./client";
import { IncomingMessage, IncomingMessageType } from "./types";

const isDev = process.env.NODE_ENV === "development";

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
    // TODO: Get user address from your user store
    const myUserAddress = "TODO: Get user address from store";

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

    // TODO: Call outpost call controller to fetch live data
    // this.withController<OutpostCallController>((controller) => {
    //   joinOrLeftDebounce.debounce(() => controller.fetchLiveData());
    // });
  }

  private static handleUserLeft(message: IncomingMessage): void {
    // TODO: Call outpost call controller to fetch live data
    // this.withController<OutpostCallController>((controller) => {
    //   if (message.data.address != myUser.address) {
    //     controller.fetchLiveData();
    //   }
    // });
  }

  private static handleRemainingTimeUpdated(message: IncomingMessage): void {
    // TODO: Call ongoing outpost call controller to update user remaining time
    // this.withController<OngoingOutpostCallController>((controller) => {
    //   controller.updateUserRemainingTime(
    //     address: message.data.address!,
    //     newTimeInSeconds: message.data.remaining_time!,
    //   );
    // });
  }

  private static handleUserSpeaking(
    message: IncomingMessage,
    isTalking: boolean
  ): void {
    // TODO: Call ongoing outpost call controller to update user talking state
    // this.withController<OngoingOutpostCallController>((controller) => {
    //   controller.updateUserIsTalking(
    //     address: message.data.address!,
    //     isTalking: isTalking,
    //   );
    // });
  }

  private static handleUserReaction(message: IncomingMessage): void {
    // TODO: Handle user reactions
    // if (!Get.isRegistered<OngoingOutpostCallController>() ||
    //     !Get.isRegistered<OutpostCallController>()) {
    //   if (isDev) {
    //     console.warn("[WARN] Required controllers not registered, cannot process user reaction");
    //   }
    //   return;
    // }
    // const ongoingController = Get.find<OngoingOutpostCallController>();
    // const outpostController = Get.find<OutpostCallController>();
    // outpostController.updateReactionsMapByWsEvent(message);
    // ongoingController.handleIncomingReaction(message);
  }

  private static handleTimeIsUp(message: IncomingMessage): void {
    // TODO: Call ongoing outpost call controller to handle time is up
    // this.withController<OngoingOutpostCallController>((controller) => {
    //   controller.handleTimeIsUp(message);
    // });
  }

  private static handleNotification(message: IncomingMessage): void {
    // TODO: Call notifications controller to get notifications
    // this.withController<NotificationsController>((controller) => {
    //   controller.getNotifications();
    // });
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
    // TODO: Call ongoing outpost call controller to handle recording state
    // this.withController<OngoingOutpostCallController>((controller) => {
    //   if (isRecording) {
    //     controller.onUserStartedRecording(message);
    //   } else {
    //     controller.onUserStoppedRecording(message);
    //   }
    // });
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
