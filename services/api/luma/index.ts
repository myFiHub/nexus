import axios, { AxiosInstance } from "axios";

// Types and Interfaces

export interface LumaCreateEvent {
  name: string;
  start_at: string;
  meeting_url: string;
  timezone?: string;
  end_at?: string;
  require_rsvp_approval?: boolean;
}

export interface LumaHostModel {
  api_id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export interface LumaEventDetailsModel {
  api_id: string;
  created_at: string;
  cover_url: string;
  name: string;
  description: string;
  description_md: string;
  start_at: string;
  end_at: string;
  url: string;
  timezone: string;
  event_type?: string;
  visibility: string;
  meeting_url: string;
}

export interface LumaEventModel {
  event: LumaEventDetailsModel;
  hosts: LumaHostModel[];
}

export interface GuestDataModel {
  api_id: string;
  approval_status: string;
  registered_at: string;
  user_api_id: string;
  user_name?: string;
  user_email: string;
}

export interface GuestModel {
  api_id: string;
  guest: GuestDataModel;
}

export interface AddGuestModel {
  email: string;
  name?: string;
}

export interface AddHostModel {
  event_api_id?: string;
  email: string;
  access_level?: string;
  is_visible?: boolean;
  name?: string;
}

// Constants
export const LUMA_BASE_URL = "/api/luma"; // Proxy URL for client-side
export const LUMA_DIRECT_URL = "https://api.lu.ma"; // Direct URL for server-side

// Default headers
const getDefaultHeaders = (useProxy: boolean = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add API key directly for server-side calls
  if (!useProxy) {
    const apiKey = process.env.NEXT_PUBLIC_LUMA_API_KEY;
    if (apiKey) {
      headers["x-luma-api-key"] = apiKey;
    }
  }

  return headers;
};

export class LumaApi {
  private static instance: LumaApi | undefined = undefined;
  private axiosInstance: AxiosInstance;
  private useProxy: boolean;

  private constructor(useProxy: boolean = true) {
    this.useProxy = useProxy;
    const baseURL = useProxy ? LUMA_BASE_URL : LUMA_DIRECT_URL;

    this.axiosInstance = axios.create({
      baseURL,
      headers: getDefaultHeaders(useProxy),
    });
  }

  public static getInstance(useProxy: boolean = true): LumaApi {
    if (!LumaApi.instance || LumaApi.instance.useProxy !== useProxy) {
      LumaApi.instance = new LumaApi(useProxy);
    }
    return LumaApi.instance;
  }

  /**
   * Create a new event
   */
  async createEvent(
    event: LumaCreateEvent
  ): Promise<LumaEventModel | undefined> {
    try {
      // Set default end time if not provided
      if (!event.end_at) {
        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add 1 hour
        event.end_at = endTime.toISOString();
      }
    } catch (error) {
      console.error("Error getting timezone:", error);
      return undefined;
    }

    const response = await this.axiosInstance.post(
      "/public/v1/event/create",
      event
    );

    if (response.status === 200) {
      const id = response.data.api_id;
      if (id) {
        return await this.getEvent(id);
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  /**
   * Get event details by ID
   */
  async getEvent(eventId: string): Promise<LumaEventModel | undefined> {
    try {
      const response = await this.axiosInstance.get(
        `/public/v1/event/get?api_id=${eventId}`
      );

      if (response.status === 200) {
        return response.data as LumaEventModel;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error getting event:", error);
      return undefined;
    }
  }

  /**
   * Get all guests for an event
   */
  async getGuests(eventId: string): Promise<GuestModel[]> {
    const response = await this.axiosInstance.get(
      `/public/v1/event/get-guests?event_api_id=${eventId}`
    );

    if (response.status === 200) {
      const jsonBody = response.data;
      const array = jsonBody.entries as any[];
      const guests = array.map((e) => e as GuestModel);
      return guests;
    } else {
      return [];
    }
  }

  /**
   * Add guests to an event
   */
  async addGuests(guests: AddGuestModel[], eventId: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        "/public/v1/event/add-guests",
        {
          guests: guests,
          event_api_id: eventId,
        }
      );

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding guests:", error);
      return false;
    }
  }

  /**
   * Send invites to guests
   */
  async sendInvite(guests: AddGuestModel[], eventId: string): Promise<boolean> {
    const response = await this.axiosInstance.post(
      "/public/v1/event/send-invite",
      {
        guests: guests,
        event_api_id: eventId,
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add a host to an event
   */
  async addHost(host: AddHostModel): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post(
        "/public/v1/event/add-host",
        host
      );

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding host:", error);
      return false;
    }
  }
}

// Default export for client-side usage (with proxy)
export const lumaApi = LumaApi.getInstance(true);

// Export for server-side usage (direct API calls)
export const lumaApiDirect = LumaApi.getInstance(false);
