export const ONGOING_TUTORIAL_LS_KEY = "ongoing_outpost_tutorial_shown";

export const OngoingTutorialIds = {
  remainingTime: "ongoing-remaining-time",
  muteButton: "ongoing-mute-button",
  membersPanel: "ongoing-members",
  reactions: "ongoing-reactions-anchor",
  leaveButton: "ongoing-leave-button",
  jitsiContainer: "ongoing-jitsi-container",
} as const;

export enum STATUS {
  IDLE = "idle",
  READY = "ready",
  WAITING = "waiting",
  RUNNING = "running",
  PAUSED = "paused",
  SKIPPED = "skipped",
  FINISHED = "finished",
  ERROR = "error",
}
