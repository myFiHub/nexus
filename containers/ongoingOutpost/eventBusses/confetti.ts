import { IncomingReactionType } from "app/services/wsClient/client";
import { Subject } from "rxjs";

export const confettiEventBus = new Subject<{
  address: string;
  type: IncomingReactionType;
}>();
