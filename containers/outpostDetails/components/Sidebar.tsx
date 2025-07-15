import { AppLink } from "app/components/AppLink";
import { FreeOutpostEnterTypes } from "app/components/outpost/types";
import { generateOutpostShareUrl } from "app/lib/utils";
import { OutpostModel } from "../../../services/api/types";
import { InviteUsersButton } from "./InviteUsersButton";
import { JoinButton } from "./JoinButton";
import { MembersList } from "./members";

interface SidebarProps {
  outpost: OutpostModel;
  isUpcoming: boolean;
}

export function Sidebar({ outpost }: SidebarProps) {
  const shareUrl = generateOutpostShareUrl(outpost.uuid);
  return (
    <div className="space-y-6">
      {/* Join Button - Hidden on mobile */}
      <div className="hidden lg:block bg-card p-6 rounded-xl shadow-sm">
        <JoinButton outpost={outpost} />
      </div>

      {/* Invite Users Button - Hidden on mobile */}
      <div className="hidden lg:block">
        <InviteUsersButton outpost={outpost} className="w-full" />
      </div>

      {/* Members List */}
      <MembersList outpost={outpost} />

      {/* Share Section */}
      {outpost.enter_type == FreeOutpostEnterTypes.public ? (
        <div className="bg-card p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Share This Event</h3>
          <div className="flex gap-3">
            <AppLink
              href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
              className="flex-1 bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80 hover:border-white/40"
              variant="outline"
            >
              Twitter
            </AppLink>
            <AppLink
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              className="flex-1 bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80 hover:border-white/40"
              variant="outline"
            >
              Facebook
            </AppLink>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
