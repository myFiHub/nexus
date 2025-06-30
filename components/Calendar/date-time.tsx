"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "app/components/Button";
import { Calendar } from "app/components/Calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "app/components/Popover";
import { cn } from "app/lib/utils";
import { ScrollArea, ScrollBar } from "../scrollArea";

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setDate(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm")
          ) : (
            <span>MM/DD/YYYY hh:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="xs"
                    variant={
                      date && date.getHours() === hour ? "primary" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="xs"
                    variant={
                      date && date.getMinutes() === minute ? "primary" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerDialogProps {
  title?: string;
  initialDate?: Date;
}

export type DateTimePickerDialogResult = number | null;

let resolvePromise: ((value: DateTimePickerDialogResult) => void) | null = null;

export const dateTimePickerDialog = ({
  title = "Select Date & Time",
  initialDate,
}: DateTimePickerDialogProps): Promise<DateTimePickerDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-datetime-picker-dialog", {
      detail: {
        title,
        initialDate,
      },
    });
    window.dispatchEvent(event);
  });
};

export const DateTimePickerDialogProvider = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();
  const [dialogContent, setDialogContent] =
    React.useState<DateTimePickerDialogProps | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Calculate the minimum selectable date (10 minutes from now)
  const getMinSelectableDate = () => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    return minDate;
  };

  // Function to check if a date should be disabled (for calendar)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Calculate the maximum selectable date (4 months from now)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 4);
    maxDate.setHours(23, 59, 59, 999); // End of the day

    return date < today || date > maxDate;
  };

  // Function to check if a time combination would be valid
  const isTimeValid = (hour: number, minute: number) => {
    if (!date) return true;

    const testDate = new Date(date);
    testDate.setHours(hour, minute, 0, 0);
    const now = new Date();

    // Calculate the maximum allowed date (4 months from now)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 4);

    // Check if the test date exceeds the maximum allowed date
    if (testDate > maxDate) {
      return false;
    }

    // If the selected date is today, disable times before 1 minute from now
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateStart = new Date(date);
    selectedDateStart.setHours(0, 0, 0, 0);

    if (selectedDateStart.getTime() === today.getTime()) {
      const oneMinuteFromNow = new Date(now.getTime() + 1 * 60 * 1000);
      return testDate >= oneMinuteFromNow;
    }

    // For future dates, allow any time (as long as it doesn't exceed maxDate)
    return true;
  };

  // Function to check if current date+time combination is valid
  const isCurrentSelectionValid = () => {
    if (!date) return false;
    return isTimeValid(date.getHours(), date.getMinutes());
  };

  React.useEffect(() => {
    const handleShowDialog = (
      event: CustomEvent<DateTimePickerDialogProps>
    ) => {
      setDialogContent(event.detail);
      setDate(event.detail.initialDate);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-datetime-picker-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-datetime-picker-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setDate(newDate);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(date ? date.getTime() : null);
    resolvePromise = null;
    setDate(undefined);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(null);
    resolvePromise = null;
    setDate(undefined);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed (by clicking outside, pressing escape, etc.), treat as cancel
          handleCancel();
        }
      }}
    >
      <DialogContent className="w-auto p-0 max-w-none">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="xs"
                    variant={
                      date && date.getHours() === hour ? "primary" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="xs"
                    variant={
                      date && date.getMinutes() === minute ? "primary" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isCurrentSelectionValid()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
