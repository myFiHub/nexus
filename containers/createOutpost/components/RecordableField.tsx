"use client";
import { Switch } from "../../../components/Switch";

interface RecordableFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const RecordableField = ({ value, onChange }: RecordableFieldProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-[400px]">
      <div>
        <div className="font-medium text-base">Recordable</div>
        <div className="text-[#b0b8c1] text-xs">
          Outpost sessions can be recorded by you
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};
