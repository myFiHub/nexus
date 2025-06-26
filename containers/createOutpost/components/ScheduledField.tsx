"use client";
import { Switch } from "../../../components/Switch";

interface ScheduledFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ScheduledField = ({ value, onChange }: ScheduledFieldProps) => {
  return (
    <div className="flex items-center justify-between mt-2 w-full max-w-[400px]">
      <div>
        <div className="font-medium text-base">Scheduled Outpost</div>
        <div className="text-[#b0b8c1] text-xs">
          Organize and notify in advance.
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};
