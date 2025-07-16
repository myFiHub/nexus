import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import { LeaderboardHeader } from "./components/LeaderboardHeader";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { LeaderboardInjector } from "./injector";

export const Leaderboard = ({
  mostFeeEarned,
  mostPassHeld,
  mostUniquePassHolders,
}: {
  mostFeeEarned: MostFeeEarned[];
  mostPassHeld: MostPassHeld[];
  mostUniquePassHolders: MostUniquePassHeld[];
}) => {
  return (
    <>
      <LeaderboardInjector />
      <LeaderboardHeader />
      {/* Desktop: flex row, hidden on mobile */}
      <div className="hidden md:flex gap-4">
        <LeaderboardTable
          users={mostFeeEarned}
          type={LeaderboardTags.TopFeeEarned}
        />
        <LeaderboardTable
          users={mostPassHeld}
          type={LeaderboardTags.MostPassHeld}
        />
        <LeaderboardTable
          users={mostUniquePassHolders}
          type={LeaderboardTags.MostUniquePassHolders}
        />
      </div>
      {/* Mobile: Tabs, hidden on desktop */}
      <div className="block md:hidden">
        <Tabs defaultValue="fees">
          <TabsList className="w-full">
            <TabsTrigger value="fees" className="flex-1">
              Top Fees
            </TabsTrigger>
            <TabsTrigger value="passes" className="flex-1">
              Most Passes
            </TabsTrigger>
            <TabsTrigger value="unique" className="flex-1">
              Unique Holders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="fees">
            <LeaderboardTable
              users={mostFeeEarned}
              type={LeaderboardTags.TopFeeEarned}
            />
          </TabsContent>
          <TabsContent value="passes">
            <LeaderboardTable
              users={mostPassHeld}
              type={LeaderboardTags.MostPassHeld}
            />
          </TabsContent>
          <TabsContent value="unique">
            <LeaderboardTable
              users={mostUniquePassHolders}
              type={LeaderboardTags.MostUniquePassHolders}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
