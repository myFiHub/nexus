import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { onGoingOutpostActions } from "../../slice";

export const RefreshButton = () => {
  const dispatch = useDispatch();
  const isRefreshingLiveMembers = useSelector(
    onGoingOutpostSelectors.isRefreshingLiveMembers
  );
  const onClick = () => {
    if (!isRefreshingLiveMembers) {
      dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
    }
  };
  return (
    <div
      className={`max-w-[16px] max-h-[16px] flex items-center justify-center transition-opacity ${
        isRefreshingLiveMembers
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <motion.div
        animate={isRefreshingLiveMembers ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isRefreshingLiveMembers
            ? { repeat: Infinity, duration: 0.8, ease: "linear" }
            : { type: "spring", stiffness: 300, damping: 20 }
        }
      >
        <RefreshCw className="w-4 h-4 text-green-500" />
      </motion.div>
    </div>
  );
};
