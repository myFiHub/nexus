// Connection state enum
export enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
}

// Incoming message types
export enum IncomingMessageType {
  USER_JOINED = "user.joined",
  USER_LEFT = "user.left",
  USER_LIKED = "user.liked",
  USER_DISLIKED = "user.disliked",
  USER_BOOED = "user.booed",
  USER_CHEERED = "user.cheered",
  USER_STARTED_SPEAKING = "user.started_speaking",
  USER_STOPPED_SPEAKING = "user.stopped_speaking",
  REMAINING_TIME_UPDATED = "remaining_time.updated",
  TIME_IS_UP = "user.time_is_up",
  USER_FOLLOWED = "user.followed",
  USER_INVITED = "user.invited",
  WAITLIST_UPDATED = "waitlist.updated",
  CREATOR_JOINED = "creator.joined",
  USER_STARTED_RECORDING = "user.started_recording",
  USER_STOPPED_RECORDING = "user.stopped_recording",
  MESSAGE_ECHOED = "message.echoed",
}

// Outgoing message types
export enum OutgoingMessageType {
  JOIN = "join",
  LEAVE = "leave",
  BOO = "boo",
  CHEER = "cheer",
  LIKE = "like",
  DISLIKE = "dislike",
  START_SPEAKING = "start_speaking",
  STOP_SPEAKING = "stop_speaking",
  WAIT_FOR_CREATOR = "wait_for_creator",
  START_RECORDING = "start_recording",
  STOP_RECORDING = "stop_recording",
  ECHO = "echo",
}

// Incoming message data interface
export interface IncomingMessageData {
  address?: string;
  uuid?: string;
  name?: string;
  image?: string;
  react_to_user_address?: string;
  outpost_uuid?: string;
  amount?: number;
  remaining_time?: number;
}

// Incoming message interface
export interface IncomingMessage {
  name: IncomingMessageType;
  data: IncomingMessageData;
}

// Outgoing message data interface
export interface OutgoingMessageData {
  amount?: number;
  react_to_user_address?: string;
  chain_id?: number;
  tx_hash?: string;
  uuid?: string; // For health check echo messages
}

// Outgoing message interface
export interface OutgoingMessage {
  message_type: OutgoingMessageType;
  outpost_uuid: string;
  data?: OutgoingMessageData;
}

// Connection status interface
export interface ConnectionStatus {
  state: string;
  isConnecting: boolean;
  connected: boolean;
  hasChannel: boolean;
  hasToken: boolean;
}
