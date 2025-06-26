"use client";
import { Input } from "../../../components/Input";

interface SubjectFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
}

export const SubjectField = ({ value, onChange, error }: SubjectFieldProps) => {
  return (
    <div className="w-full max-w-[400px]">
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Main Subject (optional)"
        aria-invalid={!!error}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
