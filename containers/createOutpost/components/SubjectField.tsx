"use client";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../components/Input";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

export const SubjectField = () => {
  const dispatch = useDispatch();
  const subject = useSelector(createOutpostSelectors.subject);
  const handleChange = (value: string) => {
    dispatch(createOutpostActions.setSubject(value));
  };
  const error = useSelector(createOutpostSelectors.fieldError("subject"));
  return (
    <div className="w-full   relative">
      <Input
        value={subject || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Main Subject"
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
