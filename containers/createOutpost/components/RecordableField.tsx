"use client";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../components/Switch";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const RecordableField = () => {
  const dispatch = useDispatch();
  const recordable = useSelector(createOutpostSelectors.recordable);
  const handleChange = (value: boolean) => {
    dispatch(createOutpostActions.setRecordable(value));
  };
  return (
    <div className="flex items-center justify-between w-full max-w-[400px]">
      <div>
        <div className="font-medium text-base">Recordable</div>
        <div className="text-[#b0b8c1] text-xs">
          Outpost sessions can be recorded by you
        </div>
      </div>
      <Switch checked={recordable} onCheckedChange={handleChange} />
    </div>
  );
};
