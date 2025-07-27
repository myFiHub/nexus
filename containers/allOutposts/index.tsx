import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { OutpostsList } from "app/components/outpost/OutpostsList";
import { OutpostModel } from "../../services/api/types";
import { ClientOutpostsList } from "./ClientOutpostsList";

interface AllOutpostsContainerProps {
  initialOutposts: OutpostModel[];
}

export const AllOutpostsContainer = ({
  initialOutposts,
}: AllOutpostsContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <RouteLoaderCleaner />
      <h1 className="text-4xl font-bold mb-8 text-center">All Outposts</h1>
      <OutpostsList outposts={initialOutposts} />
      <ClientOutpostsList initialOutposts={initialOutposts} />
    </div>
  );
};
