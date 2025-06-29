interface MembersBadgeProps {
  membersCount?: number;
}

export function MembersBadge({ membersCount = 0 }: MembersBadgeProps) {
  return (
    <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
      <span>{membersCount} </span>
      <span>member{membersCount > 1 ? "s" : ""}</span>
    </div>
  );
}
