import { CookieKeys } from "./client-cookies";
import { themeInitScript } from "./theme";

export const AUTH_FLAG_ATTRIBUTE = "data-auth";

/**
 * Marks <html> as signed-in before first paint when the user-id cookie exists,
 * so `.member-only` / `.guest-only` content can be server-rendered without a flash.
 */
const authFlagScript = `(function(){try{if(/(?:^|; )${CookieKeys.myUserId}=/.test(document.cookie))document.documentElement.setAttribute("${AUTH_FLAG_ATTRIBUTE}","");}catch(e){}})();`;

export const bootScript = themeInitScript + authFlagScript;
