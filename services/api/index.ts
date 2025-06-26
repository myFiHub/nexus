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
  Notification,
  OutpostLiveData,
  OutpostModel,
  PodiumAppMetadata,
  PodiumPassBuyerModel,
  RejectInvitationRequest,
  SetOrRemoveReminderRequest,
  Tag,
  TagModel,
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
      console.error("Get user data error:", error);
      return undefined;
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
      return {};
    }
  }

  // Notification methods
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await this.axiosInstance.get("/notifications");
      return response.data.data;
    } catch (error) {
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
      console.error("Get user by Aptos address error:", error);
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
    } catch {
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
    } catch {
      return [];
    }
  }

  async getMyFollowers(
    page?: number,
    page_size?: number
  ): Promise<FollowerModel[]> {
    try {
      const response = await this.axiosInstance.get(`/users/followers`, {
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
      const response = await this.axiosInstance.get(`/users/followings`, {
        params: { page, page_size },
      });
      return response.data.data;
    } catch {
      return [];
    }
  }

  async deactivateAccount(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(`/users/deactivate`);
      return response.status === 200;
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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

  async getLatestLiveData(
    outpostId: string
  ): Promise<OutpostLiveData | undefined> {
    try {
      const response = await this.axiosInstance.get(`/outposts/online-data`, {
        params: { uuid: outpostId },
      });
      return response.data.data;
    } catch (error) {
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
    } catch {
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
      console.log("response", response);
      return response.status === 200;
    } catch {
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
      console.log({ response });
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
    } catch {
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
    } catch {
      return [];
    }
  }
}

// Create a single instance with the base URL
const podiumApi = new PodiumApi(process.env.NEXT_PUBLIC_PODIUM_API_URL!);

// Export only the instance
export default podiumApi;
