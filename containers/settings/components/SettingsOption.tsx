import { useState } from "react";

interface SettingsOptionProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const SettingsOption = ({
  label,
  value,
  options,
  onChange,
}: SettingsOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <span className="block text-foreground mb-1">{label}</span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-muted text-foreground rounded-lg px-4 py-2 text-left"
        >
          {value}
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className={`px-3 py-2 rounded hover:bg-primary hover:text-primary-foreground cursor-pointer ${
                  option === value
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
