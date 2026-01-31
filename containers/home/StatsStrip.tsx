import { Statistics } from "app/services/api/types";
import { BarChart3, Landmark, Users } from "lucide-react";
import { AppLink } from "../../components/AppLink";
import { AppPages } from "../../lib/routes";
import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";

export function StatsStrip({ statistics }: { statistics?: Statistics }) {
  const totalUsers = statistics?.users_count ?? 1000;
  const totalRooms = statistics?.outposts_count ?? 100;
  const totalValueShared = statistics?.total_trades_volume ?? 300;

  const icons = {
    users: <Users className="w-8 h-8 text-purple-500" strokeWidth={2.2} aria-hidden />,
    rooms: (
      <Landmark
        className="w-8 h-8 text-blue-500 animate-pulse"
        strokeWidth={2.2}
        aria-hidden
      />
    ),
    value: (
      <BarChart3
        className="w-8 h-8 text-pink-500 animate-spin-slow"
        strokeWidth={2.2}
        aria-hidden
      />
    ),
  };

  return (
    <section
      className="w-full"
      aria-label="Platform statistics"
      role="region"
    >
      <div className="flex flex-col sm:flex-row justify-center gap-8">
        {/* Users Card */}
        <AppLink
          href={`${AppPages.users}/${UserTags.TopOwners}`}
          underline={false}
          className="flex-1 h-full p-0"
        >
          <div className="relative group flex-1 bg-white/30 dark:bg-black/40 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-purple-200 dark:border-purple-800 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:rotate-[-2deg] hover:shadow-purple-300/40 hover:z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-100 dark:bg-purple-900 rounded-full p-2 shadow-lg animate-fade-in">
              {icons.users}
            </div>
            <span className="mt-8 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
              {totalUsers.toLocaleString()}
            </span>
            <span className="mt-2 text-lg font-semibold text-purple-700 dark:text-purple-300 tracking-wide">
              Users
            </span>
            <span className="mt-1 text-sm text-[var(--muted-foreground)]">
              Creators & Supporters
            </span>
          </div>
        </AppLink>
        {/* Rooms Card */}
        <AppLink
          href={AppPages.allOutposts}
          underline={false}
          className="flex-1 h-full p-0"
        >
          <div className="relative group flex-1 bg-white/30 dark:bg-black/40 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-blue-200 dark:border-blue-800 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:rotate-2 hover:shadow-blue-300/40 hover:z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-100 dark:bg-blue-900 rounded-full p-2 shadow-lg animate-fade-in">
              {icons.rooms}
            </div>
            <span className="mt-8 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              {totalRooms.toLocaleString()}
            </span>
            <span className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
              Rooms
            </span>
            <span className="mt-1 text-sm text-[var(--muted-foreground)]">
              Active Communities
            </span>
          </div>
        </AppLink>
        {/* Value Shared Card */}
        <AppLink
          href={AppPages.dashboard}
          underline={false}
          className="flex-1 h-full p-0"
        >
          <div className="relative group flex-1 bg-white/30 dark:bg-black/40 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-pink-200 dark:border-pink-800 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-pink-300/40 hover:z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-100 dark:bg-pink-900 rounded-full p-2 shadow-lg animate-fade-in">
              {icons.value}
            </div>
            <span className="mt-8 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              {totalValueShared.toLocaleString()}
            </span>
            <span className="mt-2 text-lg font-semibold text-pink-700 dark:text-pink-300 tracking-wide">
              Value Shared
            </span>
            <span className="mt-1 text-sm text-[var(--muted-foreground)]">
              Community support
            </span>
          </div>
        </AppLink>
      </div>
    </section>
  );
}

