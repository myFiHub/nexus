// User related types
export interface ConnectedAccount {
  address: string;
  aptos_address: string;
  image?: string;
  is_primary: boolean;
  login_type?: string;
  login_type_identifier: string;
  uuid: string;
}

export interface User {
  address: string;
  uuid: string;
  aptos_address?: string;
  email?: string;
  external_wallet_address?: string;
  followed_by_me?: boolean;
  followers_count?: number;
  followings_count?: number;
  image?: string;
  login_type?: string;
  login_type_identifier?: string;
  name?: string;
  is_over_18?: boolean;
  referrals_count?: number;
  referrer_user_uuid?: string;
  incomes?: Record<string, number>;
  received_boo_amount: number;
  received_boo_count: number;
  received_cheer_amount: number;
  received_cheer_count: number;
  remaining_referrals_count: number;
  sent_boo_amount: number;
  sent_boo_count: number;
  sent_cheer_amount: number;
  sent_cheer_count: number;
  accounts: ConnectedAccount[];
}

// Auth related types
export interface LoginRequest {
  signature: string;
  username: string;
  aptos_address: string;
  has_ticket: boolean;
  login_type_identifier: string;
  referrer_user_uuid?: string;
}

export interface AdditionalDataForLogin {
  email?: string;
  name?: string;
  image?: string;
  loginType?: string;
}

// Outpost related types
export interface TicketToEnter {
  access_type: string;
  address: string;
  user_uuid?: string;
}

export interface TicketToSpeak {
  access_type: string;
  address: string;
  user_uuid?: string;
}

export interface Invite {
  invitee_uuid: string;
  can_speak: boolean;
}

export interface Feedback {
  feedback_type: string;
  time: string;
  user_address: string;
}

export interface UserReaction {
  amount: number;
  reaction_type: string;
  time: string;
  user_address: string;
}

export interface LiveMember {
  address: string;
  can_speak: boolean;
  feedbacks: Feedback[];
  image: string;
  is_present: boolean;
  is_speaking: boolean;
  name: string;
  reactions: UserReaction[];
  remaining_time: number;
  last_speaked_at_timestamp?: number;
  aptos_address: string;
  external_wallet_address?: string;
  uuid: string;
  followed_by_me?: boolean;
  is_recording: boolean;
  joined_at: number;
  primary_aptos_address?: string;
}

export interface OutpostLiveData {
  members: LiveMember[];
}

export interface Outpost {
  uuid: string;
  created_at: number;
  creator_joined: boolean;
  luma_event_id?: string;
  creator_user_name: string;
  creator_user_uuid: string;
  creator_user_image: string;
  enter_type: string;
  has_adult_content: boolean;
  image: string;
  invites?: Invite[];
  is_archived: boolean;
  is_recordable: boolean;
  last_active_at: number;
  members?: LiveMember[];
  members_count: number;
  name: string;
  scheduled_for: number;
  speak_type: string;
  subject: string;
  tags: string[];
  tickets_to_enter?: TicketToEnter[];
  tickets_to_speak?: TicketToSpeak[];
  online_users_count?: number;
  i_am_member: boolean;
  reminder_offset_minutes?: number;
}

export interface CreateOutpostRequest {
  name: string;
  subject: string;
  scheduled_for: number;
  image: string;
  enter_type: string;
  speak_type: string;
  has_adult_content: boolean;
  is_recordable: boolean;
  tags: string[];
  reminder_offset_minutes?: number;
}

export interface UpdateOutpostRequest {
  uuid: string;
  name?: string;
  subject?: string;
  scheduled_for?: number;
  image?: string;
  enter_type?: string;
  speak_type?: string;
  has_adult_content?: boolean;
  is_recordable?: boolean;
  tags?: string[];
  reminder_offset_minutes?: number;
}

// Follow related types
export interface Follower {
  uuid: string;
  user_uuid: string;
  follower_uuid: string;
}

export interface FollowUnfollowRequest {
  user_uuid: string;
}

// Notification related types
export interface Notification {
  uuid: string;
  user_uuid: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

// Metadata related types
export interface MovementAptosMetadata {
  chain_id: string;
  cheer_boo_address: string;
  name: string;
  podium_protocol_address: string;
  rpc_url: string;
}

export interface PodiumAppMetadata {
  force_update: boolean;
  movement_aptos_metadata: MovementAptosMetadata;
  referrals_enabled: boolean;
  va: string;
  version: string;
  version_check: boolean;
}

// Tag related types
export interface Tag {
  uuid: string;
  name: string;
  color: string;
}

// Pass related types
export interface Buyer {
  uuid: string;
  user_uuid: string;
  pass_uuid: string;
  status: string;
}

export interface BuySellRequest {
  pass_uuid: string;
  price: number;
}
