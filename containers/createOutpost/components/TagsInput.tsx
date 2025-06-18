import React from "react";
import { TagsInput as BaseTagsInput } from "react-tag-input-component";

export type TagsInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
};

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <>
      <BaseTagsInput
        value={value}
        onChange={onChange}
        placeHolder={placeholder}
        classNames={{
          input: `file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
            className || ""
          }`,
          tag: "bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm font-medium mr-1",
        }}
      />
      <style>{`
        .rti--container {
          background-color: transparent !important;
          border-color: #94a3b8 !important; /* Tailwind slate-400 */
          border-radius: 0.375rem !important; /* Tailwind rounded-md */
         }
        .rti--tag {
          background-color: #dbeafe !important; /* Tailwind blue-100 */
          color: #1d4ed8 !important; /* Tailwind blue-700 */
          border-radius: 0.375rem !important;
          padding: 0.15rem 0.25rem !important;
        }
        .rti--tag button {
          color: #ef4444 !important; /* Tailwind red-500 */
        }
      `}</style>
    </>
  );
};
