import {
  FreeOutpostEnterTypes,
  FreeOutpostSpeakerTypes,
  serverEnterTypeToText,
  serverSpeakerTypeToText,
} from "app/components/outpost/types";
import { Mic, Shield, Video } from "lucide-react";
import { OutpostModel } from "../../../services/api/types";
import { ScheduledDateSection, TimeUntil } from "./scheduledDate";

interface EventDetailsProps {
  outpost: OutpostModel;
}

export function EventDetails({ outpost }: EventDetailsProps) {
  const scheduledDate = new Date(outpost.scheduled_for);

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outpost.scheduled_for ? (
          <ScheduledDateSection outpost={outpost} />
        ) : (
          <></>
        )}

        {outpost.scheduled_for ? (
          <TimeUntil scheduledDate={scheduledDate} />
        ) : (
          <></>
        )}

        <div className="flex items-start gap-3">
          <Shield
            className={`w-5 h-5  mt-1 ${
              outpost.enter_type === FreeOutpostEnterTypes.public
                ? "text-green-500"
                : "text-red-500"
            }`}
          />
          <div>
            <p className="font-medium">Access Type</p>
            <p className="text-muted-foreground capitalize">
              {serverEnterTypeToText(outpost.enter_type)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 ">
          <Mic
            className={`w-5 h-5  mt-1 ${
              outpost.speak_type === FreeOutpostSpeakerTypes.everyone
                ? "text-green-500"
                : "text-red-500"
            }`}
          />
          <div>
            <p className="font-medium">Speaking Type</p>
            <p className="text-muted-foreground capitalize">
              {serverSpeakerTypeToText(outpost.speak_type)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Video
            className={`w-5 h-5 mt-1 ${
              outpost.is_recordable ? "text-red-600" : "text-primary"
            }`}
          />
          <div>
            <p className="font-medium">Recording</p>
            <p className="text-muted-foreground">
              {outpost.is_recordable
                ? "Recording Enabled"
                : "Recording Disabled"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield
            className={`w-5 h-5 mt-1 ${
              outpost.has_adult_content ? "text-red-600" : "text-green-500"
            }`}
          />
          <div>
            <p className="font-medium">Content Rating</p>
            <p className="text-muted-foreground">
              {outpost.has_adult_content
                ? "Adult Content - 18+ Only"
                : "Suitable for Everyone"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
