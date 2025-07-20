import { JitsiMeeting } from "@jitsi/react-sdk";
import { GlobalSelectors } from "app/containers/global/selectors";
import { truncate } from "app/lib/utils";
import { transformIdToEmailLike } from "app/lib/uuidToEmail";
import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoUrl } from "../../../lib/constants";
import { LeaveOutpostWarningDialogProvider } from "../dialogs/leaveOutpostWarning";
import { onGoingOutpostSelectors } from "../selectors";
import { onGoingOutpostActions } from "../slice";
import { AccessDenied } from "./AccessDenied";
import { JoiningStatus } from "./JoiningStatus";
import LeavingAnimation from "./LeavingAnimation";
import { MeetEventListeners } from "./listener";
import { OngoingOutpostMembers } from "./members";

export const Meet = memo(
  () => {
    const dispatch = useDispatch();
    const isLeaving = useSelector(onGoingOutpostSelectors.leaving);
    const joiningOutpostId = useSelector(GlobalSelectors.joiningOutpostId);
    const outpost = useSelector(onGoingOutpostSelectors.outpost);
    const accesses = useSelector(onGoingOutpostSelectors.accesses);
    const leaving = useSelector(onGoingOutpostSelectors.leaving);
    const myUser = useSelector(GlobalSelectors.podiumUserInfo);
    const joined = useSelector(onGoingOutpostSelectors.joined);
    const joinedOnceRef = useRef(false);

    useEffect(() => {
      if (joined) {
        joinedOnceRef.current = true;
      }
    }, [joined]);

    const iAmCreator = outpost?.creator_user_uuid === myUser?.uuid;

    if (!outpost || !myUser) {
      console.log("No outpost data available");
      return null;
    }

    if (isLeaving) {
      return <LeavingAnimation />;
    }

    if (!accesses?.canEnter && !leaving && !joiningOutpostId) {
      return <AccessDenied outpost={outpost} />;
    }

    const handleApiReady = (apiObj: any) => {
      // set apiObj to redux to be read and listened to in Listener component
      dispatch(onGoingOutpostActions.setMeetApiObj(apiObj));
    };

    const showIframeClassName = joined ? "opacity-100" : "opacity-0";

    return (
      <div className="space-y-4 relative">
        <LeaveOutpostWarningDialogProvider />
        {joined && <JoiningStatus />}
        <div
          className={`w-full h-[600px] relative rounded-xl overflow-hidden ${showIframeClassName}`}
        >
          <MeetEventListeners />
          <OngoingOutpostMembers />

          <JitsiMeeting
            domain={process.env.NEXT_PUBLIC_OUTPOST_SERVER}
            roomName={outpost.uuid}
            userInfo={{
              displayName: myUser.name?.includes("@")
                ? truncate(myUser.name, 8)
                : myUser.name ?? truncate(myUser.uuid),
              email: transformIdToEmailLike(myUser.uuid) ?? "",
            }}
            configOverwrite={{
              apiLogLevel: ["error"],
              startWithAudioMuted: true,
              startWithVideoMuted: true,
              startScreenSharing: true,
              enableEmailInStats: false,
              enableWelcomePage: false,
              subject: outpost.name,
              localSubject: outpost.name,
              autoJoin: true,
              disableModeratorIndicator: true,
              defaultLogoUrl: logoUrl,
              filmstrip: {
                disabled: true,
                disableStageFilmstrip: true,
                disableTopPanel: true,
              },
              disableFilmstripAutohiding: true,
              lobby: {
                enabled: false,
              },
              prejoinPageEnabled: false,
              skipPrejoinPage: true,
              toolbarConfig: {
                alwaysVisible: true,
                autoHideWhileChatIsOpen: false,
              },
              toolbarButtons: [
                ...(accesses?.canSpeak ? ["microphone"] : []),
                "closedcaptions",
                "desktop",
                "chat",
                ...(iAmCreator && outpost?.is_recordable ? ["recording"] : []),
                "livestreaming",
                "etherpad",
                "sharedvideo",
                "whiteboard",
                "raisehand",
                "feedback",
              ],
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              SHOW_BRAND_WATERMARK: false,
              SHOW_POWERED_BY: false,
              DEFAULT_WELCOME_PAGE_LOGO_URL: logoUrl,
              BRAND_WATERMARK_LINK: logoUrl,
              HIDE_INVITE_MORE_HEADER: true,
              JITSI_WATERMARK_LINK: logoUrl,
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
              }
            }}
            onApiReady={handleApiReady}
          />
        </div>
      </div>
    );
  },
  () => true
);
