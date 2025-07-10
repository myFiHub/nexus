import { CookieKeys } from "./client-cookies";
import { ApiEndpoints } from "./routes";

// Client-side functions that call server cookie API endpoints
export async function getServerCookieViaAPI(
  key: CookieKeys
): Promise<string | undefined> {
  try {
    const response = await fetch(`${ApiEndpoints.cookies}?key=${key}`);
    if (!response.ok) {
      throw new Error("Failed to get cookie");
    }
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error getting server cookie via API:", error);
    return undefined;
  }
}

export async function setServerCookieViaAPI(
  key: CookieKeys,
  value: string,
  options?: { path?: string; maxAge?: number; expires?: Date }
): Promise<void> {
  try {
    const response = await fetch(ApiEndpoints.cookies, {
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
    console.error("Error setting server cookie via API:", error);
    throw error;
  }
}

export async function deleteServerCookieViaAPI(key: CookieKeys): Promise<void> {
  try {
    const response = await fetch(`${ApiEndpoints.cookies}?key=${key}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete cookie");
    }
  } catch (error) {
    console.error("Error deleting server cookie via API:", error);
    throw error;
  }
}
