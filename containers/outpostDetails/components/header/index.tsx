import { ShareButton } from "app/components/outpost/outpostCard/actions/ShareButton";
import { OutpostModel } from "app/services/api/types";
import { EditImageButton } from "../EditImageButton";
import { ServerImage } from "./server_image";

export const OutpostDetailsHeader = ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  return (
    <div className="relative w-full mb-8 rounded-xl overflow-hidden group flex justify-center">
      <div className="w-full h-full rounded-[400px] group-hover:rounded-none transition-all duration-500 ease-in-out overflow-hidden max-w-xl relative">
        <ServerImage outpost={outpost} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <EditImageButton outpost={outpost} />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h1 className="text-lg lg:text-4xl font-bold mb-2">{outpost.name}</h1>
        <p className="text-xl opacity-90">{outpost.subject}</p>
      </div>

      {/* Share Button - Top Right Corner */}
      <div className="absolute top-4 right-4 z-10">
        <ShareButton outpost={outpost} />
      </div>
    </div>
  );
};
