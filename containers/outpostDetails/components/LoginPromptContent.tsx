import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";
import { easeOut, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Lock,
  Mic,
  MicOff,
  Sparkles,
  Unlock,
} from "lucide-react";

interface LoginPromptContentProps {
  outpost: OutpostModel;
}

export const LoginPromptContent = ({ outpost }: LoginPromptContentProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOutpostStatus = () => {
    if (!outpost.scheduled_for)
      return {
        status: "Live",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
      };

    const now = Date.now();
    const scheduledTime = outpost.scheduled_for;

    if (now < scheduledTime) {
      return {
        status: "Scheduled",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
      };
    } else {
      return {
        status: "Started",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
      };
    }
  };

  const getAccessType = () => {
    if (outpost.enter_type === "everyone")
      return { type: "Public", icon: Unlock, color: "text-green-600" };
    if (outpost.enter_type === "having_link")
      return { type: "Link Only", icon: Lock, color: "text-amber-600" };
    if (outpost.enter_type === "invited_users")
      return { type: "Invite Only", icon: Lock, color: "text-red-600" };
    if (outpost.enter_type === "podium_pass_holders")
      return { type: "Pass Holders", icon: Lock, color: "text-purple-600" };
    return { type: "Restricted", icon: Lock, color: "text-amber-600" };
  };

  const getSpeakType = () => {
    if (outpost.speak_type === "everyone")
      return { type: "Open Mic", icon: Mic, color: "text-green-600" };
    if (outpost.speak_type === "private")
      return { type: "Invite Only", icon: MicOff, color: "text-red-600" };
    return { type: "Restricted", icon: MicOff, color: "text-amber-600" };
  };

  const status = getOutpostStatus();
  const accessType = getAccessType();
  const speakType = getSpeakType();
  const AccessIcon = accessType.icon;
  const SpeakIcon = speakType.icon;

  return (
    <motion.div
      className="space-y-4 max-w-sm mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4 text-white shadow-lg max-w-[355px]"
        variants={cardVariants}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-3 mb-3"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Img
                  src={outpost.image ?? logoUrl}
                  useImgTag
                  alt={outpost.name}
                  className="w-10 h-10 text-white rounded-lg"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold truncate">{outpost.name}</h2>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color} flex-shrink-0`}
                >
                  {status.status}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">
                  {outpost.scheduled_for
                    ? formatDate(outpost.scheduled_for)
                    : "Live now"}
                </span>
              </div>
            </div>
          </motion.div>

          {outpost.scheduled_for && (
            <motion.div
              className="flex items-center gap-2 text-white/90"
              variants={itemVariants}
            >
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                Starts at {formatTime(outpost.scheduled_for)}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Access & Permissions */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 p-3 shadow-lg"
        variants={cardVariants}
      >
        <div className="absolute top-0 right-0 w-8 h-8 bg-purple-100 rounded-full -translate-y-4 translate-x-4" />

        <div className="relative z-10">
          <motion.h3
            className="text-sm font-semibold text-purple-900 mb-2"
            variants={itemVariants}
          >
            Access & Permissions
          </motion.h3>

          <div className="grid grid-cols-2 gap-1.5">
            <motion.div
              className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-200 shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-1.5">
                <AccessIcon className={`w-3.5 h-3.5 ${accessType.color}`} />
                <span className="text-xs font-medium text-purple-700">
                  Entry
                </span>
              </div>
              <span
                className={`text-xs font-medium ${accessType.color} truncate ml-1`}
              >
                {accessType.type}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-200 shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-1.5">
                <SpeakIcon className={`w-3.5 h-3.5 ${speakType.color}`} />
                <span className="text-xs font-medium text-purple-700">
                  Speak
                </span>
              </div>
              <span
                className={`text-xs font-medium ${speakType.color} truncate ml-1`}
              >
                {speakType.type}
              </span>
            </motion.div>

            {outpost.has_adult_content && (
              <motion.div
                className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200 col-span-2"
                variants={itemVariants}
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-800">
                    Adult Content
                  </span>
                </div>
                <span className="text-xs font-medium text-amber-700">
                  Warning
                </span>
              </motion.div>
            )}

            {outpost.is_recordable && (
              <motion.div
                className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200 col-span-2"
                variants={itemVariants}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">
                    Recording Enabled
                  </span>
                </div>
                <span className="text-xs font-medium text-purple-700">
                  <Check className="w-3.5 h-3.5 text-purple-600" />
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Outpost Details */}
      {outpost.subject && (
        <motion.div
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 p-3 shadow-lg"
          variants={cardVariants}
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-slate-100 rounded-full -translate-y-4 translate-x-4" />

          <div className="relative z-10">
            <motion.div
              className="flex items-start gap-3"
              variants={itemVariants}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  About this outpost
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                  {outpost.subject}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div className="text-center py-2" variants={itemVariants}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-xs font-medium shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span>Ready to join the conversation?</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
