import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { RecentlyJoinedUser, Statistics } from "app/services/api/types";
import { BarChart3, Landmark, Users } from "lucide-react";
import { AppLink } from "../../components/AppLink";
import { AppPages } from "../../lib/routes";

export function HeroSection({
  statistics,
  recentUsers,
}: {
  statistics?: Statistics;
  recentUsers: RecentlyJoinedUser[];
}) {
  const totalUsers = statistics?.users_count ?? 1000;
  const totalOutposts = statistics?.outposts_count ?? 100;
  const totalTradesVolume = statistics?.total_trades_volume ?? 300;

  // Lucide icons for each stat
  const icons = {
    users: <Users className="w-8 h-8 text-purple-500" strokeWidth={2.2} />,
    outposts: (
      <Landmark
        className="w-8 h-8 text-blue-500 animate-pulse"
        strokeWidth={2.2}
      />
    ),
    trades: (
      <BarChart3
        className="w-8 h-8 text-pink-500 animate-spin-slow"
        strokeWidth={2.2}
      />
    ),
  };

  return (
    <div className="flex flex-col items-center text-center w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 -z-10" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--primary)] via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Support What Interests You
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
          A frontier where creators and supporters build value together through
          shared ownership and goals.
        </p>

        {/* Gorgeous Glassmorphism Stats Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-14">
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
          {/* Outposts Card */}
          <AppLink
            href={AppPages.allOutposts}
            underline={false}
            className="flex-1 h-full p-0"
          >
            <div className="relative group flex-1 bg-white/30 dark:bg-black/40 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-blue-200 dark:border-blue-800 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:rotate-2 hover:shadow-blue-300/40 hover:z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-100 dark:bg-blue-900 rounded-full p-2 shadow-lg animate-fade-in">
                {icons.outposts}
              </div>
              <span className="mt-8 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                {totalOutposts.toLocaleString()}
              </span>
              <span className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
                Outposts
              </span>
              <span className="mt-1 text-sm text-[var(--muted-foreground)]">
                Active Communities
              </span>
            </div>
          </AppLink>

          {/* Trades Card */}
          <AppLink
            href={`${AppPages.dashboard}`}
            underline={false}
            className="flex-1 h-full p-0"
          >
            <div className="relative group flex-1 bg-white/30 dark:bg-black/40 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-pink-200 dark:border-pink-800 backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-pink-300/40 hover:z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-100 dark:bg-pink-900 rounded-full p-2 shadow-lg animate-fade-in">
                {icons.trades}
              </div>
              <span className="mt-8 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                {totalTradesVolume.toLocaleString()}
              </span>
              <span className="mt-2 text-lg font-semibold text-pink-700 dark:text-pink-300 tracking-wide">
                Total Trades
              </span>
              <span className="mt-1 text-sm text-[var(--muted-foreground)]">
                Value Shared
              </span>
            </div>
          </AppLink>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
          <div className="flex -space-x-3">
            {recentUsers.slice(0, 5).map((i, index) => (
              <div
                key={index}
                className="w-9 h-9 rounded-full border-2 border-white dark:border-black shadow-lg bg-gradient-to-r from-purple-400 to-blue-400 overflow-hidden"
                style={{
                  transform: `rotate(${[-8, -4, 0, 4, 8][index] || 0}deg)`,
                }}
                tabIndex={0}
                aria-label={i.name}
              >
                <div className="w-full h-full rounded-full border-2 border-purple-200 dark:border-blue-900 box-content">
                  <Img
                    src={i.image ?? logoUrl}
                    alt={i.name}
                    useImgTag
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
            {recentUsers.length > 5 && (
              <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-white dark:border-black bg-gradient-to-r from-purple-200 to-blue-200 text-purple-700 font-bold text-xs shadow-lg">
                +{recentUsers.length - 5}
              </div>
            )}
          </div>
          <span className="font-medium">
            Join {totalUsers}+ creators and supporters
          </span>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-4 ">
            <AppLink
              href={`${AppPages.users}/${UserTags.TopOwners}`}
              variant="default"
              size="default"
              className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Discover Creators
            </AppLink>
            <AppLink
              href={AppPages.createOutpost}
              variant="outline"
              size="default"
              className="border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-4 rounded-full text-lg font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              Start Your Outpost
            </AppLink>
          </div>
          <AppLink
            href={AppPages.allOutposts}
            className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:text-purple-600 text-lg group transition-colors duration-200 mb-12"
          >
            <span>View All Outposts</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              &rarr;
            </span>
          </AppLink>
        </div>
      </div>
    </div>
  );
}
