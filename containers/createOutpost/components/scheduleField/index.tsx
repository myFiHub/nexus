"use client";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../../components/Switch";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";

export const ScheduledField = () => {
  const dispatch = useDispatch();
  const scheduled = useSelector(createOutpostSelectors.scheduled);
  const handleChange = (value: boolean) => {
    dispatch(createOutpostActions.setScheduled(value));
  };
  return (
    <div className="flex items-center justify-between mt-2 w-full max-w-[400px]">
      <div>
        <div className="font-medium text-base">Scheduled Outpost</div>
        <div className="text-[#b0b8c1] text-xs">
          Organize and notify in advance.
        </div>
      </div>
      <Switch checked={scheduled} onCheckedChange={handleChange} />
    </div>
  );
};
