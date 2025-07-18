export enum LeaderboardTags {
  TopFeeEarned = "top-fee-earned",
  MostPassHeld = "most-pass-held",
  MostUniquePassHolders = "most-unique-pass-holders",
}

export const LEADERBOARD_PAGE_SIZE = {
  [LeaderboardTags.TopFeeEarned]: 30,
  [LeaderboardTags.MostPassHeld]: 30,
  [LeaderboardTags.MostUniquePassHolders]: 30,
};
