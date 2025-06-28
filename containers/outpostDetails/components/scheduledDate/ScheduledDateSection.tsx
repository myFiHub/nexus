import { Calendar } from "lucide-react";
import { EditScheduledDateButton } from "./EditScheduledDateButton";
import { OutpostModel } from "app/services/api/types";

interface ScheduledDateSectionProps {
  outpost: OutpostModel;
}

export const ScheduledDateSection = ({
  outpost,
}: ScheduledDateSectionProps) => {
  const scheduledDate = new Date(outpost.scheduled_for);

  return (
    <div className="flex items-start gap-3">
      <Calendar className="w-5 h-5 text-primary mt-1" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">Scheduled For</p>
          <EditScheduledDateButton outpost={outpost} />
        </div>
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
  );
};
