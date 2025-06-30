import { LiveMember } from "app/services/api/types";

interface MemberHeaderProps {
  member: LiveMember;
  isCurrentUser: boolean;
}

export const MemberHeader = ({ member, isCurrentUser }: MemberHeaderProps) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-sm truncate">
          {member.name}
          {isCurrentUser && " (You)"}
        </h3>
        {member.is_recording && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};
