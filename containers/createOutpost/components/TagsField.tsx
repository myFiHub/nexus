"use client";
import { useDispatch, useSelector } from "react-redux";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";
import { TagsInput } from "./TagsInput";

export const TagsField = () => {
  const dispatch = useDispatch();
  const tags = useSelector(createOutpostSelectors.tags);
  const handleChange = (value: string[]) => {
    dispatch(createOutpostActions.setTags(value));
  };
  const error = useSelector(createOutpostSelectors.fieldError("tags"));
  return (
    <div className="w-full   relative min-h-[54px]">
      <style />
      <TagsInput
        value={tags || []}
        onChange={handleChange}
        placeholder="Enter a tag..."
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
