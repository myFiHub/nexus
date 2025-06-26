"use client";
import {
  reminderDialog,
  ReminderDialogResult,
} from "app/components/Dialog/reminder";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../../components/Switch";
import { createOutpostSelectors } from "../../selectors";
import { dateTimePickerDialog } from "app/components/Calendar/date-time";
import { createOutpostActions } from "../../slice";

export const ScheduledField = () => {
  const scheduledFor = useSelector(createOutpostSelectors.scheduledFor);

  const dispatch = useDispatch();
  const scheduled = useSelector(createOutpostSelectors.scheduled);

  const handleChange = async (value: boolean) => {
    if (value) {
      const selectDateTimeResult = await dateTimePickerDialog({
        title: "Select Event Time",
      });
      if (selectDateTimeResult) {
        dispatch(createOutpostActions.setScheduledFor(selectDateTimeResult));
        dispatch(createOutpostActions.setScheduled(true));
      } else {
        dispatch(createOutpostActions.setScheduled(false));
        dispatch(createOutpostActions.setScheduledFor(0));
      }
    } else {
      dispatch(createOutpostActions.setScheduledFor(0));
      dispatch(createOutpostActions.setScheduled(false));
    }
  };
  return (
    <div className="flex items-center justify-between mt-2 w-full max-w-[400px]">
      <div>
        <div className="font-medium text-base">Scheduled Outpost</div>
        <div
          className={`text-[#b0b8c1] text-xs ${
            scheduledFor ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (scheduledFor) {
              handleChange(true);
            }
          }}
        >
          {scheduledFor
            ? `Set for ${format(new Date(scheduledFor), "MMM d, yyyy h:mm a")}`
            : "Organize and notify in advance."}
        </div>
      </div>
      <Switch checked={scheduled} onCheckedChange={handleChange} />
    </div>
  );
};
