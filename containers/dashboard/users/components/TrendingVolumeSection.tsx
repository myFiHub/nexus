import { TradingVolume } from "app/services/api/types";
import { TrendingUp } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { UserCard } from "./userCard";

interface TrendingVolumeSectionProps {
  tradingVolume: TradingVolume[];
}

// Mock volume data - in real app this would come from API
const mockVolumeData = [
  { address: "0x1234", volume: 72.2 },
  { address: "0x5678", volume: 34.31 },
  { address: "0x9abc", volume: 30.73 },
  { address: "0xdef0", volume: 29.83 },
  { address: "0x2345", volume: 21.21 },
  { address: "0x6789", volume: 18.15 },
];

export const TrendingVolumeSection = ({
  tradingVolume,
}: TrendingVolumeSectionProps) => {
  // Create mock users with volume data
  const usersWithVolume = tradingVolume.slice(0, 6).map((owner, index) => ({
    ...owner,
    volume: mockVolumeData[index]?.volume || Math.random() * 50 + 10,
  }));

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
        title="Trending volume today"
        seeMore={{
          href: "/all_outposts",
          params: { filter: "trending_volume" },
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {usersWithVolume.map((user) => (
          <UserCard
            key={user.address}
            user={user}
            displayType="volume"
            displayValue={user.volume}
            displayColor="text-destructive"
          />
        ))}
        {usersWithVolume.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No volume data available
          </div>
        )}
      </div>
    </div>
  );
};
