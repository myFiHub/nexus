"use client";
import { useDispatch, useSelector } from "react-redux";
import { TagsInput } from "./TagsInput";
import { createOutpostActions } from "../slice";
import { createOutpostSelectors } from "../selectors";

export const TagsField = () => {
  const dispatch = useDispatch();
  const tags = useSelector(createOutpostSelectors.tags);
  const handleChange = (value: string[]) => {
    dispatch(createOutpostActions.setTags(value));
  };
  return (
    <div className="w-full max-w-[400px]">
      <TagsInput
        value={tags || []}
        onChange={handleChange}
        placeholder="Enter a tag (optional)..."
      />
    </div>
  );
};
