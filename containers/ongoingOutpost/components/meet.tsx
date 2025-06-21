import { JitsiMeeting } from "@jitsi/react-sdk";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";

export const Meet = () => {
  const router = useRouter();
  const [showIframe, setShowIframe] = useState(true);

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
    apiObj.addListener("videoConferenceJoined", () => {
      console.log("Conference joined!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    });

    apiObj.addListener("videoConferenceLeft", () => {
      console.log("Conference left!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      setShowIframe(false);
      router.replace(`/outpost_details/${outpost.uuid}`);
    });
    // Listen to audio mute status changes
    apiObj.addListener("audioMuteStatusChanged", (isMuted: boolean) => {
      console.log("Audio mute status changed:", isMuted);
    });

    apiObj.addListener("videoMuteStatusChanged", (isMuted: boolean) => {
      console.log("Video mute status changed:", isMuted);
    });

    apiObj.addListener("participantLeft", (id: string) => {
      console.log("Participant left:", id);
    });

    apiObj.addListener("participantJoined", (id: string) => {
      console.log("Participant joined:", id);
    });
  };

  const showIframeClassName = showIframe ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`w-full h-[600px] relative bg-primary rounded-xl overflow-hidden ${showIframeClassName}`}
    >
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
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          TOOLBAR_BUTTONS: [
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "mute-everyone",
            "security",
          ],
        }}
        getIFrameRef={(parentNode: HTMLDivElement) => {
          const iframeRef = parentNode.querySelector(
            "iframe"
          ) as HTMLIFrameElement;
          if (iframeRef) {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.style.position = "absolute";
            iframeRef.style.top = "0";
            iframeRef.style.left = "0";
            // append stylesheet to iframe
            const appendStyleSheet = () => {
              try {
                const iframeDocument =
                  iframeRef.contentDocument ||
                  iframeRef.contentWindow?.document;
                if (iframeDocument) {
                  const style = iframeDocument.createElement("style");
                  style.textContent = `
                    .watermark.leftwatermark  {
                      display: none !important;
                      visibility: hidden !important;
                      opacity: 0 !important;
                    }
                  `;
                  iframeDocument.head.appendChild(style);
                }
              } catch (error) {
                console.log("Could not append stylesheet to iframe:", error);
              }
            };
            appendStyleSheet();
          }
        }}
        onApiReady={handleApiReady}
      />
    </div>
  );
};
