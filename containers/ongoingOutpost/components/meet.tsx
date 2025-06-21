import { JitsiMeeting } from "@jitsi/react-sdk";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";

export const Meet = () => {
  const router = useRouter();
  const [showIframe, setShowIframe] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

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
      setIsAudioMuted(isMuted);
    });

    apiObj.addListener("videoMuteStatusChanged", (isMuted: boolean) => {
      console.log("Video mute status changed:", isMuted);
      setIsVideoMuted(isMuted);
    });

    apiObj.addListener("participantLeft", (id: string) => {
      console.log("Participant left:", id);
    });

    apiObj.addListener("participantJoined", (id: string) => {
      console.log("Participant joined:", id);
    });
  };

  // Function to mute/unmute audio
  const toggleAudioMute = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleAudio");
    }
  };

  // Function to mute/unmute video
  const toggleVideoMute = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleVideo");
    }
  };

  // Function to mute audio programmatically
  const muteAudio = () => {
    if (apiRef.current && !isAudioMuted) {
      apiRef.current.executeCommand("toggleAudio");
    }
  };

  const hangup = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hangup");
    }
  };

  const startRecording = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("startRecording", {
        mode: "local", //recording mode, either `local`, `file` or `stream`.
        dropboxToken: "", //dropbox oauth2 token.
        onlySelf: true, //Whether to only record the local streams. Only applies to `local` recording mode.
        shouldShare: true, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
        rtmpStreamKey: "", //the RTMP stream key.
        rtmpBroadcastID: "", //the RTMP broadcast ID.
        youtubeStreamKey: "", //the youtube stream key.
        youtubeBroadcastID: "", //the youtube broacast ID.
        extraMetada: {}, // any extra metada for file recording.
        transcription: false, // Whether a transcription should be started.
      });
    }
  };

  const stopRecording = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("stopRecording", {
        mode: "local", //recording mode to stop, `local`, `stream` or `file`
        transcription: false, // whether the transcription should be stopped
      });
    }
  };

  // Additional Jitsi API commands
  const setDisplayName = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("displayName", "New Name");
    }
  };

  const setPassword = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("password", "roomPassword");
    }
  };

  const toggleLobby = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleLobby", true);
    }
  };

  const sendTones = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("sendTones", {
        tones: "12345#",
        duration: 200,
        pause: 200,
      });
    }
  };

  const startShareVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "startShareVideo",
        "https://example.com/video.mp4"
      );
    }
  };

  const stopShareVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("stopShareVideo");
    }
  };

  const setSubject = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("subject", "New Conference Subject");
    }
  };

  const setLocalSubject = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("localSubject", "New Local Subject");
    }
  };

  const toggleFilmStrip = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleFilmStrip");
    }
  };

  const toggleChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleChat");
    }
  };

  const toggleRaiseHand = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleRaiseHand");
    }
  };

  const toggleShareScreen = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleShareScreen");
    }
  };

  const setNoiseSuppression = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setNoiseSuppressionEnabled", {
        enabled: true,
      });
    }
  };

  const toggleSubtitles = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleSubtitles");
    }
  };

  const toggleTileView = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleTileView");
    }
  };

  const endConference = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("endConference");
    }
  };

  const setEmail = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("email", "user@example.com");
    }
  };

  const sendCameraFacingMode = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "sendCameraFacingMode",
        "participantId",
        "user"
      );
    }
  };

  const sendEndpointTextMessage = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "sendEndpointTextMessage",
        "participantId",
        "Hello!"
      );
    }
  };

  const setLargeVideoParticipant = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "setLargeVideoParticipant",
        "participantId",
        "camera"
      );
    }
  };

  const setVideoQuality = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setVideoQuality", 720);
    }
  };

  const muteEveryone = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("muteEveryone", "audio");
    }
  };

  const initiatePrivateChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("initiatePrivateChat", "participantId");
    }
  };

  const cancelPrivateChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("cancelPrivateChat", "participantId");
    }
  };

  const kickParticipant = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("kickParticipant", "participantId");
    }
  };

  const grantModerator = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("grantModerator", "participantId");
    }
  };

  const overwriteConfig = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("overwriteConfig", { someConfig: "value" });
    }
  };

  const sendChatMessage = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("sendChatMessage", "Hello everyone!");
    }
  };

  const setFollowMe = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setFollowMe", true);
    }
  };

  const setSubtitles = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setSubtitles", {
        enabled: true,
        displaySubtitles: true,
        language: "en",
      });
    }
  };

  const setTileView = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setTileView", true);
    }
  };

  const answerKnockingParticipant = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "answerKnockingParticipant",
        "participantId",
        true
      );
    }
  };

  const toggleCamera = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleCamera", "user");
    }
  };

  const toggleCameraMirror = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleCameraMirror");
    }
  };

  const toggleVirtualBackgroundDialog = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleVirtualBackgroundDialog");
    }
  };

  const pinParticipant = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("pinParticipant", "participantId");
    }
  };

  const setParticipantVolume = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "setParticipantVolume",
        "participantId",
        0.5
      );
    }
  };

  const toggleParticipantsPane = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleParticipantsPane", true);
    }
  };

  const toggleModeration = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleModeration", true, "audio");
    }
  };

  const askToUnmute = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("askToUnmute", "participantId");
    }
  };

  const approveVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("approveVideo", "participantId");
    }
  };

  const rejectParticipant = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "rejectParticipant",
        "participantId",
        "audio"
      );
    }
  };

  const addBreakoutRoom = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("addBreakoutRoom", "New Breakout Room");
    }
  };

  const autoAssignToBreakoutRooms = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("autoAssignToBreakoutRooms");
    }
  };

  const closeBreakoutRoom = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("closeBreakoutRoom", "roomId");
    }
  };

  const joinBreakoutRoom = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("joinBreakoutRoom", "roomId");
    }
  };

  const removeBreakoutRoom = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("removeBreakoutRoom", "breakoutRoomJid");
    }
  };

  const resizeFilmStrip = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("resizeFilmStrip", { width: 300 });
    }
  };

  const resizeLargeVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("resizeLargeVideo", 800, 600);
    }
  };

  const sendParticipantToRoom = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "sendParticipantToRoom",
        "participantId",
        "roomId"
      );
    }
  };

  const overwriteNames = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("overwriteNames", [
        {
          id: "participantId",
          name: "New Name",
        },
      ]);
    }
  };

  const showNotification = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("showNotification", {
        title: "Custom Notification",
        description: "This is a custom notification",
        type: "normal",
        timeout: "short",
      });
    }
  };

  const hideNotification = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hideNotification", "notificationUid");
    }
  };

  const toggleWhiteboard = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleWhiteboard");
    }
  };

  const setAssumedBandwidthBps = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setAssumedBandwidthBps", 1000000);
    }
  };

  const setBlurredBackground = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setBlurredBackground", "blur");
    }
  };

  const setAudioOnly = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("setAudioOnly", true);
    }
  };

  const setVirtualBackground = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand(
        "setVirtualBackground",
        true,
        "data:image/png;base64,iVBOR..."
      );
    }
  };

  const showIframeClassName = showIframe ? "opacity-100" : "opacity-0";

  return (
    <div className="space-y-4">
      {/* Control Buttons */}
      <div className="space-y-4">
        {/* Basic Controls */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Basic Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAudioMute}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isAudioMuted
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            </button>
            <button
              onClick={toggleVideoMute}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isVideoMuted
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isVideoMuted ? "Unmute Video" : "Mute Video"}
            </button>
            <button
              onClick={hangup}
              className="px-3 py-1 rounded text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
            >
              Hangup
            </button>
            <button
              onClick={endConference}
              className="px-3 py-1 rounded text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
            >
              End Conference
            </button>
          </div>
        </div>

        {/* UI Controls */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">UI Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleFilmStrip}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Filmstrip
            </button>
            <button
              onClick={toggleChat}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Chat
            </button>
            <button
              onClick={toggleTileView}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Tile View
            </button>
            <button
              onClick={toggleParticipantsPane}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Participants
            </button>
            <button
              onClick={toggleRaiseHand}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Raise Hand
            </button>
            <button
              onClick={toggleShareScreen}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Share Screen
            </button>
            <button
              onClick={toggleSubtitles}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Subtitles
            </button>
            <button
              onClick={toggleWhiteboard}
              className="px-3 py-1 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle Whiteboard
            </button>
          </div>
        </div>

        {/* Recording & Streaming */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Recording & Streaming</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={startRecording}
              className="px-3 py-1 rounded text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white"
            >
              Start Recording
            </button>
            <button
              onClick={stopRecording}
              className="px-3 py-1 rounded text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white"
            >
              Stop Recording
            </button>
            <button
              onClick={startShareVideo}
              className="px-3 py-1 rounded text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white"
            >
              Share Video
            </button>
            <button
              onClick={stopShareVideo}
              className="px-3 py-1 rounded text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white"
            >
              Stop Share Video
            </button>
          </div>
        </div>

        {/* Camera & Video */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Camera & Video</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleCamera}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Toggle Camera
            </button>
            <button
              onClick={toggleCameraMirror}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Toggle Mirror
            </button>
            <button
              onClick={setVideoQuality}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Set Video Quality
            </button>
            <button
              onClick={setLargeVideoParticipant}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Set Large Video
            </button>
            <button
              onClick={toggleVirtualBackgroundDialog}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Virtual Background
            </button>
            <button
              onClick={setBlurredBackground}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Blur Background
            </button>
            <button
              onClick={setVirtualBackground}
              className="px-3 py-1 rounded text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Set Virtual BG
            </button>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Audio Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={setNoiseSuppression}
              className="px-3 py-1 rounded text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white"
            >
              Noise Suppression
            </button>
            <button
              onClick={muteEveryone}
              className="px-3 py-1 rounded text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white"
            >
              Mute Everyone
            </button>
            <button
              onClick={setAudioOnly}
              className="px-3 py-1 rounded text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white"
            >
              Audio Only Mode
            </button>
            <button
              onClick={setParticipantVolume}
              className="px-3 py-1 rounded text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white"
            >
              Set Volume
            </button>
          </div>
        </div>

        {/* Moderator Controls */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Moderator Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleLobby}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Toggle Lobby
            </button>
            <button
              onClick={toggleModeration}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Toggle Moderation
            </button>
            <button
              onClick={kickParticipant}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Kick Participant
            </button>
            <button
              onClick={grantModerator}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Grant Moderator
            </button>
            <button
              onClick={askToUnmute}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Ask to Unmute
            </button>
            <button
              onClick={approveVideo}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Approve Video
            </button>
            <button
              onClick={rejectParticipant}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Reject Participant
            </button>
            <button
              onClick={answerKnockingParticipant}
              className="px-3 py-1 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white"
            >
              Answer Knocking
            </button>
          </div>
        </div>

        {/* Breakout Rooms */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Breakout Rooms</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addBreakoutRoom}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Add Breakout Room
            </button>
            <button
              onClick={autoAssignToBreakoutRooms}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Auto Assign
            </button>
            <button
              onClick={joinBreakoutRoom}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Join Breakout
            </button>
            <button
              onClick={closeBreakoutRoom}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Close Breakout
            </button>
            <button
              onClick={removeBreakoutRoom}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Remove Breakout
            </button>
            <button
              onClick={sendParticipantToRoom}
              className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Send to Room
            </button>
          </div>
        </div>

        {/* Communication */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Communication</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendChatMessage}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
            >
              Send Chat
            </button>
            <button
              onClick={initiatePrivateChat}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
            >
              Private Chat
            </button>
            <button
              onClick={cancelPrivateChat}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
            >
              Cancel Private Chat
            </button>
            <button
              onClick={sendEndpointTextMessage}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
            >
              Send Text Message
            </button>
            <button
              onClick={sendTones}
              className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
            >
              Send Tones
            </button>
          </div>
        </div>

        {/* Settings & Configuration */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Settings & Configuration</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={setDisplayName}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Display Name
            </button>
            <button
              onClick={setEmail}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Email
            </button>
            <button
              onClick={setPassword}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Password
            </button>
            <button
              onClick={setSubject}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Subject
            </button>
            <button
              onClick={setLocalSubject}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Local Subject
            </button>
            <button
              onClick={setSubtitles}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Subtitles
            </button>
            <button
              onClick={setTileView}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Tile View
            </button>
            <button
              onClick={setFollowMe}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Follow Me
            </button>
            <button
              onClick={overwriteConfig}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Overwrite Config
            </button>
            <button
              onClick={overwriteNames}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Overwrite Names
            </button>
            <button
              onClick={setAssumedBandwidthBps}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
            >
              Set Bandwidth
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={showNotification}
              className="px-3 py-1 rounded text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white"
            >
              Show Notification
            </button>
            <button
              onClick={hideNotification}
              className="px-3 py-1 rounded text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white"
            >
              Hide Notification
            </button>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Advanced Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={pinParticipant}
              className="px-3 py-1 rounded text-sm font-medium bg-red-400 hover:bg-red-500 text-white"
            >
              Pin Participant
            </button>
            <button
              onClick={sendCameraFacingMode}
              className="px-3 py-1 rounded text-sm font-medium bg-red-400 hover:bg-red-500 text-white"
            >
              Send Camera Mode
            </button>
            <button
              onClick={resizeFilmStrip}
              className="px-3 py-1 rounded text-sm font-medium bg-red-400 hover:bg-red-500 text-white"
            >
              Resize Filmstrip
            </button>
            <button
              onClick={resizeLargeVideo}
              className="px-3 py-1 rounded text-sm font-medium bg-red-400 hover:bg-red-500 text-white"
            >
              Resize Large Video
            </button>
          </div>
        </div>
      </div>

      {/* Jitsi Meeting */}
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
            startWithVideoMuted: true,
            startScreenSharing: true,
            enableEmailInStats: false,
            enableWelcomePage: false,
            subject: outpost.name,
            localSubject: outpost.name,
            autoJoin: true,
            disableModeratorIndicator: true,
            lobby: {
              enabled: false,
            },
            prejoinPageEnabled: false,
            skipPrejoinPage: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            TOOLBAR_BUTTONS: [
              "camera",
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
            }
          }}
          onApiReady={handleApiReady}
        />
      </div>
    </div>
  );
};
