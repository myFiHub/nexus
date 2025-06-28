import Cookies from "js-cookie";

export enum CookieKeys {
  theme = "theme",
  myUserId = "my_user_id",
}

// Client-side cookie management
export const getClientCookie = (key: CookieKeys): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(key);
};

export const setClientCookie = (
  key: CookieKeys,
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  if (typeof window === "undefined") return;
  Cookies.set(key, value, options);
};

export const deleteClientCookie = (key: CookieKeys): void => {
  if (typeof window === "undefined") return;
  Cookies.remove(key);
};

// Server-side cookie management via API calls
export const getServerCookieViaAPI = async (
  key: CookieKeys
): Promise<string | undefined> => {
  try {
    const response = await fetch(`/api/cookies?key=${key}`);
    if (!response.ok) {
      throw new Error("Failed to get cookie");
    }
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error getting server cookie:", error);
    return undefined;
  }
};

export const setServerCookieViaAPI = async (
  key: CookieKeys,
  value: string,
  options?: { path?: string; maxAge?: number }
): Promise<void> => {
  try {
    const response = await fetch("/api/cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value, options }),
    });

    if (!response.ok) {
      throw new Error("Failed to set cookie");
    }
  } catch (error) {
    console.error("Error setting server cookie:", error);
    throw error;
  }
};

export const deleteServerCookieViaAPI = async (
  key: CookieKeys
): Promise<void> => {
  try {
    const response = await fetch(`/api/cookies?key=${key}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete cookie");
    }
  } catch (error) {
    console.error("Error deleting server cookie:", error);
    throw error;
  }
};
