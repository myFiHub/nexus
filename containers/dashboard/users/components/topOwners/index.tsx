import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { AppPages } from "app/lib/routes";
import { TopOwner } from "app/services/api/types";
import { Trophy } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { UserCard } from "../UserCard";

interface TopAccountsSectionProps {
  topOwners: TopOwner[];
}

export const TopAccountsSection = ({ topOwners }: TopAccountsSectionProps) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Trophy className="w-5 h-5 text-yellow-500" />}
        title="Top Owners"
        seeMore={{
          href: AppPages.users + `/${UserTags.TopOwners}`,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topOwners.slice(0, 3).map((owner) => (
          <UserCard
            key={owner.address}
            user={owner}
            displayType="price"
            displayValue={owner.podium_pass_price}
            displayColor="text-green-500"
          />
        ))}
        {topOwners.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No top accounts found
          </div>
        )}
      </div>
    </div>
  );
};
