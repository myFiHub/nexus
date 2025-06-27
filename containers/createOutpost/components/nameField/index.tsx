"use client";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../../components/Input";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";

export const NameField = () => {
  const dispatch = useDispatch();

  const name = useSelector(createOutpostSelectors.name);
  const handleChange = (value: string) => {
    dispatch(createOutpostActions.setName(value));
  };
  const error = useSelector(createOutpostSelectors.fieldError("name"));

  return (
    <div className="w-full   relative">
      <Input
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        placeholder=""
        className={`${error ? "border-red-500" : ""}`}
      />

      {/* Custom Placeholder */}
      {!name && (
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none">
          <span className="text-gray-400 text-sm">
            Outpost Name <span className="text-red-400">(required)</span>
          </span>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm absolute bottom-0 right-0">
          {error}
        </p>
      )}
    </div>
  );
};
