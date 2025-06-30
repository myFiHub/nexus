import { Suspense } from "react";
import { OutpostModel } from "../../services/api/types";
import { OutpostDetails } from "./components/outpostDetails";
import { OutpostDetailsSkeleton } from "./components/OutpostDetailsSkeleton";

interface OutpostDetailsContainerProps {
  outpost: OutpostModel;
  lumaSlot?: React.ReactNode;
}

export const OutpostDetailsContainer = async ({
  outpost,
  lumaSlot,
}: OutpostDetailsContainerProps) => {
  return (
    <Suspense fallback={<OutpostDetailsSkeleton />}>
      <OutpostDetails outpost={outpost} lumaSlot={lumaSlot} />
    </Suspense>
  );
};
