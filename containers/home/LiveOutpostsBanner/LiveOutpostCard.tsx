"use client";

import { Img } from "app/components/Img";
import { AppPages } from "app/lib/routes";
import { OutpostModel } from "app/services/api/types";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface LiveOutpostCardProps {
  outpost: OutpostModel;
  index: number;
}

export const LiveOutpostCard = ({ outpost, index }: LiveOutpostCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(AppPages.outpostDetails(outpost.uuid));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-sm transition duration-500 group-hover:duration-200 -z-10" />

      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 dark:from-slate-800/95 dark:to-slate-900/95 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Live indicator badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 bg-white rounded-full"
          />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live
          </span>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Img
            src={outpost.image}
            alt={outpost.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
            {outpost.name}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-purple-500/50">
              <Img
                src={outpost.creator_user_image}
                alt={outpost.creator_user_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-slate-300 truncate">
              {outpost.creator_user_name}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {outpost.online_users_count || 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">
                {new Date(outpost.scheduled_for * 1000).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        />
      </div>
    </motion.div>
  );
};
