interface RevalidateResponse {
  success: boolean;
  message: string;
  revalidatedPath: string;
  revalidatedTags?: string[];
}

interface RevalidateError {
  error: string;
}

interface UserDataRevalidateOptions {
  userData?: boolean;
  passBuyers?: boolean;
  followers?: boolean;
  followings?: boolean;
  all?: boolean;
}

class RevalidateService {
  private readonly baseUrl: string;

  /**
   * Creates a new RevalidateService instance
   * @param baseUrl - Base URL for the API calls. If not provided, will auto-detect from current URL.
   *                  For cross-domain calls, provide the full domain (e.g., 'https://yourdomain.com')
   */
  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      // Auto-detect base URL from current location (client-side only)
      this.baseUrl = this.getCurrentBaseUrl();
    }
  }

  /**
   * Gets the current base URL from the browser's location
   * Falls back to empty string for server-side rendering
   */
  private getCurrentBaseUrl(): string {
    if (typeof window !== "undefined") {
      // Client-side: use current origin
      return window.location.origin;
    }
    // Server-side: return empty string for relative URLs
    return "";
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/api/revalidate${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData: RevalidateError = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  /**
   * Revalidates a user profile page (path only)
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUser(userId: string): Promise<RevalidateResponse> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return this.makeRequest<RevalidateResponse>(`/user/${userId}`);
  }

  /**
   * Revalidates user data with cache tag options
   * @param userId - The user ID to revalidate
   * @param options - Object specifying which cache tags to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUserData(
    userId: string,
    options: UserDataRevalidateOptions = { all: false }
  ): Promise<RevalidateResponse> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return this.makeRequest<RevalidateResponse>(
      `/user/${userId}`,
      "POST",
      options
    );
  }

  /**
   * Revalidates only the user's basic data cache
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUserBasicData(userId: string): Promise<RevalidateResponse> {
    return this.revalidateUserData(userId, { userData: true });
  }

  /**
   * Revalidates only the user's followers cache
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUserFollowers(userId: string): Promise<RevalidateResponse> {
    return this.revalidateUserData(userId, { followers: true });
  }

  /**
   * Revalidates only the user's followings cache
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUserFollowings(userId: string): Promise<RevalidateResponse> {
    return this.revalidateUserData(userId, { followings: true });
  }

  /**
   * Revalidates only the user's pass buyers cache
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateUserPassBuyers(userId: string): Promise<RevalidateResponse> {
    return this.revalidateUserData(userId, { passBuyers: true });
  }

  /**
   * Revalidates all user data cache tags
   * @param userId - The user ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateAllUserData(userId: string): Promise<RevalidateResponse> {
    return this.revalidateUserData(userId, { all: true });
  }

  /**
   * Revalidates the all outposts page
   * @returns Promise with revalidation result
   */
  async revalidateAllOutposts(): Promise<RevalidateResponse> {
    return this.makeRequest<RevalidateResponse>("/all-outposts");
  }

  /**
   * Revalidates an outpost details page
   * @param outpostId - The outpost ID to revalidate
   * @returns Promise with revalidation result
   */
  async revalidateOutpostDetails(
    outpostId: string
  ): Promise<RevalidateResponse> {
    if (!outpostId) {
      throw new Error("Outpost ID is required");
    }

    return this.makeRequest<RevalidateResponse>(
      `/outpost-details/${outpostId}`
    );
  }

  /**
   * Revalidates multiple pages at once
   * @param options - Object containing which pages to revalidate
   * @returns Promise with array of revalidation results
   */
  async revalidateMultiple(options: {
    userId?: string;
    outpostId?: string;
    allOutposts?: boolean;
    userDataOptions?: UserDataRevalidateOptions;
  }): Promise<RevalidateResponse[]> {
    const promises: Promise<RevalidateResponse>[] = [];

    if (options.userId) {
      if (options.userDataOptions) {
        promises.push(
          this.revalidateUserData(options.userId, options.userDataOptions)
        );
      } else {
        promises.push(this.revalidateUser(options.userId));
      }
    }

    if (options.outpostId) {
      promises.push(this.revalidateOutpostDetails(options.outpostId));
    }

    if (options.allOutposts) {
      promises.push(this.revalidateAllOutposts());
    }

    if (promises.length === 0) {
      throw new Error("At least one revalidation option must be provided");
    }

    return Promise.all(promises);
  }
}

// Create a default instance that auto-detects the base URL
const revalidateService = new RevalidateService();

// Export a function to create instances with custom base URLs for cross-domain calls
export const createRevalidateService = (baseUrl: string) =>
  new RevalidateService(baseUrl);

export { RevalidateService, revalidateService };
export type { RevalidateError, RevalidateResponse, UserDataRevalidateOptions };
