import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface TimeUntilProps {
  scheduledDate: Date;
}

export function TimeUntil({ scheduledDate }: TimeUntilProps) {
  const timeUntil = formatDistanceToNow(scheduledDate, { addSuffix: true });

  return (
    <div className="flex items-start gap-3">
      <Clock className="w-5 h-5 text-primary mt-1" />
      <div>
        <p className="font-medium">Time Until</p>
        <p className="text-muted-foreground">{timeUntil}</p>
      </div>
    </div>
  );
}
