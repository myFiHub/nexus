import { JitsiMeeting } from "@jitsi/react-sdk";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useIsMobile } from "app/hooks/use-mobile";
import { isDev, truncate } from "app/lib/utils";
import { transformIdToEmailLike } from "app/lib/uuidToEmail";
import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoUrl } from "../../../lib/constants";
import { LeaveOutpostWarningDialogProvider } from "../dialogs/leaveOutpostWarning";
import { onGoingOutpostSelectors } from "../selectors";
import { onGoingOutpostActions } from "../slice";
import { RejoinAttempt } from "../utils/rejoinAttempt";
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
    const isMobile = useIsMobile();
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

    let hostUrl =
      outpost.outpost_host_url ?? process.env.NEXT_PUBLIC_OUTPOST_SERVER!;
    if (hostUrl.includes("http://") || hostUrl.includes("https://")) {
      hostUrl = hostUrl.split("://")[1];
    }
    if (isDev) {
      hostUrl = "meet.avaxcoolyeti.com";
    }

    return (
      <div className="space-y-4 relative">
        <LeaveOutpostWarningDialogProvider />
        {!joined && <JoiningStatus />}
        <div
          className={`w-full h-[600px] relative rounded-xl overflow-hidden ${showIframeClassName}`}
        >
          <RejoinAttempt />
          <MeetEventListeners />
          <OngoingOutpostMembers />

          <JitsiMeeting
            domain={hostUrl}
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
              enableEmailInStats: false,
              welcomePage: {
                // Whether to disable welcome page. In case it's disabled a random room
                // will be joined when no room is specified.
                disabled: true,
              },
              disabledSounds: [
                "PARTICIPANT_JOINED_SOUND",
                "PARTICIPANT_LEFT_SOUND",
              ],
              securityUi: {
                // Hides the lobby button. Replaces `hideLobbyButton`.
                hideLobbyButton: true,
                // Hides the possibility to set and enter a lobby password.
                disableLobbyPassword: true,
              },
              prejoinConfig: {
                // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
                // This replaces `prejoinPageEnabled`. Defaults to true.
                enabled: false,
                // Hides the participant name editing field in the prejoin screen.
                // If requireDisplayName is also set as true, a name should still be provided through
                // either the jwt or the userInfo from the iframe api init object in order for this to have an effect.
                // hideDisplayName: false,
                // List of buttons to hide from the extra join options dropdown.
                // hideExtraJoinButtons: ['no-audio', 'by-phone'],
                // Configuration for pre-call test
                // By setting preCallTestEnabled, you enable the pre-call test in the prejoin page.
                // ICE server credentials need to be provided over the preCallTestICEUrl
                // preCallTestEnabled: false,
                // preCallTestICEUrl: ''
              },
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
              ...(isMobile && {
                deeplinking: {
                  disabled: true,
                },
              }),
              toolbarButtons: [
                // ...(accesses?.canSpeak ? ["microphone"] : []),
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
