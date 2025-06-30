"use client";

import { Button } from "app/components/Button";
import { motion } from "framer-motion";
import { Key } from "lucide-react";
import { exportPrivateKeyDialog } from "./dialogs/exportPrivateKeyDialog";

export const ExportPrivateKeyButton = () => {
  const handleExportPrivateKey = () => {
    exportPrivateKeyDialog();
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleExportPrivateKey}
        colorScheme="danger"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
      >
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          Export Private Key
        </div>
      </Button>
    </motion.div>
  );
};
