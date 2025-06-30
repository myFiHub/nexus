import { IncomingReactionType } from "app/services/wsClient/messageRouter";
import { Subject } from "rxjs";

export const confettiEventBus = new Subject<{
  address: string;
  type: IncomingReactionType;
}>();
