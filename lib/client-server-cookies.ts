import { CookieKeys } from "./client-cookies";
import { ApiEndpoints } from "./routes";

// Client-side functions that call server cookie API endpoints
export async function setServerCookieViaAPI(
  key: CookieKeys,
  value: string
): Promise<void> {
  try {
    const response = await fetch(ApiEndpoints.cookies, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
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
