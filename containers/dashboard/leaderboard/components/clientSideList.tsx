"use client";

import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";
import { leaderboardSelectors } from "../selectors";
import { LeaderboardRow } from "./LeaderboardRow";

const Content = () => {
  const users = useSelector(
    leaderboardSelectors.users(LeaderboardTags.TopFeeEarned)
  );
  return (
    <>
      {users.map((user, idx) => (
        <LeaderboardRow
          key={user.podium_pass_owner_uuid || idx}
          user={user}
          rank={idx + 1}
        />
      ))}
    </>
  );
};

const ClientSideList = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};

export default ClientSideList;
