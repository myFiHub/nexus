import CreateButton from "./components/CreateButton";
import ImageSelector from "./components/ImageSelector";
import OutpostForm from "./components/OutpostForm";

export const CreateOutpost = () => {
  return (
    <div className="create-outpost-container mt-24">
      <h1>New Outpost</h1>
      <ImageSelector />
      <OutpostForm />
      <CreateButton />
    </div>
  );
};
