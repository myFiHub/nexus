"use client";
import { dateTimePickerDialog } from "app/components/Calendar/date-time";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../../components/Switch";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";
import { LumaField } from "./LumaField";

export const ScheduledField = () => {
  const dispatch = useDispatch();
  const scheduled = useSelector(createOutpostSelectors.scheduled);
  const scheduledFor = useSelector(createOutpostSelectors.scheduledFor);

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
    <div className="w-full ">
      <div className="flex items-center justify-between mt-2">
        <div
          className="cursor-pointer"
          onClick={() => handleChange(!scheduled)}
        >
          <div className="font-medium text-base">Scheduled Outpost</div>
          <div
            className={`text-[#b0b8c1] text-xs ${
              scheduledFor ? "cursor-pointer" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (scheduledFor) {
                handleChange(true);
              }
            }}
          >
            {scheduledFor
              ? `Set for ${format(
                  new Date(scheduledFor),
                  "MMM d, yyyy h:mm a"
                )}`
              : "Organize and notify in advance."}
          </div>
        </div>
        <Switch checked={scheduled} onCheckedChange={handleChange} />
      </div>

      {/* Animated Luma Field Container */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: scheduledFor ? "auto" : 0,
          opacity: scheduledFor ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.3, ease: "easeOut" },
          opacity: { duration: 0.2, ease: "easeOut" },
        }}
      >
        <LumaField />
      </motion.div>
    </div>
  );
};
