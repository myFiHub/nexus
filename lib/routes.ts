/**
 * Application Routes and API Endpoints
 *
 * Centralized constants for all frontend routes and API endpoints
 * to ensure consistency and maintainability across the application.
 */

export const AppPages = {
  allOutposts: "/all_outposts",
  profile: "/profile",
  createOutpost: "/create_outpost",
  myOutposts: "/my_outposts",
  ongoingOutpost: (outpostId: string) => `/ongoing_outpost/${outpostId}`,
  outpostDetails: (outpostId: string) => `/outpost_details/${outpostId}`,
  userDetails: (userId: string) => `/user/${userId}`,
  dashboard: "/dashboard",
  users: "/users",
  tokens: "/tokens",
};

export const ApiEndpoints = {
  revalidate: {
    user: (userId: string) => `/user/${userId}`,
    outpostDetails: (outpostId: string) => `/outpost-details/${outpostId}`,
    allOutposts: "/all-outposts",
    dashboard: "/dashboard",
    dashboardRecentUsers: "/dashboard/recent-users",
    dashboardTopOwners: "/dashboard/top-owners",
    dashboardTrades: "/dashboard/trades",
  },
  cookies: "/api/cookies",
  luma: "/api/luma",
};
