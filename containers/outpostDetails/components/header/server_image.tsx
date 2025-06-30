import { Img } from "app/components/Img";
import { localLogoUrl } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";

interface ServerImageProps {
  outpost: OutpostModel;
}

export const ServerImage = ({ outpost }: ServerImageProps) => {
  return (
    <>
      <Img
        src={outpost.image || localLogoUrl}
        alt={outpost.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </>
  );
};
