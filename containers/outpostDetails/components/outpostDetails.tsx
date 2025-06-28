import { OutpostModel } from "../../../services/api/types";
import { StateInitializer } from "../stateInitializer";
import { CreatorCard } from "./CreatorCard";
import { EventDetails } from "./EventDetails";
import { OutpostDetailsHeader } from "./header";
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Image with Overlay */}
          <OutpostDetailsHeader outpost={outpost} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-6">
              <CreatorCard outpost={outpost} />
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
