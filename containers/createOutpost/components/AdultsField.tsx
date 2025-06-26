"use client";
import { Switch } from "../../../components/Switch";
import { useDispatch, useSelector } from "react-redux";
import { createOutpostActions } from "../slice";
import { createOutpostSelectors } from "../selectors";

export const AdultsField = () => {
  const dispatch = useDispatch();
  const adults = useSelector(createOutpostSelectors.adults);
  const handleChange = (value: boolean) => {
    dispatch(createOutpostActions.setAdults(value));
  };
  return (
    <div className="flex items-center justify-between w-full max-w-[400px]">
      <div className="font-medium text-base">Adults speaking</div>
      <Switch checked={adults} onCheckedChange={handleChange} />
    </div>
  );
};
