"use client";

import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";
import { getDisplayConfig } from ".";
import { UserCard } from "../components/UserCard";
import { dashboardUsersSelectors } from "../selectors";
import ListEndObserver from "./listEndObserver";

const Content = ({ filter }: { filter: UserTags }) => {
  const users = useSelector(dashboardUsersSelectors.users(filter));

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => {
            const config = getDisplayConfig(user, filter);
            return (
              <UserCard
                key={user.uuid}
                user={user as any}
                displayType={config.displayType}
                displayValue={config.displayValue ?? ""}
                displayColor={config.displayColor}
              />
            );
          })}
        </div>
      </div>
      <ListEndObserver filter={filter} />
    </>
  );
};

const ClientSideList = ({ filter }: { filter: UserTags }) => {
  return (
    <ReduxProvider>
      <Content filter={filter} />
    </ReduxProvider>
  );
};

export default ClientSideList;
