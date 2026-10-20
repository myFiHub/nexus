"use client";

import { useClock } from "app/lib/clock";
import { formatDistance } from "date-fns";
import { Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { outpostDetailsSelectors } from "../../selectors";

const Content = () => {
  const outpost = useSelector(outpostDetailsSelectors.outpost);
  const scheduledFor = outpost?.scheduled_for;
  const timeUntil = useClock(
    (now) =>
      now === null || !scheduledFor
        ? null
        : formatDistance(new Date(scheduledFor), now, { addSuffix: true }),
    30_000
  );
  if (!outpost || !scheduledFor) {
    return null;
  }
  return (
    <div className="flex items-start gap-3">
      <Clock className="w-5 h-5 text-primary mt-1" />
      <div>
        <p className="font-medium">Time Until</p>
        <p className="text-muted-foreground" id={`time-until-${outpost.uuid}`}>
          {timeUntil ?? "\u00a0"}
        </p>
      </div>
    </div>
  );
};

export const TimeUntil = () => {
  return (
    <>
      <Content />
    </>
  );
};
