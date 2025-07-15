import { Users } from "lucide-react";
import { OutpostModel } from "../../../../services/api/types";
import { MemberCard } from "./MemberCard";

interface MembersListProps {
  outpost: OutpostModel;
}

export function MembersList({ outpost }: MembersListProps) {
  if (!outpost.members || outpost.members.length === 0) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            Members ({outpost.members.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Community participants
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {outpost.members.map((member) => (
          <MemberCard key={member.uuid} member={member} />
        ))}
      </div>
    </div>
  );
}
