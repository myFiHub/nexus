import { OutpostRatingDialogProvider } from "app/components/Dialog/outpostRatingDialog";
import { OutpostModel } from "../../../services/api/types";
import { StateInitializer } from "../stateInitializer";
import { CreatorCard } from "./creatorCard";
import { EventDetails } from "./EventDetails";
import { OutpostDetailsHeader } from "./header";
import { InviteUsersButton } from "./InviteUsersButton";
import { JoinButton } from "./JoinButton";
import { Sidebar } from "./Sidebar";
import { Tags } from "./Tags";

interface OutpostDetailsProps {
  outpost: OutpostModel;
  lumaSlot?: React.ReactNode;
}

export function OutpostDetails({ outpost, lumaSlot }: OutpostDetailsProps) {
  const scheduledDate = new Date(outpost.scheduled_for);
  const isUpcoming = scheduledDate > new Date();

  return (
    <>
      <StateInitializer outpost={outpost} />
      <OutpostRatingDialogProvider />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Image with Overlay */}
          <OutpostDetailsHeader outpost={outpost} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-6">
              <CreatorCard outpost={outpost} />

              {/* Mobile Action Buttons - Only visible on mobile */}
              <div className="lg:hidden space-y-4">
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <JoinButton outpost={outpost} />
                </div>
                <InviteUsersButton outpost={outpost} className="w-full" />
              </div>

              <EventDetails outpost={outpost} />
              <Tags tags={outpost.tags} />
              {lumaSlot}
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-2">
              <Sidebar outpost={outpost} isUpcoming={isUpcoming} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
