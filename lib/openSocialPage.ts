export const openXAccount = (uuid: string) => {
  window.open(generateXUrl(uuid), "_blank");
};

export const generateXUrl = (uuid: string) => {
  return `https://x.com/intent/user?user_id=${uuid}`;
};

export const openFacebookAccount = (uuid: string) => {
  window.open(`https://www.facebook.com/profile.php?id=${uuid}`, "_blank");
};
