import { Button } from "app/components/Button";

export const ConfirmButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outline" onClick={onClick}>
      Confirm
    </Button>
  );
};
