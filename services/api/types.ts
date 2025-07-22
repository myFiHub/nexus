import { AddGuestModel, AddHostModel } from "./luma";

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
  timestamp: number;
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

export interface CreateOutpostRequest {
  name: string;
  subject: string;
  scheduled_for: number;
  image: string;
  enter_type: string;
  speak_type: string;
  has_adult_content: boolean;
  tickets_to_enter: TicketToEnter[];
  tickets_to_speak: TicketToSpeak[];
  is_recordable: boolean;
  tags: string[];
  reminder_offset_minutes?: number;
  enabled_luma?: boolean;
  luma_guests?: AddGuestModel[];
  luma_hosts?: AddHostModel[];
}

export interface UpdateOutpostRequest {
  luma_event_id?: string;
  scheduled_for?: number;
  image?: string;
  uuid: string;
}

// Follow related types
export interface Follower {
  uuid: string;
  user_uuid: string;
  follower_uuid: string;
}

export interface FollowUnfollowRequest {
  uuid: string;
  action: "follow" | "unfollow";
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

// PLACEHOLDER TYPES (user: please fix these as needed)
export interface OutpostLiveData {
  members: LiveMember[];
}

export interface InviteRequestModel {
  can_speak: boolean;
  invitee_user_uuid: string;
  outpost_uuid: string;
}

export interface RejectInvitationRequest {
  inviter_uuid: string;
  outpost_uuid: string;
}

export interface SetOrRemoveReminderRequest {
  uuid: string;
  reminder_offset_minutes?: number;
}

export interface ConnectNewAccountRequest {
  aptos_address: string;
  current_address_signature: string;
  image: string;
  login_type: string;
  login_type_identifier: string;
  new_address: string;
  new_address_signature: string;
}

export type TradeType = "buy" | "sell";
export interface BuySellPodiumPassRequest {
  count: number;
  podium_pass_owner_address: string;
  podium_pass_owner_uuid: string;
  trade_type: TradeType;
  tx_hash: string;
}

export type FollowUnfollowAction = "follow" | "unfollow";
export interface FollowerModel {
  address: string;
  followed_by_me: boolean;
  image: string;
  name: string;
  uuid: string;
}

export interface OutpostModel {
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
  invites?: InviteModel[];
  is_archived: boolean;
  is_recordable: boolean;
  last_active_at: number;
  members?: LiveMember[];
  members_count?: number;
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

export interface TagModel {
  id: number;
  name: string;
}

export interface PodiumPassBuyerModel {
  address: string;
  followed_by_me: boolean;
  image: string;
  name: string;
  uuid: string;
  podium_pass_owner_address: string;
  count: number;
}

export type NotificationTypes = "follow" | "invite";
export interface NotificationModel {
  created_at: number;
  is_read: boolean;
  message: string;
  follow_metadata?: FollowMetadata;
  invite_metadata?: InviteMetadata;
  notification_type: NotificationTypes;
  uuid: string;
}

export interface FollowMetadata {
  follower_uuid: string;
  follower_name: string;
  follower_image: string;
}

export type InviteType = "enter" | "speak";
export interface InviteMetadata {
  inviter_uuid: string;
  inviter_name: string;
  inviter_image: string;
  outpost_uuid: string;
  outpost_name: string;
  outpost_image: string;
  action: InviteType;
}

export interface InviteModel {
  invitee_uuid: string;
  can_speak: boolean;
}

export interface RecentlyJoinedUser {
  name: string;
  created_at: number;
  address: string;
  image: string;
  aptos_address: string;
  uuid: string;
}
export interface TopOwner {
  address: string;
  aptos_address: string;
  podium_pass_price: number;
  name: string;
  image: string;
  uuid: string;
}
export interface Trade {
  count: number;
  created_at: number;
  fees_earned: number;
  podium_pass_left: number;
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  podium_pass_owner_uuid: string;
  price: number;
  trade_type: "buy" | "sell";
  user_address: string;
  user_image: string;
  user_name: string;
  user_uuid: string;
  uuid: string;
}

export interface TradingVolume {
  address: string;
  image: string;
  aptos_address: string;
  name: string;
  podium_pass_price: number;
  volume: number;
}
export interface MostFeeEarned {
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  podium_pass_owner_uuid: string;
  total_fee: number;
  total_volume: number;
}

export interface MostPassHeld {
  held_count: number;
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  podium_pass_owner_uuid: string;
}

export interface MostSoldPass {
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  podium_pass_owner_uuid: string;
  total_sold_amount: number;
}

export interface MostUniquePassHeld {
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  unique_held_count: number;
  podium_pass_owner_uuid: string;
}
export interface MostVolumeTradedPasses {
  podium_pass_owner_address: string;
  podium_pass_owner_image: string;
  podium_pass_owner_name: string;
  total_traded_volume: number;
  podium_pass_owner_uuid: string;
}

export interface OutpostInvitation {
  can_speak: boolean;
  created_at: number;
  invite_type: string;
  inviter_image: string;
  inviter_user_name: string;
  inviter_user_uuid: string;
  is_accepted: boolean;
  outpost_name: string;
  outpost_uuid: string;
}

export interface Pnl {
  image: string;
  name: string;
  pnl: number;
  user_address: string;
  user_uuid: string;
}

export interface Statistics {
  outposts_count: number;
  total_trades_volume: number;
  users_count: number;
}
