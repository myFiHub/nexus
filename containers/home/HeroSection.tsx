import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { RecentlyJoinedUser, Statistics } from "app/services/api/types";
import { Users } from "lucide-react";
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

  return (
    <div className="animate-entrance flex flex-col items-center text-center w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-grad text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
          Join Live Conversations. Empower Creators.
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
          Podium is where audiences and creators meet in{" "}
          <span className="font-semibold text-foreground">
            Outposts
          </span>{" "}
          — live audio spaces built around the topics you care about.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
          <div className="flex -space-x-3">
            {recentUsers.slice(0, 5).map((i, index) => (
              <div
                key={index}
                className="w-9 h-9 rounded-full border-2 border-[var(--p-bg)] shadow-lg bg-surface-raised overflow-hidden"
                style={{
                  transform: `rotate(${[-8, -4, 0, 4, 8][index] || 0}deg)`,
                }}
                tabIndex={0}
                aria-label={i.name}
              >
                <div className="w-full h-full rounded-full box-content">
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
              <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[var(--p-bg)] bg-surface-raised text-text-muted font-bold text-xs shadow-lg">
                +{recentUsers.length - 5}
              </div>
            )}
          </div>
          <span className="font-medium">
            Join {totalUsers.toLocaleString()}+ creators and listeners
          </span>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-4 ">
            <AppLink
              href={AppPages.allOutposts}
              variant="default"
              size="default"
              className="btn-aurora text-[var(--p-on-accent)] h-auto px-8 py-4 rounded-full text-lg hover:no-underline"
            >
              Explore Live Outposts
            </AppLink>
            <AppLink
              href={AppPages.createOutpost}
              variant="outline"
              size="default"
              className="press h-auto border border-border-strong bg-surface/60 text-foreground px-8 py-4 rounded-full text-lg font-bold hover:border-primary hover:text-primary hover:bg-surface backdrop-blur hover:no-underline"
            >
              Start Your Outpost
            </AppLink>
          </div>
          <AppLink
            href={`${AppPages.users}/${UserTags.TopOwners}`}
            className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:opacity-80 text-lg group transition-colors duration-200 mb-12"
          >
            <span>Discover creators</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              &rarr;
            </span>
          </AppLink>
        </div>
      </div>
    </div>
  );
}
