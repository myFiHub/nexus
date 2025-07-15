import { UserTags } from "../../../../app/(unauthenticated)/users/[filter]/_filters";
import { UserCard } from "../components/UserCard";
import ClientSideList from "./clientSideList";
import { InjectUsersPage } from "./injector";

interface User {
  uuid: string;
  name?: string;
  image?: string;
  aptos_address?: string;
  created_at?: number;
  podium_pass_price?: number;
}

interface UsersPageProps {
  users: User[];
  filter: UserTags;
}

export const getFilterTitle = (filter: UserTags) => {
  switch (filter) {
    case UserTags.RecentlyJoined:
      return "Recently Joined Users";
    case UserTags.TopOwners:
      return "Top Pass Owners";
    default:
      return "Users";
  }
};

export const getFilterDescription = (filter: UserTags) => {
  switch (filter) {
    case UserTags.RecentlyJoined:
      return "Discover the latest members who have joined our community";
    case UserTags.TopOwners:
      return "Meet the top pass owners with the most valuable holdings";
    default:
      return "Explore our community members";
  }
};

export const getDisplayConfig = (user: User, filter: UserTags) => {
  switch (filter) {
    case UserTags.RecentlyJoined:
      return {
        displayType: "joinedAt" as const,
        displayValue: user.created_at,
        displayColor: "text-primary",
      };
    case UserTags.TopOwners:
      return {
        displayType: "price" as const,
        displayValue: user.podium_pass_price,
        displayColor: "text-green-500",
      };
    default:
      return {
        displayType: "joinedAt" as const,
        displayValue: user.created_at,
        displayColor: "text-primary",
      };
  }
};
export function UsersPage({ users, filter }: UsersPageProps) {
  return (
    <>
      <InjectUsersPage />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {getFilterTitle(filter)}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                {getFilterDescription(filter)}
              </p>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user, index) => {
              const config = getDisplayConfig(user, filter);
              return (
                <UserCard
                  key={index}
                  user={user as any}
                  displayType={config.displayType}
                  displayValue={config.displayValue ?? ""}
                  displayColor={config.displayColor}
                />
              );
            })}
          </div>
        </div>
        <ClientSideList filter={filter} />

        {/* Structured Data for SEO */}
      </div>
    </>
  );
}
