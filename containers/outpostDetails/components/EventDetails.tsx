import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Mic, Shield } from "lucide-react";
import { OutpostModel } from "../../../services/api/types";

interface EventDetailsProps {
  outpost: OutpostModel;
}

export function EventDetails({ outpost }: EventDetailsProps) {
  const scheduledDate = new Date(outpost.scheduled_for);
  const timeUntil = formatDistanceToNow(scheduledDate, { addSuffix: true });

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Scheduled For</p>
            <p className="text-muted-foreground">
              {scheduledDate.toLocaleString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Time Until</p>
            <p className="text-muted-foreground">{timeUntil}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Access Type</p>
            <p className="text-muted-foreground capitalize">
              {outpost.enter_type === "public"
                ? "Open to Everyone"
                : "Invitation Only"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mic className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Speaking Type</p>
            <p className="text-muted-foreground capitalize">
              {outpost.speak_type === "public"
                ? "Anyone Can Speak"
                : "Host Only"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
