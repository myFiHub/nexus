import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import { FollowerModel, User } from "app/services/api/types";
import { PodiumPassButton } from "./podiumPassButton/index";
import { FollowsYouPill, MutualFollowers, ProfileActions } from "./social";

interface UserProfileProps {
  user: User;
  followers: FollowerModel[];
  followings: FollowerModel[];
}

export const UserProfile = ({ user, followers, followings }: UserProfileProps) => {
  const followersCount = user.followers_count ?? followers.length;
  const followingsCount = user.followings_count ?? followings.length;
  return (
    <section className="glass-card animate-entrance p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="shrink-0 rounded-full bg-grad-primary p-[2px]">
            <span className="block h-16 w-16 overflow-hidden rounded-full bg-surface sm:h-20 sm:w-20">
              <Img
                src={user.image || logoUrl}
                alt={user.name || "User"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                useImgTag
              />
            </span>
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {user.name || "Anonymous"}
              </h1>
              <FollowsYouPill followings={followings} />
            </div>
            {user.aptos_address && (
              <div className="flex items-center text-sm text-text-muted">
                <span className="tabular-nums">{truncate(user.aptos_address, 20)}</span>
                <CopyButton text={user.aptos_address} />
              </div>
            )}
            <p className="mt-1 text-sm text-text-muted">
              <span className="font-semibold text-foreground tabular-nums">{followersCount}</span>{" "}
              followers ·{" "}
              <span className="font-semibold text-foreground tabular-nums">{followingsCount}</span>{" "}
              following
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PodiumPassButton user={user} />
          <ProfileActions user={user} followings={followings} />
        </div>
      </div>
      <MutualFollowers userId={user.uuid} />
    </section>
  );
};
