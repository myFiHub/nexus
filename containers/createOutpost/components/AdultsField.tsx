"use client";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "../../../components/Switch";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const AdultsField = () => {
  const dispatch = useDispatch();
  const adults = useSelector(createOutpostSelectors.adults);
  const handleChange = (value: boolean) => {
    dispatch(createOutpostActions.setAdults(value));
  };
  return (
    <div className="flex items-center justify-between w-full  ">
      <div
        className="font-medium text-base cursor-pointer"
        onClick={() => handleChange(!adults)}
      >
        Adults speaking
      </div>
      <Switch checked={adults} onCheckedChange={handleChange} />
    </div>
  );
};
