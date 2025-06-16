import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/Popover";

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
  return (
    <div className="mb-3">
      <span className="block text-white mb-1">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full bg-[#181926] text-white rounded-lg px-4 py-2 text-left">
            {value}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2 w-48">
          {options.map((option) => (
            <div
              key={option}
              className={`px-3 py-2 rounded hover:bg-[#c26bfa] hover:text-white cursor-pointer ${
                value === option
                  ? "bg-[#c26bfa] text-white"
                  : "text-black dark:text-white"
              }`}
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
