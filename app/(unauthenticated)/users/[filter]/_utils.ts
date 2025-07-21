import { UserTags } from "./_filters";

export const getFilterTitle = (filter: UserTags) => {
  switch (filter) {
    case UserTags.RecentlyJoined:
      return "Recently Joined Users";
    case UserTags.TopOwners:
      return "Top Vip Passes";
    default:
      return "Users";
  }
};

export const getFilterDescription = (filter: UserTags, client?: boolean) => {
  switch (filter) {
    case UserTags.RecentlyJoined:
      return "Discover the latest members who have joined our community";
    case UserTags.TopOwners:
      // Use @@ as a split marker for animation
      if (client) {
        return "Meet the top Podium Passes with the most @@valuable community@@followings";
      }
      return "Meet the top Podium Passes with the most valuable community followings";
    default:
      return "Explore our community members";
  }
};
