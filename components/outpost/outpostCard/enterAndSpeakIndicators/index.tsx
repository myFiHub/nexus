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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm">
      {/* Access Type */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 text-muted-foreground ${
              outpost.enter_type !== BuyableTicketTypes.onlyPodiumPassHolders
                ? "cursor-help"
                : ""
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
              {outpost.enter_type === FreeOutpostEnterTypes.public ? (
                <Unlock className="w-3 h-3 text-green-500" />
              ) : (
                <LockActionIcon outpost={outpost} />
              )}
            </div>
            <span className="capitalize font-medium text-xs">
              {serverEnterTypeToText(outpost.enter_type)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-white">
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
          <div className="flex items-center gap-2 text-muted-foreground cursor-help">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
              {outpost.speak_type === FreeOutpostSpeakerTypes.everyone ? (
                <Mic className="w-3 h-3 text-green-500" />
              ) : (
                <MicOff className="w-3 h-3 text-orange-500" />
              )}
            </div>
            <span className="capitalize font-medium text-xs">
              {serverSpeakerTypeToText(outpost.speak_type)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-white">
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
