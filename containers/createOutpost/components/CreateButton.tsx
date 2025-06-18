"use client";
import { Button } from "../../../components/Button";

const CreateButton = () => {
  return (
    <div className="flex justify-center mt-8">
      <Button className="rounded-xl px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary-hover transition-colors">
        Create New Outpost
      </Button>
    </div>
  );
};

export default CreateButton;
