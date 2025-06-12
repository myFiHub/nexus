import { UserDetails } from "app/containers/userDetails";
import podiumApi from "app/services/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await podiumApi.getUserData(id);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: user.name || "User Profile",
    description: `View ${user.name || "user"}'s profile`,
  };
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  const [user, passBuyers, followers, followings] = await Promise.all([
    podiumApi.getUserData(id),
    podiumApi.podiumPassBuyers(id),
    podiumApi.getFollowersOfUser(id),
    podiumApi.getFollowingsOfUser(id),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <UserDetails
      user={user}
      passBuyers={passBuyers}
      followers={followers}
      followings={followings}
    />
  );
}
