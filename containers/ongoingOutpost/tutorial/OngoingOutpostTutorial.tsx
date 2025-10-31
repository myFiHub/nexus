"use client";

import { useEffect, useMemo, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";
import { OngoingTutorialIds, ONGOING_TUTORIAL_LS_KEY } from "./constants";
import { useJoyrideTheme } from "../../tutorial/useJoyrideTheme";
import { buildJoyrideStyles } from "../../tutorial/joyrideStyles";

export const OngoingOutpostTutorial = () => {
  const joined = useSelector(onGoingOutpostSelectors.joined);
  const [run, setRun] = useState(false);
  const theme = useJoyrideTheme();

  const steps: Step[] = useMemo(
    () => [
      {
        target: `#${OngoingTutorialIds.remainingTime}`,
        content: "This shows your remaining time in the outpost.",
        disableBeacon: true,
      },
      {
        target: `#${OngoingTutorialIds.muteButton}`,
        content: "Mute or unmute your microphone.",
        disableBeacon: true,
      },
      {
        target: `#${OngoingTutorialIds.membersPanel}`,
        content: "This is the members list. You can drag it around.",
      },
      {
        target: `#${OngoingTutorialIds.reactions}`,
        content:
          "Use cheer/boo/like/dislike actions on members to interact during the outpost.",
      },
      {
        target: `#${OngoingTutorialIds.leaveButton}`,
        content: "Leave the outpost when you’re done.",
      },
    ],
    []
  );

  useEffect(() => {
    if (!joined) return;
    const container = document.getElementById(
      OngoingTutorialIds.jitsiContainer
    );
    if (!container) return;
    let timeout: any;
    const checkOpacityAndStart = () => {
      const style = window.getComputedStyle(container);
      if (style.opacity === "1") {
        timeout = setTimeout(() => {
          const hasShown =
            window.localStorage.getItem(ONGOING_TUTORIAL_LS_KEY) === "1";
          if (!hasShown) setRun(true);
        }, 3000);
        return true;
      }
      return false;
    };

    if (!checkOpacityAndStart()) {
      const observer = new MutationObserver(() => {
        if (checkOpacityAndStart()) observer.disconnect();
      });
      observer.observe(container, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    }

    return () => clearTimeout(timeout);
  }, [joined]);

  const onCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished =
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      status === STATUS.PAUSED;
    if (finished) {
      try {
        window.localStorage.setItem(ONGOING_TUTORIAL_LS_KEY, "1");
      } catch {}
      setRun(false);
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={onCallback}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      styles={buildJoyrideStyles(theme)}
    />
  );
};
