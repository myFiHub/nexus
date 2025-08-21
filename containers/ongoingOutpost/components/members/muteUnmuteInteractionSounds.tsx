"use client";

import { Volume2, VolumeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { onGoingOutpostActions } from "../../slice";

export const MuteUnmuteInteractionSounds = () => {
  const dispatch = useDispatch();
  const isInteractionsMuted = useSelector(
    onGoingOutpostSelectors.isInteractionsMuted
  );
  const handleClick = () => {
    dispatch(
      onGoingOutpostActions.setIsInteractionsMuted(!isInteractionsMuted)
    );
  };
  return (
    <div
      className="absolute top-1 right-3 bg-red  cursor-pointer"
      onClick={handleClick}
    >
      {isInteractionsMuted ? (
        <VolumeOff className="w-4 h-4 text-muted-foreground" />
      ) : (
        <Volume2 className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
};
