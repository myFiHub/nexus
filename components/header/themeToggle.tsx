"use client";

import { THEMES, ThemeOption } from "app/lib/theme";
import { applyTheme, useTheme } from "app/lib/useTheme";
import { cn } from "app/lib/utils";
import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

const Swatch = ({ theme }: { theme: ThemeOption }) => {
  const [bg, surface, accent, secondary] = theme.swatch;
  return (
    <span
      className="relative inline-flex h-8 w-8 shrink-0 overflow-hidden rounded-[10px] ring-1 ring-black/10"
      style={{ background: bg }}
      aria-hidden
    >
      <span
        className="absolute inset-x-1 bottom-1 top-3 rounded-[6px]"
        style={{ background: surface }}
      />
      <span
        className="absolute left-1.5 top-1.5 h-2 w-5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${secondary})` }}
      />
    </span>
  );
};

export const ThemeToggle = () => {
  const current = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Change theme">
          <Palette className="w-5 h-5 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5 rounded-[18px]">
        <p className="label-caps px-2 py-1.5">Theme</p>
        <div role="radiogroup" aria-label="Theme" className="flex flex-col">
          {THEMES.map((theme) => {
            const selected = current === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  applyTheme(theme.id);
                  setOpen(false);
                }}
                className={cn(
                  "press flex items-center gap-3 rounded-[12px] px-2 py-2 text-left cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "bg-accent"
                )}
              >
                <Swatch theme={theme} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {theme.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {theme.description}
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
