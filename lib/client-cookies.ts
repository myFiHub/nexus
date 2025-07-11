import Cookies from "js-cookie";

export enum CookieKeys {
  theme = "theme",
  myUserId = "my_user_id",
  viewArchivedOutposts = "view_archived_outposts",
  myMoveAddress = "my_move_address",
}

// Client-side cookie management using js-cookies package
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
