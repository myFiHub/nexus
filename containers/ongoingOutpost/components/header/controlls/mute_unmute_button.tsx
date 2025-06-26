"use client";
import { Button } from "app/components/Button";
import { onGoingOutpostSelectors } from "app/containers/ongoingOutpost/selectors";
import { Mic, MicOff } from "lucide-react";
import { useSelector } from "react-redux";

export const MuteUnmuteButton = () => {
  const amIMuted = useSelector(onGoingOutpostSelectors.amIMuted);
  const joined = useSelector(onGoingOutpostSelectors.joined);
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const accesses = useSelector(onGoingOutpostSelectors.accesses);

  const handleMuteUnmute = () => {
    if (joined && apiObj && accesses?.canSpeak) {
      apiObj.executeCommand("toggleAudio");
    }
  };

  if (!accesses?.canSpeak) {
    return null;
  }
  if (!joined) {
    return null;
  }

  return (
    <Button
      onClick={handleMuteUnmute}
      colorScheme={amIMuted ? "danger" : "primary"}
      className={`w-full h-full px-4 py-3 rounded-none font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg border-0 shadow-none min-w-[108px] ${
        amIMuted
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-green-500 hover:bg-green-600 text-white animate-pulse"
      }`}
    >
      {amIMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      <span className="hidden sm:inline">{amIMuted ? "Unmute" : "Mute"}</span>
    </Button>
  );
};
