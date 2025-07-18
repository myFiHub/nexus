"use client";

import {
  LEADERBOARD_PAGE_SIZE,
  LeaderboardTags,
} from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";
import { leaderboardSelectors } from "../selectors";
import { LeaderboardRow } from "./LeaderboardRow";

const Content = ({ type }: { type: LeaderboardTags }) => {
  const users = useSelector(leaderboardSelectors.users(type));
  return (
    <>
      {users.map((user, idx) => (
        <LeaderboardRow
          type={type}
          key={user.podium_pass_owner_uuid || idx}
          user={user}
          rank={idx + LEADERBOARD_PAGE_SIZE[type] + 1}
        />
      ))}
    </>
  );
};

const ClientSideList = ({ type }: { type: LeaderboardTags }) => {
  return (
    <ReduxProvider>
      <Content type={type} />
    </ReduxProvider>
  );
};

export default ClientSideList;
