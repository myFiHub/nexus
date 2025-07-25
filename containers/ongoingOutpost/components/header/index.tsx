import { GlobalSelectors } from "app/containers/global/selectors";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { Controlls } from "./actions";
import { MuteUnmuteButton } from "./actions/mute_unmute_button";
import { MyTimer } from "./myTimer";
import { TitleAndDescription } from "./titleAndDescription";

export const OutpostHeader = () => {
  const accesses = useSelector(onGoingOutpostSelectors.accesses);
  const leaving = useSelector(onGoingOutpostSelectors.leaving);
  const joiningOutpostId = useSelector(GlobalSelectors.joiningOutpostId);

  if (!accesses?.canEnter && !leaving && !joiningOutpostId) {
    console.log("Access denied");
    return <></>;
  }

  return (
    <div className="bg-card border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center py-4 space-y-4 lg:space-y-0">
          {/* Left side - Title and Description */}
          <div className="lg:col-span-1 min-w-0">
            <TitleAndDescription />
          </div>

          {/* Center - Timer and Mute Button */}
          <div className="flex justify-center lg:col-span-1">
            <div className="flex items-stretch bg-muted/50 backdrop-blur-sm border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="flex-1">
                <MyTimer />
              </div>
              <div className="border-l border-border flex-1">
                <MuteUnmuteButton />
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex justify-center lg:justify-end lg:col-span-1 min-w-0">
            <Controlls />
          </div>
        </div>
      </div>
    </div>
  );
};
