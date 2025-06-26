"use client";
import { Switch } from "../../../components/Switch";

interface AdultsFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const AdultsField = ({ value, onChange }: AdultsFieldProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-[400px]">
      <div className="font-medium text-base">Adults speaking</div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};
