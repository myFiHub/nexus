"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../Tooltip";

interface OnlineUsersIndicatorProps {
  outpost: OutpostModel;
}

const Content = ({ outpost }: OnlineUsersIndicatorProps) => {
  const dispatch = useDispatch();
  const numberOfOnlineUsersForOutpost = useSelector(
    GlobalSelectors.numberOfOnlineUsersForOutpost(outpost.uuid)
  );
  const onlineCount =
    numberOfOnlineUsersForOutpost || outpost.online_users_count || 0;
  const membersCount = outpost.members_count || 0;
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(
              globalActions.toggleOutpostFromOnlineObject({
                outpostId: outpost.uuid,
                addToObject: true,
              })
            );
          } else {
            dispatch(
              globalActions.toggleOutpostFromOnlineObject({
                outpostId: outpost.uuid,
                addToObject: false,
              })
            );
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [outpost.uuid]);

  // Don't show if no online users and no members
  if (onlineCount === 0 && membersCount === 0) {
    return null;
  }

  return (
    <motion.div
      ref={componentRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 cursor-help"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <Users className="w-3 h-3" />
              {onlineCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                  className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full bg-green-300 rounded-full opacity-70"
                  />
                </motion.div>
              )}
            </div>
            <motion.span
              key={onlineCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {onlineCount}
            </motion.span>
            <span className="text-white/70">online</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">
              {onlineCount > 0
                ? `${onlineCount} user${
                    onlineCount === 1 ? "" : "s"
                  } currently online`
                : "No users currently online"}
            </p>
            {membersCount > 0 && (
              <p className="text-sm text-gray-500">
                {membersCount} total member{membersCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
};

export const OnlineUsersIndicator = ({
  outpost,
}: OnlineUsersIndicatorProps) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
