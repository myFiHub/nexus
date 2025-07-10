import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";

export const RecordingIndicator = () => {
  const isRecording = useSelector(onGoingOutpostSelectors.isRecording);

  if (!isRecording) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      className="fixed top-15 right-4 z-50 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center"
      >
        <CircleDot className="w-4 h-4 text-red-500 fill-red-500" />
      </motion.div>
      <span className="text-red-500 font-medium text-sm">RECORDING</span>
    </motion.div>
  );
};
