"use client";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../components/Switch";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const MusicModeField = () => {
  const dispatch = useDispatch();
  const musicMode = useSelector(createOutpostSelectors.musicMode);
  const handleChange = (value: boolean) => {
    dispatch(createOutpostActions.setMusicMode(value));
  };
  return (
    <div className="flex items-center justify-between w-full ">
      <div className="cursor-pointer" onClick={() => handleChange(!musicMode)}>
        <div className="font-medium text-base">Music mode</div>
        <div className="text-text-muted text-xs">
          Stereo, high-bitrate audio without voice filters
        </div>
      </div>
      <Switch checked={musicMode} onCheckedChange={handleChange} />
    </div>
  );
};
