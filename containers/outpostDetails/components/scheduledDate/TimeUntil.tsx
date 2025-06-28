"use client";

import { ReduxProvider } from "app/store/Provider";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { outpostDetailsSelectors } from "../../selectors";

const Content = () => {
  const outpost = useSelector(outpostDetailsSelectors.outpost);
  if (!outpost || !outpost.scheduled_for) {
    return null;
  }
  const scheduledDate = new Date(outpost.scheduled_for);
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
};

export const TimeUntil = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
