"use client";
import { Button } from "../../../components/Button";

const CreateButton = () => {
  return (
    <Button
      type="submit"
      className="w-full max-w-[400px] bg-primary text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
    >
      Create
    </Button>
  );
};

export default CreateButton;
