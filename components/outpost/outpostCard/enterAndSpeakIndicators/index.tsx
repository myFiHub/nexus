import { OutpostModel } from "app/services/api/types";
import { Mic, MicOff, Unlock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../Tooltip";
import {
  BuyableTicketTypes,
  FreeOutpostEnterTypes,
  FreeOutpostSpeakerTypes,
  serverEnterTypeToText,
  serverSpeakerTypeToText,
} from "../../types";
import { LockActionIcon } from "./lockActionIcon";

const tooltipExplanation = {
  // Access types
  [FreeOutpostEnterTypes.public]: "Everyone can enter this outpost",
  [FreeOutpostEnterTypes.onlyLink]:
    "Only users with the link can enter this outpost",
  [FreeOutpostEnterTypes.invited_users]:
    "Only invited users can enter this outpost",
  [BuyableTicketTypes.onlyPodiumPassHolders]:
    "Only Podium Pass holders can enter this outpost",
};

const speakTooltipExplanation = {
  [FreeOutpostSpeakerTypes.everyone]: "Everyone can speak in this outpost",
  [FreeOutpostSpeakerTypes.invited_users]:
    "Only invited users can speak in this outpost",
  [BuyableTicketTypes.onlyPodiumPassHolders]:
    "Only Podium Pass holders can speak in this outpost",
};

export const EnterAndSpeakIndicators = ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 text-sm">
      {/* Access Type */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 text-[var(--muted-foreground)] ${
              outpost.enter_type !== BuyableTicketTypes.onlyPodiumPassHolders
                ? "cursor-help"
                : ""
            }`}
          >
            {outpost.enter_type === FreeOutpostEnterTypes.public ? (
              <Unlock className="w-4 h-4 text-green-500" />
            ) : (
              <LockActionIcon outpost={outpost} />
            )}
            <span className="capitalize">
              {serverEnterTypeToText(outpost.enter_type)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {
              tooltipExplanation[
                outpost.enter_type as keyof typeof tooltipExplanation
              ]
            }
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Speak Type */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] cursor-help">
            {outpost.speak_type === FreeOutpostSpeakerTypes.everyone ? (
              <Mic className="w-4 h-4 text-green-500" />
            ) : (
              <MicOff className="w-4 h-4 text-orange-500" />
            )}
            <span className="capitalize">
              {serverSpeakerTypeToText(outpost.speak_type)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {
              speakTooltipExplanation[
                outpost.speak_type as keyof typeof speakTooltipExplanation
              ]
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
