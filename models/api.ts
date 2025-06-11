import axios, { AxiosInstance } from "axios";
import {
  AdditionalDataForLogin,
  Buyer,
  BuySellRequest,
  CreateOutpostRequest,
  Follower,
  FollowUnfollowRequest,
  LoginRequest,
  Notification,
  Outpost,
  PodiumAppMetadata,
  Tag,
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
    user: User | null;
    error: string | null;
    statusCode: number | null;
  }> {
    try {
      const response = await this.axiosInstance.post("/auth/login", request);
      if (response.status === 200) {
        this.token = response.data.data.token;
        const userData = await this.getMyUserData(additionalData);
        return { user: userData, error: null, statusCode: response.status };
      }
      return {
        user: null,
        error: "User not found",
        statusCode: response.status,
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.response?.data?.message || "Login failed",
        statusCode: error.response?.status,
      };
    }
  }

  // User methods
  async getMyUserData(
    additionalData: AdditionalDataForLogin
  ): Promise<User | null> {
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
      return null;
    }
  }

  async updateMyUserData(patchData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.axiosInstance.post(
        "/users/update-profile",
        patchData
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async getUserData(id: string): Promise<User | null> {
    try {
      const response = await this.axiosInstance.get(
        `/users/detail?uuid=${id.replaceAll("/", "")}`
      );
      return response.data.data;
    } catch (error) {
      return null;
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
  async createOutpost(request: CreateOutpostRequest): Promise<Outpost | null> {
    try {
      const response = await this.axiosInstance.post("/outposts", request);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async updateOutpost(request: UpdateOutpostRequest): Promise<Outpost | null> {
    try {
      const response = await this.axiosInstance.put(
        `/outposts/${request.uuid}`,
        request
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async getOutpost(uuid: string): Promise<Outpost | null> {
    try {
      const response = await this.axiosInstance.get(`/outposts/${uuid}`);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  // Follow methods
  async followUser(request: FollowUnfollowRequest): Promise<Follower | null> {
    try {
      const response = await this.axiosInstance.post("/follow", request);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async unfollowUser(request: FollowUnfollowRequest): Promise<boolean> {
    try {
      await this.axiosInstance.delete("/follow", { data: request });
      return true;
    } catch (error) {
      return false;
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

  // Pass methods
  async buyPass(request: BuySellRequest): Promise<Buyer | null> {
    try {
      const response = await this.axiosInstance.post("/passes/buy", request);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async sellPass(request: BuySellRequest): Promise<boolean> {
    try {
      await this.axiosInstance.post("/passes/sell", request);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create a single instance with the base URL
const podiumApi = new PodiumApi(process.env.NEXT_PUBLIC_PODIUM_API_URL!);

// Export only the instance
export default podiumApi;
