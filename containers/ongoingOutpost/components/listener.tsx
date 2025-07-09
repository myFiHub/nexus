import { GlobalSelectors } from "app/containers/global/selectors";
import { isDev } from "app/lib/utils";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";
import { onGoingOutpostActions } from "../slice";

export const MeetEventListeners = () => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const joined = useSelector(onGoingOutpostSelectors.joined);
  const firstTimeUnmuted = useRef(true);

  const remainingTimeInSeconds = useSelector(
    onGoingOutpostSelectors.remainingTimeInSeconds(myUser?.address)
  );
  const remainingTimeRef = useRef(remainingTimeInSeconds);

  const recordingStatusChanged = (event: {
    on: boolean; // new recording status - boolean,
    mode: string; // recording mode, `local`, `stream` or `file`,
    error: string | undefined; // error type if recording fails, undefined otherwise
    transcription: boolean; // whether a transcription is active or not
  }) => {
    console.log("Recording status changed:", event);
    dispatch(onGoingOutpostActions.statrtStopRecording(event.on));
  };

  const handleVideoConferenceJoined = () => {
    if (isDev) {
      console.log("Conference joined!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
    handleJoined(true);
  };

  const handleVideoConferenceLeft = () => {
    if (isDev) {
      console.log("Conference left!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
    handleJoined(false);
    if (outpost) {
      dispatch(onGoingOutpostActions.leaveOutpost(outpost));
    }
  };

  const handleAudioMuteStatusChanged = ({
    muted: isMuted,
  }: {
    muted: boolean;
  }) => {
    console.log("Audio mute status changed:", isMuted);
    if (firstTimeUnmuted.current) {
      firstTimeUnmuted.current = false;
      return;
    } else {
      if (!isMuted) {
        if (remainingTimeRef.current && remainingTimeRef.current <= 0) {
          apiObj.executeCommand("toggleAudio");
          return;
        }
      }

      dispatch(onGoingOutpostActions.setAmIMuted(isMuted));
      if (isMuted && joined) {
        dispatch(onGoingOutpostActions.stopSpeaking());
      } else if (!isMuted && joined) {
        dispatch(onGoingOutpostActions.startSpeaking());
      }
    }
  };

  const handleParticipantLeft = (id: string) => {
    if (isDev) {
      console.log("Participant left:", id);
    }
    dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
  };

  const handleParticipantJoined = (id: string) => {
    if (isDev) {
      console.log("Participant joined:", id);
    }
    dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
  };

  const handleRaisedHand = (event: {
    id: string; // participantId of the user who raises/lowers the hand
    handRaised: number; // 0 when hand is lowered and the hand raised timestamp when raised.
  }) => {
    if (isDev) {
      console.log("Raised hand:", event);
    }
  };

  useEffect(() => {
    if (remainingTimeInSeconds) {
      remainingTimeRef.current = remainingTimeInSeconds;
    }
  }, [remainingTimeInSeconds]);

  const handleJoined = (joined: boolean) => {
    dispatch(onGoingOutpostActions.setJoined(joined));
  };

  useEffect(() => {
    if (apiObj && outpost) {
      // Define event handler functions

      // Add event listeners
      apiObj.addListener("videoConferenceJoined", handleVideoConferenceJoined);
      apiObj.addListener("videoConferenceLeft", handleVideoConferenceLeft);
      apiObj.addListener(
        "audioMuteStatusChanged",
        handleAudioMuteStatusChanged
      );
      apiObj.addListener("participantLeft", handleParticipantLeft);
      apiObj.addListener("participantJoined", handleParticipantJoined);
      apiObj.addListener("raiseHandUpdated", handleRaisedHand);
      apiObj.addListener("recordingStatusChanged", recordingStatusChanged);

      // Cleanup function to remove listeners
      return () => {
        if (apiObj) {
          apiObj.removeListener(
            "videoConferenceJoined",
            handleVideoConferenceJoined
          );
          apiObj.removeListener(
            "videoConferenceLeft",
            handleVideoConferenceLeft
          );
          apiObj.removeListener(
            "audioMuteStatusChanged",
            handleAudioMuteStatusChanged
          );
          apiObj.removeListener("participantLeft", handleParticipantLeft);
          apiObj.removeListener("participantJoined", handleParticipantJoined);
          apiObj.removeListener("raiseHandUpdated", handleRaisedHand);
          apiObj.removeListener(
            "recordingStatusChanged",
            recordingStatusChanged
          );
        }
      };
    }
  }, [apiObj, outpost, joined, dispatch]);

  return <></>;
};
