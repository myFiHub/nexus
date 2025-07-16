"use client";

import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { outpostDetailsSelectors } from "../../selectors";
import { outpostDetailsActions } from "../../slice";

interface EditScheduledDateButtonProps {
  outpost: OutpostModel;
}

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const editingScheduledDate = useSelector(
    outpostDetailsSelectors.editingScheduledDate
  );
  if (!outpost || !myUser) return null;
  const iAmCreator = myUser.uuid === outpost.creator_user_uuid;
  if (!iAmCreator) return null;
  const handleEdit = async () => {
    dispatch(
      outpostDetailsActions.editScheduledDate({
        outpost,
      })
    );
  };
  return (
    <button
      onClick={handleEdit}
      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
      title="Edit scheduled date"
    >
      {editingScheduledDate ? (
        <Loader className="w-4 h-4 text-muted-foreground animate-spin" />
      ) : (
        <Edit className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

export function EditScheduledDateButton({
  outpost,
}: EditScheduledDateButtonProps) {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
}
