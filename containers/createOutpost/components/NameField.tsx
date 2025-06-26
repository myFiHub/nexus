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
  const error = useSelector(createOutpostSelectors.fieldError("name"));

  return (
    <div className="w-full max-w-[400px] relative ">
      <Input
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Outpost Name (required)"
        className={`${error ? "border-red-500" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-sm absolute bottom-0 right-0">
          {error}
        </p>
      )}
    </div>
  );
};
