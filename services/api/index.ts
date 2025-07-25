import {
  LEADERBOARD_PAGE_SIZE,
  LeaderboardTags,
} from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  RECENTLY_JOINED_PAGE_SIZE,
  TOP_OWNERS_PAGE_SIZE,
  TRADE_PAGE_SIZE,
  TRADING_VOLUME_PAGE_SIZE,
} from "app/containers/dashboard/users/configs";
import { isDev } from "app/lib/utils";
import axios, { AxiosInstance } from "axios";
import {
  AdditionalDataForLogin,
  BuySellPodiumPassRequest,
  ConnectNewAccountRequest,
  CreateOutpostRequest,
  FollowerModel,
  FollowUnfollowAction,
  FollowUnfollowRequest,
  InviteRequestModel,
  LoginRequest,
  MostFeeEarned,
  MostPassHeld,
  MostSoldPass,
  MostUniquePassHeld,
  MostVolumeTradedPasses,
  NotificationModel,
  OutpostInvitation,
  OutpostLiveData,
  OutpostModel,
  Pnl,
  PodiumAppMetadata,
  PodiumPassBuyerModel,
  RecentlyJoinedUser,
  RejectInvitationRequest,
  SetOrRemoveReminderRequest,
  Statistics,
  Tag,
  TagModel,
  TopOwner,
  Trade,
  TradingVolume,
  UpdateOutpostRequest,
  User,
} from "./types";

class PodiumApi {
  private readonly baseUrl: string;
  private readonly axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  // Auth methods
  async login(
    request: LoginRequest,
    additionalData: AdditionalDataForLogin
  ): Promise<{
    user: User | undefined;
    error: string | undefined;
    statusCode: number | undefined;
    token: string | null;
  }> {
    try {
      const response = await this.axiosInstance.post("/auth/login", request);
      if (response.status === 200) {
        this.token = response.data.data.token;
        const userData = await this.getMyUserData(additionalData);
        return {
          user: userData,
          error: undefined,
          statusCode: response.status,
          token: this.token,
        };
      }
      return {
        user: undefined,
        error: "User not found",
        statusCode: response.status,
        token: null,
      };
    } catch (error: any) {
      if (isDev) console.log("error", error);
      console.error("Login error:", error);
      return {
        user: undefined,
        error: error.response?.data?.message || "Login failed",
        statusCode: error.response?.status,
        token: null,
      };
    }
  }

  // User methods
  async getMyUserData(
    additionalData: AdditionalDataForLogin
  ): Promise<User | undefined> {
    try {
      const response = await this.axiosInstance.get("/users/profile");
      let user: User = response.data.data;

      const fieldsToUpdate: Partial<User> = {};
      if (!user.email && additionalData.email)
        fieldsToUpdate.email = additionalData.email;
      if (!user.name && additionalData.name)
        fieldsToUpdate.name = additionalData.name;
      if (!user.image && additionalData.image)
        fieldsToUpdate.image = additionalData.image;
      if (!user.login_type && additionalData.loginType)
        fieldsToUpdate.login_type = additionalData.loginType;

      if (Object.keys(fieldsToUpdate).length > 0) {
        const updatedUser = await this.updateMyUserData(fieldsToUpdate);
        if (updatedUser) {
          user = updatedUser;
        }
      }

      return user;
    } catch (error) {
      if (isDev) console.log("error", error);
      console.error("Get my user data error:", error);
      return undefined;
    }
  }

