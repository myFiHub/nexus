"use client";
import { Button } from "app/components/Button";
import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { onGoingOutpostSelectors } from "app/containers/ongoingOutpost/selectors";
import { wsClient } from "app/services/wsClient/client";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export const MuteUnmuteButton = () => {
  const amIMuted = useSelector(onGoingOutpostSelectors.amIMuted);
  const joined = useSelector(onGoingOutpostSelectors.joined);
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const accesses = useSelector(onGoingOutpostSelectors.accesses);
  const members = useSelector(onGoingOutpostSelectors.members);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const myUserId = myUser?.uuid;
  const inListOfMember = Object.values(members).some(
    (member) => member.uuid === myUserId
  );

  const [loading, setLoading] = useState(false);

  const handleMuteUnmute = async () => {
    if (joined && apiObj && accesses?.canSpeak) {
      setLoading(true);
      const healtchCheckResult = await wsClient.healthCheck();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      if (!healtchCheckResult) {
        return;
      }
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
      disabled={!inListOfMember}
      variant={amIMuted ? "destructive" : "primary"}
      className={`w-full h-full px-4 py-3 rounded-none font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg border-0 shadow-none min-w-[108px] bg-green-500 hover:bg-green-600 text-white ${
        amIMuted ? "" : " animate-pulse"
      }`}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : amIMuted ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};
