import { OutpostModel } from "app/services/api/types";
import { Lock, Mic, MicOff, Unlock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../Tooltip";
import {
  allowedToEnterOptions,
  allowedToSpeakOptions,
  BuyableTicketTypes,
  FreeOutpostAccessTypes,
  FreeOutpostSpeakerTypes,
} from "../types";

const tooltipExplanation = {
  // Access types
  [FreeOutpostAccessTypes.public]: "Everyone can enter this outpost",
  [FreeOutpostAccessTypes.onlyLink]:
    "Only users with the link can enter this outpost",
  [FreeOutpostAccessTypes.invited_users]:
    "Only invited users can enter this outpost",
  [BuyableTicketTypes.onlyPodiumPassHolders]:
    "Only Podium Pass holders can enter this outpost",
  [BuyableTicketTypes.onlyFriendTechTicketHolders]:
    "Only Friend Tech key holders can enter this outpost",
  [BuyableTicketTypes.onlyArenaTicketHolders]:
    "Only Arena ticket holders can enter this outpost",
};

const speakTooltipExplanation = {
  [FreeOutpostSpeakerTypes.everyone]: "Everyone can speak in this outpost",
  [FreeOutpostSpeakerTypes.invited_users]:
    "Only invited users can speak in this outpost",
  [BuyableTicketTypes.onlyPodiumPassHolders]:
    "Only Podium Pass holders can speak in this outpost",
};

export const AccessAndSpeakIndicators = ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 text-sm">
      {/* Access Type */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] cursor-help">
            {outpost.enter_type === FreeOutpostAccessTypes.public ? (
              <Unlock className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-orange-500" />
            )}
            <span className="capitalize">
              {
                allowedToEnterOptions.find(
                  (item) => item.value == outpost.enter_type
                )?.text
              }
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
              {
                allowedToSpeakOptions.find(
                  (item) => item.value == outpost.speak_type
                )?.text
              }
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
