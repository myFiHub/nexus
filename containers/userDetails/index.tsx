import { User } from "app/services/api/types";
import { ClientRedirecter } from "./components/clientRedirecter";
import { UserProfile } from "./components/UserProfile";
import { UserStats } from "./components/UserStats";

interface UserDetailsProps {
  user: User;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <>
      <ClientRedirecter id={user.uuid} />
      <div className="p-4 sm:p-6">
        <UserProfile user={user} />
        <UserStats user={user} />
      </div>
    </>
  );
};
