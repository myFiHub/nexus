"use client";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../components/Input";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const NameField = () => {
  const dispatch = useDispatch();

  const name = useSelector(createOutpostSelectors.name);
  const handleChange = (value: string) => {
    dispatch(createOutpostActions.setName(value));
  };

  return (
    <div className="w-full max-w-[400px]">
      <Input
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Outpost Name (required)"
      />
    </div>
  );
};
