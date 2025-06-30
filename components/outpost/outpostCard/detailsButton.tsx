import OutpostLink from "app/components/AppLink/outpostLink";
import { OutpostModel } from "app/services/api/types";
import { Info } from "lucide-react";

export const DetailsButton = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <OutpostLink
      id={outpost.uuid}
      variant="outline"
      className="bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80 hover:border-white/40 w-8 h-8 p-0 rounded-md"
    >
      <Info />
    </OutpostLink>
  );
};