  async updateMyUserData(patchData: Partial<User>): Promise<User | undefined> {
    try {
      const response = await this.axiosInstance.post(
        "/users/update-profile",
        patchData
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      console.error("Update my user data error:", error);
      return undefined;
    }
  }

  async getUserData(id: string): Promise<User | undefined> {
    try {
      const response = await this.axiosInstance.get(
        `/users/detail?uuid=${id.replaceAll("/", "")}`
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      try {
        const user = await this.getUserByAptosAddress(id);
        if (user) {
          return user;
        }
      } catch (error) {
        return undefined;
      }
    }
  }

  async searchUserByName(
    name: string,
    page?: number,
    pageSize?: number
  ): Promise<Record<string, User>> {
    try {
      const response = await this.axiosInstance.get("/users/search", {
        params: {
          text: name,
          page,
          page_size: pageSize,
        },
      });
      const usersList: User[] = response.data.data;
      return usersList.reduce((acc, user) => {
        acc[user.uuid] = user;
        return acc;
      }, {} as Record<string, User>);
    } catch (error) {
      if (isDev) console.log("error", error);
      return {};
    }
  }

  // Outpost methods
  async createOutpost(
    request: CreateOutpostRequest
  ): Promise<OutpostModel | undefined> {
    try {
      const response = await this.axiosInstance.post(
        "/outposts/create",
        request
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return undefined;
    }
  }

  async updateOutpost(request: UpdateOutpostRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/update`,
        request
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getOutpost(uuid: string): Promise<OutpostModel | undefined> {
    try {
      const response = await this.axiosInstance.get(
        `/outposts/detail?uuid=${uuid}`
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      console.error(error);
      return undefined;
    }
  }

  // Follow methods
  async followUnfollowUser(request: FollowUnfollowRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post("/users/follow", request);
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async areFollowedByMe(ids: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await this.axiosInstance.post(
        `/users/are-followed-by-me`,
        {
          addresses: ids,
        }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return {};
    }
  }

  // Notification methods
  async getNotifications(): Promise<NotificationModel[]> {
    try {
      const response = await this.axiosInstance.get("/notifications");
      const rawNotifications = response.data.data;

      // Parse metadata based on notification type
      return rawNotifications.map((notification: any) => {
        let followMetadata = undefined;
        let inviteMetadata = undefined;

        if (notification.notification_type === "follow") {
          followMetadata = notification.metadata;
        }
        if (notification.notification_type === "invite") {
          inviteMetadata = notification.metadata;
        }

        return {
          created_at: notification.created_at,
          is_read: notification.is_read,
          message: notification.message,
          notification_type: notification.notification_type,
          follow_metadata: followMetadata,
          invite_metadata: inviteMetadata,
          uuid: notification.uuid,
        };
      });
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  // Metadata methods
  async getAppMetadata(): Promise<PodiumAppMetadata> {
    try {
      const response = await this.axiosInstance.get(
        "/configurations/app-settings"
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      // Return default metadata in case of error
      return {
        force_update: true,
        movement_aptos_metadata: {
          chain_id: "126",
          cheer_boo_address:
            "0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa",
          name: "Movement Mainnet",
          podium_protocol_address:
            "0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa",
          rpc_url: "https://mainnet.movementnetwork.xyz/v1",
        },
        referrals_enabled: true,
        va: "https://outposts.myfihub.com",
        version: "1.2.6",
        version_check: true,
      };
    }
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    try {
      const response = await this.axiosInstance.get("/tags");
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  // --- User/Account ---
  async getUserByAptosAddress(address: string): Promise<User | undefined> {
    try {
      const response = await this.axiosInstance.get(
        `/users/detail/by-aptos-address`,
        { params: { aptos_address: address } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      console.error("Get user by Aptos address error:", error);
      return undefined;
    }
  }

  async getUserByPassSymbol(passSymbol: string): Promise<User | undefined> {
    try {
      const response = await this.axiosInstance.get(
        `/users/detail/by-pass-symbol`,
        { params: { pass_symbol: passSymbol } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      console.error("Get user by Pass symbol error:", error);
      return undefined;
    }
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    try {
      const promises = ids.map((id) => this.getUserData(id));
      const users = await Promise.all(promises);
      return users.filter(Boolean) as User[];
    } catch {
      return [];
    }
  }

  async getUserByAptosAddresses(addresses: string[]): Promise<User[]> {
    try {
      const promises = addresses.map((address) =>
        this.getUserByAptosAddress(address)
      );
      const users = await Promise.all(promises);
      return users.filter(Boolean) as User[];
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async followUnfollow(
    uuid: string,
    action: FollowUnfollowAction
  ): Promise<boolean> {
    try {
      await this.axiosInstance.post(`/users/follow`, { uuid, action });
      return true;
    } catch {
      return false;
    }
  }

  async getFollowersOfUser(
    uuid: string,
    page?: number,
    page_size?: number
  ): Promise<FollowerModel[]> {
    try {
      const response = await this.axiosInstance.get(`/users/followers`, {
        params: { uuid, page, page_size },
      });
      return response.data.data;
    } catch {
      return [];
    }
  }

  async getFollowingsOfUser(
    uuid: string,
    page?: number,
    page_size?: number
  ): Promise<FollowerModel[]> {
    try {
      const response = await this.axiosInstance.get(`/users/followings`, {
        params: { uuid, page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async getMyFollowers(
    page?: number,
    page_size?: number
  ): Promise<FollowerModel[]> {
    try {
      const response = await this.axiosInstance.get(`/users/my-followers`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch {
      return [];
    }
  }

  async getMyFollowings(
    page?: number,
    page_size?: number
  ): Promise<FollowerModel[]> {
    try {
      const response = await this.axiosInstance.get(`/users/my-followings`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async deactivateAccount(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`/users/deactivate`);
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async connectNewAccount(request: ConnectNewAccountRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/users/accounts/connect`,
        request
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async setAccountAsPrimary(address: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/users/accounts/set-primary`,
        { address }
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  // --- Outpost ---
  async getNumberOfOnlineMembers(outpostId: string): Promise<number> {
    try {
      const response = await this.axiosInstance.get(
        `/outposts/online-members-count`,
        { params: { uuid: outpostId } }
      );
      return response.data.data.count;
    } catch (error) {
      if (isDev) console.log("error", error);
      return 0;
    }
  }

  async setCreatorJoinedToTrue(outpostId: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/creator-joined`,
        { uuid: outpostId }
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async searchOutpostByName(
    name: string,
    page?: number,
    page_size?: number
  ): Promise<Record<string, OutpostModel>> {
    try {
      const response = await this.axiosInstance.get(`/outposts/search`, {
        params: { text: name, page, page_size },
      });
      const outposts: OutpostModel[] = response.data.data;
      return Object.fromEntries(outposts.map((o) => [o.uuid, o]));
    } catch (error) {
      if (isDev) console.log("error", error);
      return {};
    }
  }

  async updateOutpostPost(request: UpdateOutpostRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/update`,
        request
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async getOutposts(
    page?: number,
    page_size?: number
  ): Promise<OutpostModel[] | Error> {
    try {
      const response = await this.axiosInstance.get(`/outposts`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return Error();
    }
  }

  async getOutpostsByTagId(
    id: number,
    page?: number,
    page_size?: number
  ): Promise<Record<string, OutpostModel>> {
    try {
      const response = await this.axiosInstance.get(`/outposts`, {
        params: { tag_id: id, page, page_size },
      });
      const outposts: OutpostModel[] = response.data.data;
      return Object.fromEntries(outposts.map((o) => [o.uuid, o]));
    } catch (error) {
      if (isDev) console.log("error", error);
      return {};
    }
  }

  async getMyOutposts(
    include_archived = true,
    page?: number,
    page_size?: number
  ): Promise<OutpostModel[]> {
    try {
      const response = await this.axiosInstance.get(`/outposts/my-outposts`, {
        params: { include_archived, page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async toggleOutpostArchive(id: string, archive: boolean): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`/outposts/set-archive`, {
        uuid: id,
        archive,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async reportOutpost(outpostId: string, reasons: string[]): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`/outposts/report`, {
        uuid: outpostId,
        reasons,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async addMeAsMember(outpostId: string, inviterId?: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/add-me-as-member`,
        { uuid: outpostId, inviter_uuid: inviterId }
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async inviteUserToJoinOutpost(request: InviteRequestModel): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/invites/create`,
        request
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async rejectInvitation(request: RejectInvitationRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/invites/reject`,
        request
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }
  async getOutpostInvitations(outpostId: string): Promise<OutpostInvitation[]> {
    try {
      const response = await this.axiosInstance.get(`/outposts/invitations`, {
        params: { uuid: outpostId },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async getLatestLiveData(
    outpostId: string
  ): Promise<OutpostLiveData | undefined | false> {
    try {
      const response = await this.axiosInstance.get(`/outposts/online-data`, {
        params: { uuid: outpostId },
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response.status === 422) {
        if (isDev) console.log("422 error", error);
        return false;
      }
      console.error("Get latest live data error:", error);
      return undefined;
    }
  }

  async setOrRemoveReminder(
    request: SetOrRemoveReminderRequest
  ): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/outposts/set-reminder`,
        request
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async leaveOutpost(id: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`/outposts/leave`, {
        uuid: id,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // --- Tag ---
  async searchTag(
    tagName: string,
    page?: number,
    page_size?: number
  ): Promise<Record<string, TagModel>> {
    try {
      const response = await this.axiosInstance.get(`/tags/search`, {
        params: { text: tagName, page, page_size },
      });
      const tags: TagModel[] = response.data.data;
      return Object.fromEntries(tags.map((t) => [t.id, t]));
    } catch {
      return {};
    }
  }

  // --- Notification ---
  async markNotificationAsRead(id: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/notifications/mark-as-read`,
        { uuid: id }
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete(`/notifications`, {
        data: { uuid: id },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // --- Pass ---
  async buySellPodiumPass(request: BuySellPodiumPassRequest): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/podium-passes/trade`,
        request
      );
      if (isDev) console.log("response", response);
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }

  async myPodiumPasses({
    page,
    page_size,
  }: {
    page?: number;
    page_size?: number;
  }): Promise<PodiumPassBuyerModel[]> {
    try {
      const response = await this.axiosInstance.get(
        `/podium-passes/my-passes`,
        { params: { page, page_size } }
      );
      return response.data.data;
    } catch {
      return [];
    }
  }

  async podiumPassBuyers(
    uuid: string,
    page = 0,
    page_size = 50
  ): Promise<PodiumPassBuyerModel[]> {
    try {
      const response = await this.axiosInstance.get(
        `/podium-passes/recent-holders`,
        { params: { uuid, page, page_size } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async getMyPasses({
    page,
    page_size,
    address,
    uuid,
  }: {
    page?: number;
    page_size?: number;
    address?: string;
    uuid?: string;
  }): Promise<PodiumPassBuyerModel[]> {
    try {
      const response = await this.axiosInstance.get(
        `/podium-passes/recent-holders`,
        { params: { page, page_size, address, uuid } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async getRecentlyJoinedUsers(
    page = 0,
    page_size = RECENTLY_JOINED_PAGE_SIZE
  ): Promise<RecentlyJoinedUser[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/recently-joined-users`,
        { params: { page, page_size } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getTopOwners(
    page = 0,
    page_size = TOP_OWNERS_PAGE_SIZE
  ): Promise<TopOwner[]> {
    try {
      const response = await this.axiosInstance.get(`/dashboard/top-owners`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getTrades(
    page = 0,
    page_size = TRADE_PAGE_SIZE,
    trade_type?: "buy" | "sell"
  ): Promise<Trade[]> {
    try {
      const response = await this.axiosInstance.get(`/dashboard/trades`, {
        params: { page, page_size, trade_type },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }

  async getTradingVolume(
    page = 0,
    page_size = TRADING_VOLUME_PAGE_SIZE
  ): Promise<TradingVolume[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/trading-volume`,
        { params: { page, page_size } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getMostFeeEarned(
    page = 0,
    page_size = LEADERBOARD_PAGE_SIZE[LeaderboardTags.TopFeeEarned]
  ): Promise<MostFeeEarned[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/most-fee-earned`,
        {
          params: { page, page_size },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getMostPassHeld(
    page = 0,
    page_size = LEADERBOARD_PAGE_SIZE[LeaderboardTags.MostPassHeld]
  ): Promise<MostPassHeld[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/most-pass-held`,
        {
          params: { page, page_size },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getMostSoldPasses(page = 0, page_size = 50): Promise<MostSoldPass[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/most-sold-passes`,
        {
          params: { page, page_size },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getMostUniquePassHolders(
    page = 0,
    page_size = LEADERBOARD_PAGE_SIZE[LeaderboardTags.MostUniquePassHolders]
  ): Promise<MostUniquePassHeld[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/most-unique-pass-held`,
        { params: { page, page_size } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getMostVolumeTradedPasses(
    page = 0,
    page_size = 50
  ): Promise<MostVolumeTradedPasses[]> {
    try {
      const response = await this.axiosInstance.get(
        `/dashboard/most-volume-traded-passes`,
        { params: { page, page_size } }
      );
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getPnls(page = 0, page_size = 50): Promise<Pnl[]> {
    try {
      const response = await this.axiosInstance.get(`/dashboard/pnls`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch (error) {
      if (isDev) console.log("error", error);
      return [];
    }
  }
  async getStatistics(): Promise<{ result?: Statistics; error?: string }> {
    try {
      console.log("getStatistics");
      const response = await this.axiosInstance.get(`/dashboard/summary`);
      return { result: response.data.data };
    } catch (error: any) {
      if (isDev) console.log("error", error);
      return { result: undefined, error: error.response?.data?.message };
    }
  }
  async setNftAsProfileImage(token_uri: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        `/users/accounts/set-nft-image`,
        { token_uri }
      );
      return response.status === 200;
    } catch (error) {
      if (isDev) console.log("error", error);
      return false;
    }
  }
}

// Create a single instance with the base URL
const podiumApi = new PodiumApi(process.env.NEXT_PUBLIC_PODIUM_API_URL!);

// Export only the instance
export default podiumApi;
