import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { UsersPage } from "../../../../containers/dashboard/users/pages";
import { UserTags } from "./_filters";
import UsersStructuredData from "./_usersStructuredData";
import { getFilterDescription, getFilterTitle } from "./_utils";

interface Props {
  params: Promise<{ filter: UserTags }>;
}

const getUsersWithCache = unstable_cache(
  async (filter: UserTags) => {
    switch (filter) {
      case UserTags.RecentlyJoined:
        return podiumApi.getRecentlyJoinedUsers();
      case UserTags.TopOwners:
        return podiumApi.getTopOwners();
      default:
        return null;
    }
  },
  [UserTags.RecentlyJoined, UserTags.TopOwners],
  {
    revalidate: 600, // 10 minutes
  }
);

export default async function Page({ params }: Props) {
  const { filter } = await params;
  const users = await getUsersWithCache(filter);

  if (!users || users.length === 0) {
    return notFound();
  }

  return (
    <>
      <UsersPage users={users} filter={filter} />
      <UsersStructuredData
        users={users}
        filterTitle={getFilterTitle(filter)}
        filterDescription={getFilterDescription(filter)}
      />
    </>
  );
}
