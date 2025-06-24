interface MembersBadgeProps {
  membersCount?: number;
}

export function MembersBadge({ membersCount = 0 }: MembersBadgeProps) {
  return (
    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
      {membersCount} member{membersCount > 1 ? "s" : ""}
    </div>
  );
}
