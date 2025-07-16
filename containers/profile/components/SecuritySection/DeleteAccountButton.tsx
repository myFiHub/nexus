"use client";

import { Button } from "app/components/Button";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { profileActions } from "../../slice";
import { deleteAccountDialog } from "./dialogs/deleteAccountDialog";

export const DeleteAccountButton = () => {
  const dispatch = useDispatch();
  const handleDeleteAccount = async () => {
    const confirmed = await deleteAccountDialog();
    if (confirmed) {
      dispatch(profileActions.deleteAccount());
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleDeleteAccount}
        variant="destructive"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </div>
      </Button>
    </motion.div>
  );
};
