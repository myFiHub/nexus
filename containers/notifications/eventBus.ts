import { Subject } from "rxjs";

export const NOTIFICATIONS_UPDATED = "NOTIFICATIONS_UPDATED";
export const notificationsEventBus = new Subject<string>();
