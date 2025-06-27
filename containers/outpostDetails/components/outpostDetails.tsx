import { Img } from "../../../components/Img";
import { logoUrl } from "../../../lib/constants";
import { OutpostModel } from "../../../services/api/types";
import { StateInitializer } from "../stateInitializer";
import { CreatorCard } from "./CreatorCard";
import { EventDetails } from "./EventDetails";
import { LumaEventDetails } from "./LumaEventDetails";
import { MembersList } from "./MembersList";
import { Sidebar } from "./Sidebar";
import { Tags } from "./Tags";

interface OutpostDetailsProps {
  outpost: OutpostModel;
}

export function OutpostDetails({ outpost }: OutpostDetailsProps) {
  const scheduledDate = new Date(outpost.scheduled_for);
  const isUpcoming = scheduledDate > new Date();
  return (
    <>
      <StateInitializer outpost={outpost} />
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Image with Overlay */}
          <div className="relative w-full mb-8 rounded-xl overflow-hidden group flex justify-center">
            <div className="w-full h-full rounded-[400px] group-hover:rounded-none transition-all duration-500 ease-in-out overflow-hidden max-w-xl">
              <Img
                src={outpost.image || logoUrl}
                alt={outpost.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-lg lg:text-4xl font-bold mb-2">
                {outpost.name}
              </h1>
              <p className="text-xl opacity-90">{outpost.subject}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <CreatorCard outpost={outpost} />
              <EventDetails outpost={outpost} />
              <Tags tags={outpost.tags} />
              {outpost.luma_event_id && (
                <LumaEventDetails eventId={outpost.luma_event_id} />
              )}
              <MembersList outpost={outpost} />
            </div>

            {/* Right Column - Actions */}
            <Sidebar outpost={outpost} isUpcoming={isUpcoming} />
          </div>
        </div>
      </div>
    </>
  );
}
