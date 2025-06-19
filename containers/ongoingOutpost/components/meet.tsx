import { JitsiMeeting } from "@jitsi/react-sdk";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";

export const Meet = () => {
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const apiRef = useRef<any>(null);

  if (!outpost || !myUser) {
    console.log("No outpost data available");
    return null;
  }

  if (!process.env.NEXT_PUBLIC_OUTPOST_SERVER) {
    console.error("NEXT_PUBLIC_OUTPOST_SERVER is not defined");
    return (
      <div className="text-red-500">
        outpost server configuration is missing
      </div>
    );
  }

  const handleApiReady = (apiObj: any) => {
    console.log("Outpost API is ready");
    apiRef.current = apiObj;

    // Listen to audio mute status changes
    apiObj.addListener("audioMuteStatusChanged", (isMuted: boolean) => {
      console.log("Audio mute status changed:", isMuted);
    });

    // Listen to participant joined/left events
    apiObj.addListener("participantJoined", () => {
      console.log("Participant joined");
    });

    apiObj.addListener("participantLeft", () => {
      console.log("Participant left");
    });
  };

  return (
    <div className="w-full h-[600px] relative bg-primary">
      <JitsiMeeting
        domain={process.env.NEXT_PUBLIC_OUTPOST_SERVER}
        roomName={outpost.uuid}
        // roomDisplayName={outpost.name}
        userInfo={{
          displayName: myUser.name ?? "",
          email: myUser.email ?? "",
        }}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          enableWelcomePage: false,
          subject: outpost.name,
          localSubject: outpost.name,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        getIFrameRef={(iframeRef) => {
          if (iframeRef) {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.style.position = "absolute";
            iframeRef.style.top = "0";
            iframeRef.style.left = "0";
          }
        }}
        onApiReady={handleApiReady}
      />
    </div>
  );
};
