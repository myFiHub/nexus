"use client";
import { Input } from "../../../components/Input";

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const NameField = ({ value, onChange, error }: NameFieldProps) => {
  return (
    <div className="w-full max-w-[400px]">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Outpost Name"
        aria-invalid={!!error}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
