export const openXAccount = (uuid: string) => {
  window.open(`https://twitter.com/intent/user?user_id=${uuid}`, "_blank");
};

export const openFacebookAccount = (uuid: string) => {
  window.open(`https://www.facebook.com/profile.php?id=${uuid}`, "_blank");
};
