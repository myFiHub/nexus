const REFERRAL_PARAM = "ref";
const STORAGE_KEY = "podium_referrer";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isReferrerId = (value: string | null | undefined): value is string =>
  !!value && UUID_REGEX.test(value);

export const referralLink = (uuid: string) => {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";
  return `${base}/?${REFERRAL_PARAM}=${uuid}`;
};

/** Remembers `?ref=` from the landing URL so sign-up can use it later. */
export const captureReferral = () => {
  try {
    const ref = new URLSearchParams(window.location.search).get(REFERRAL_PARAM);
    if (isReferrerId(ref)) localStorage.setItem(STORAGE_KEY, ref);
  } catch {}
};

export const getStoredReferrer = () => {
  try {
    const ref = localStorage.getItem(STORAGE_KEY);
    return isReferrerId(ref) ? ref : null;
  } catch {
    return null;
  }
};

export const clearStoredReferrer = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};
