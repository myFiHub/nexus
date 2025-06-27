import { Suspense } from "react";
import { OutpostModel } from "../../services/api/types";
import { OutpostDetails } from "./components/outpostDetails";

interface OutpostDetailsContainerProps {
  outpost: OutpostModel;
  lumaSlot?: React.ReactNode;
}

export const OutpostDetailsContainer = async ({
  outpost,
  lumaSlot,
}: OutpostDetailsContainerProps) => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className=" w-full mb-8 rounded-xl bg-[var(--card-bg)] animate-pulse" />
            <div className="space-y-6">
              <div className="h-12 bg-[var(--card-bg)] rounded-lg animate-pulse" />
              <div className="h-12 bg-[var(--card-bg)] rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-24 bg-[var(--card-bg)] rounded-lg animate-pulse" />
                <div className="h-24 bg-[var(--card-bg)] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <OutpostDetails outpost={outpost} lumaSlot={lumaSlot} />
    </Suspense>
  );
};
