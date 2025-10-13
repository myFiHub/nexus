"use client";

import { cohostsViewDialog, CohostsViewDialogProvider } from "./CohostsDialog";

interface CohostsProps {
  cohosts?: string[];
}

export const Cohosts = ({ cohosts }: CohostsProps) => {
  if (!cohosts || cohosts.length === 0) return null;

  const handleClick = async () => {
    await cohostsViewDialog({
      title: "Cohosts",
      cohostUuids: cohosts,
    });
  };

  return (
    <>
      <CohostsViewDialogProvider />
      <button
        onClick={handleClick}
        className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer font-medium hover:underline"
      >
        {cohosts.length} Cohost{cohosts.length !== 1 ? "s" : ""}
      </button>
    </>
  );
};
