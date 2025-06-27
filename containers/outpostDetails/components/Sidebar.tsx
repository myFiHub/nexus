import { Button } from "../../../components/Button";
import { OutpostModel } from "../../../services/api/types";
import { JoinButton } from "./JoinButton";
import { MembersList } from "./MembersList";

interface SidebarProps {
  outpost: OutpostModel;
  isUpcoming: boolean;
}

export function Sidebar({ outpost, isUpcoming }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Join Button */}
      <div className="bg-card p-6 rounded-xl shadow-sm">
        <JoinButton outpost={outpost} />
      </div>

      {/* Members List */}
      <MembersList outpost={outpost} />

      {/* Share Section */}
      <div className="bg-card p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Share This Event</h3>
        <div className="flex gap-3">
          <Button variant="primary" colorScheme="primary" className="flex-1">
            Twitter
          </Button>
          <Button variant="primary" colorScheme="primary" className="flex-1">
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
