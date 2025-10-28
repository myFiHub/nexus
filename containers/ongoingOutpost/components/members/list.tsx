import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { MemberCard } from "./MemberCard";

export const MembersList = () => {
  const members = useSelector(onGoingOutpostSelectors.membersList);
  const membersSearchValue = useSelector(
    onGoingOutpostSelectors.membersSearchValue
  );
  const filteredMembers = members.filter((member) => {
    if (!membersSearchValue) return true;
    return member.name.toLowerCase().includes(membersSearchValue.toLowerCase());
  });
  if (filteredMembers.length === 0)
    return (
      <div className="text-center text-muted-foreground">No results found</div>
    );
  return (
    <div className="space-y-3 max-h-[490px]">
      {filteredMembers.map((member) => (
        <MemberCard key={member.uuid} address={member.address} />
      ))}
    </div>
  );
};
