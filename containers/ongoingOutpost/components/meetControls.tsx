interface MeetControlsProps {
  apiRef: React.MutableRefObject<any>;
  isAudioMuted: boolean;
  isRecordable: boolean;
  onToggleAudio: () => void;
  onHangup: () => void;
}

export const MeetControls = ({
  apiRef,
  isAudioMuted,
  isRecordable,
  onToggleAudio,
  onHangup,
}: MeetControlsProps) => {
  // Function to mute/unmute audio
  const toggleAudioMute = () => {
    if (apiRef.current) {
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

  const toggleChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleChat");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-gray-200/50 px-6 py-3">
        <div className="flex items-center space-x-4">
          {/* Audio Control */}
          <button
            onClick={toggleAudioMute}
            className={`p-3 rounded-full transition-all duration-200 ${
              isAudioMuted
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                : "bg-green-500 hover:bg-green-600 text-white shadow-lg"
            }`}
            title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isAudioMuted ? (
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>

          {/* Chat Control */}
          <button
            onClick={toggleChat}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-lg"
            title="Toggle Chat"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Raise Hand Control */}
          <button
            onClick={toggleRaiseHand}
            className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 shadow-lg"
            title="Raise Hand"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Share Screen Control */}
          <button
            onClick={toggleShareScreen}
            className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 shadow-lg"
            title="Share Screen"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Recording Control (only for creators) */}
          {isRecordable && (
            <button
              onClick={startRecording}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg"
              title="Start Recording"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {/* Hangup Control */}
          <button
            onClick={hangup}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-lg"
            title="Leave Meeting"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
