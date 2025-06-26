import { useSelector } from "react-redux";
import { Img } from "../../../../components/Img";
import { logoUrl } from "../../../../lib/constants";
import { onGoingOutpostSelectors } from "../../selectors";

export const TitleAndDescription = () => {
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  return (
    <div className="flex items-start space-x-4">
      {/* Outpost Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Img
          src={outpost?.image || logoUrl}
          alt={outpost?.name || "Outpost"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
          {outpost?.name || "Untitled Outpost"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 max-w-2xl">
          {outpost?.subject || "No description available"}
        </p>
      </div>
    </div>
  );
};
