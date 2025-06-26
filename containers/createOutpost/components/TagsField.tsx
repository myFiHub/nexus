"use client";
import { TagsInput } from "./TagsInput";

interface TagsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const TagsField = ({ value, onChange, error }: TagsFieldProps) => {
  return (
    <div className="w-full max-w-[400px]">
      <TagsInput
        value={value || []}
        onChange={onChange}
        placeholder="Enter a tag (optional)..."
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};
