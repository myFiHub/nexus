import { Users } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { RefreshButton } from "./refreshButton";

export const MembersHeader = () => {
  const numberOfMembers = useSelector(onGoingOutpostSelectors.membersCount);

  return (
    <div className="flex items-center gap-1">
      <Users className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-sm">
        Live Members ({numberOfMembers != 0 ? numberOfMembers : "..."})
      </h3>
      {numberOfMembers != 0 ? <RefreshButton /> : <></>}
    </div>
  );
};
