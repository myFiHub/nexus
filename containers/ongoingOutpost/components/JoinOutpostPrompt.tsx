"use client";
import { Button } from "app/components/Button";
import { LoginButton } from "app/components/header/LoginButton";
import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useOnGoingOutpostSlice } from "app/containers/ongoingOutpost/slice";
import { toast } from "app/lib/toast";
import { getTimerInfo } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { ConnectionState } from "app/services/wsClient";
import { ReduxProvider } from "app/store/Provider";
import { Lock, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface JoinOutpostPromptProps {
  outpost: OutpostModel;
}

const JoinOutpostPromptContent = ({ outpost }: JoinOutpostPromptProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useOnGoingOutpostSlice();
  useSelector(GlobalSelectors.tick);
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const joiningId = useSelector(GlobalSelectors.joiningOutpostId);
  const wsConnectionStatus = useSelector(GlobalSelectors.wsConnectionStatus);

  const join = () => {
    if (wsConnectionStatus.state !== ConnectionState.CONNECTED) {
      toast.error("Please check your connection and try again");
      return;
    }
    dispatch(globalActions.joinOutpost({ outpost }));
  };

  if (!outpost) return null;

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Client-side only logic
  const joining = joiningId === outpost.uuid;
  const timerInfo = getTimerInfo(outpost.scheduled_for);
  const { displayText, isPassed } = timerInfo;
  const iAmCreator = myUser?.uuid === outpost.creator_user_uuid;

  if (!myUser && !logingIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card border border-border rounded-xl">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Authentication Required
            </h3>
            <p className="text-muted-foreground">
              You need to log in to join this outpost and participate in the
              discussion.
            </p>
          </div>
          <LoginButton className="w-full" />
        </div>
      </div>
    );
  }

  const loading = joining || logingIn;
  const disabled = iAmCreator ? loading : !isPassed || loading;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card border border-border rounded-xl">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-10 h-10 text-primary" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Join {outpost.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {outpost.subject}
          </p>

          {/* Status info */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{outpost.members_count || 0} members</span>
            </div>
            {outpost.online_users_count && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{outpost.online_users_count} online</span>
              </div>
            )}
          </div>

          {/* Timer info */}
          {!isPassed && (
            <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-md">
              This outpost will be available {displayText.toLowerCase()}
            </div>
          )}
        </div>

        {/* Join Button */}
        <div className="w-full">
          <Button
            onClick={join}
            disabled={disabled}
            className="w-full gap-2 h-12 text-base font-semibold"
            variant="primary"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {joining ? "Joining..." : "Loading..."}
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {isPassed ? "Join Outpost" : "Join When Ready"}
              </>
            )}
          </Button>

          {/* Helper text */}
          <p className="text-xs text-muted-foreground mt-2">
            {isPassed
              ? "Click to join the live discussion"
              : "You'll be able to join once the outpost starts"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const JoinOutpostPrompt = ({ outpost }: JoinOutpostPromptProps) => {
  return (
    <ReduxProvider>
      <JoinOutpostPromptContent outpost={outpost} />
    </ReduxProvider>
  );
};
