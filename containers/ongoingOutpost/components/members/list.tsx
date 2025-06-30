import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { MemberCard } from "./MemberCard";

export const MembersList = () => {
  const members = useSelector(onGoingOutpostSelectors.membersList);

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <MemberCard key={member.uuid} address={member.address} />
      ))}
    </div>
  );
};
