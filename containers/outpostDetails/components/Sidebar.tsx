import { Shield, Video } from "lucide-react";
import { Button } from "../../../components/Button";
import { OutpostModel } from "../../../services/api/types";
import { JoinButton } from "./JoinButton";

interface SidebarProps {
  outpost: OutpostModel;
  isUpcoming: boolean;
}

export function Sidebar({ outpost, isUpcoming }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Join Button */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
        <JoinButton />
      </div>

      {/* Additional Info */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold text-lg mb-2">Additional Information</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-[var(--muted-foreground)]">
              {outpost.is_recordable
                ? "Recording Enabled - This session will be recorded"
                : "Recording Disabled - This session will not be recorded"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-[var(--muted-foreground)]">
              {outpost.has_adult_content
                ? "Adult Content - 18+ Only"
                : "All Ages - Suitable for Everyone"}
            </span>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
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
