"use client";
import { allowedToSpeakOptions } from "app/components/outpost/types";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/Popover";
import { useDispatch, useSelector } from "react-redux";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const SpeakField = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const allowedToSpeak = useSelector(createOutpostSelectors.allowedToSpeak);
  const handleChange = (value: string) => {
    dispatch(createOutpostActions.setAllowedToSpeak(value));
  };
  return (
    <div className="w-full max-w-[400px]">
      <div className="font-medium text-[15px] mb-1">Allowed to Speak</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full bg-[#181f29] text-white rounded-lg px-4 py-3 text-base text-left shadow-sm hover:bg-[#232b36] focus:bg-[#232b36] transition-colors outline-none"
          >
            {
              allowedToSpeakOptions.find((item) => item.value == allowedToSpeak)
                ?.text
            }
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start" sideOffset={4}>
          <div>
            {allowedToSpeakOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="block w-full text-left px-2 py-1 hover:bg-primary/10"
                onClick={() => {
                  handleChange(option.value);
                  setOpen(false);
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
