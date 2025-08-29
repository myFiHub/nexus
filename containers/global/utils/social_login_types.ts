export const availableSocialLogins = [
  "twitter",
  "google",
  "apple",
  "facebook",
  "github",
  "linkedin",
  "email_passwordless",
];

export const stringContainsOneOfAvailableSocialLogins = (str: string) => {
  return availableSocialLogins.some((login) => str.includes(login));
};
