"use client";
import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  if (!myUser) {
    return <div className="h-8 w-full" />;
  }
  return (
    <div className="flex gap-2 mt-auto">
      <Button
        size="sm"
        colorScheme="primary"
        className="flex-1 text-xs"
        onClick={() => {
          // TODO: Implement join functionality
          console.log("Join outpost:", outpost.uuid);
        }}
      >
        Join
      </Button>

      <Button
        size="sm"
        variant="outline"
        colorScheme="warning"
        className="text-xs"
        onClick={() => {
          // TODO: Implement archive functionality
          console.log("Archive outpost:", outpost.uuid);
        }}
      >
        Archive
      </Button>

      <Button
        size="sm"
        variant="outline"
        colorScheme="danger"
        className="text-xs"
        onClick={() => {
          // TODO: Implement leave functionality
          console.log("Leave outpost:", outpost.uuid);
        }}
      >
        Leave
      </Button>
    </div>
  );
};

export const OutpostCardActions = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
