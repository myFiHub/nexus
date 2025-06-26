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
  return (
    <div className="w-full max-w-[400px]">
      <Input
        value={subject || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Main Subject (optional)"
      />
    </div>
  );
};
