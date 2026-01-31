"use client";

import { loginPromptDialog } from "app/components/Dialog/loginPromptDialog";
import { reminderDialog } from "app/components/Dialog/reminder";
import { Img } from "app/components/Img";
import { AppPages } from "app/lib/routes";
import { isLiveOutpost } from "app/lib/outposts";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { lumaApi } from "app/services/api/luma";
import { OutpostModel } from "app/services/api/types";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, Calendar, ExternalLink, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventOutpostCardProps {
  outpost: OutpostModel;
  index: number;
  /** "strip" = compact horizontal scroll card; "grid" = larger card in grid layout */
  variant?: "strip" | "grid";
}

export function EventOutpostCard({
  outpost,
  index,
  variant = "strip",
}: EventOutpostCardProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const isLive = isLiveOutpost(outpost);
  const isUpcoming = outpost.scheduled_for > Date.now();
  const hasReminderSet = outpost.reminder_offset_minutes != null;
  const [reminderSetLocal, setReminderSetLocal] = useState(false);
  const [lumaLoading, setLumaLoading] = useState(false);
  /** API uses milliseconds for scheduled_for (matches outpost details / join flow). */
  const scheduledMs = outpost.scheduled_for;

  const handleClick = () => {
    router.push(AppPages.outpostDetails(outpost.uuid));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleRemindMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    loginPromptDialog({
      actionDescription: "set a reminder for this room",
      action: async () => {
        const res = await reminderDialog({
          title: "Set Reminder",
          content: "When would you like to be reminded?",
          scheduledFor: outpost.scheduled_for,
          confirmOpts: { text: "Set Reminder" },
          cancelOpts: { text: "Cancel" },
        });
        if (res.confirmed) {
          const minutesBefore = res.reminderMinutes ?? 0;
          const ok = await podiumApi.setOrRemoveReminder({
            uuid: outpost.uuid,
            reminder_offset_minutes: minutesBefore === -1 ? undefined : minutesBefore,
          });
          if (ok) {
            setReminderSetLocal(true);
            toast.success("Reminder set");
          } else {
            toast.error("Failed to set reminder");
          }
        }
      },
    });
  };

  const handleLumaRSVP = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!outpost.luma_event_id) return;
    setLumaLoading(true);
    try {
      const details = await lumaApi.getEvent(outpost.luma_event_id);
      if (details?.event?.url) {
        window.open(details.event.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Could not load Luma event");
      }
    } catch {
      toast.error("Could not load Luma event");
    } finally {
      setLumaLoading(false);
    }
  };

  const showReminderSet = hasReminderSet || reminderSetLocal;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1],
            }
      }
      whileHover={reducedMotion ? undefined : { scale: 1.03, y: -5 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="group relative cursor-pointer flex-none snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg"
      role="article"
      aria-label={`${outpost.name}, ${isLive ? "live now" : "upcoming"}. View details`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition duration-500 group-hover:duration-200 -z-10" />

      <div
        className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 dark:from-slate-800/95 dark:to-slate-900/95 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm ${
          variant === "grid" ? "w-full" : "w-[140px] sm:w-[160px]"
        }`}
      >
        {/* Badge: Live or Upcoming */}
        {isLive ? (
          <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-full shadow">
            {!reducedMotion && (
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
                className="w-1 h-1 bg-white rounded-full"
                aria-hidden
              />
            )}
            {reducedMotion && (
              <div className="w-1 h-1 bg-white rounded-full" aria-hidden />
            )}
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              Live
            </span>
          </div>
        ) : (
          <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/90 dark:bg-blue-600/90 backdrop-blur-sm rounded-full shadow">
            <Calendar className="w-2.5 h-2.5 text-white" aria-hidden />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              {format(scheduledMs, "MMM d")}
            </span>
          </div>
        )}

        {/* Image: 2/1 for compact card height */}
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Img
            src={outpost.image}
            alt={outpost.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
        </div>

        {/* Content: compact padding and type; slightly larger fonts for legibility */}
        <div className={variant === "grid" ? "p-3 space-y-1.5" : "p-2 space-y-1"}>
          <h3
            className={`font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors duration-200 ${
              variant === "grid" ? "text-sm" : "text-xs"
            }`}
          >
            {outpost.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="relative w-4 h-4 rounded-full overflow-hidden border border-purple-500/50 shrink-0">
              <Img
                src={outpost.creator_user_image}
                alt={outpost.creator_user_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-slate-300 truncate ${
                variant === "grid" ? "text-xs" : "text-[11px]"
              }`}
            >
              {outpost.creator_user_name}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <div className="flex items-center gap-0.5 text-purple-400">
              <Users className="w-3 h-3" aria-hidden />
              <span
                className={
                  variant === "grid" ? "text-xs font-semibold" : "text-[11px] font-semibold"
                }
              >
                {outpost.online_users_count ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-slate-400">
              <Calendar className="w-2.5 h-2.5" aria-hidden />
              <span className={variant === "grid" ? "text-xs" : "text-[11px]"}>
                {format(scheduledMs, "MMM d")}
              </span>
            </div>
          </div>

          {/* Remind me + Luma RSVP (grid + upcoming only) */}
          {variant === "grid" && isUpcoming && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700/50 mt-2">
              {!showReminderSet ? (
                <button
                  type="button"
                  onClick={handleRemindMe}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-purple-500/80 hover:bg-purple-500 text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  aria-label="Set reminder for this room"
                >
                  <Bell className="w-3.5 h-3.5" aria-hidden />
                  Remind me
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-green-400">
                  <Bell className="w-3.5 h-3.5" aria-hidden />
                  Reminder set
                </span>
              )}
              {outpost.luma_event_id && (
                <button
                  type="button"
                  onClick={handleLumaRSVP}
                  disabled={lumaLoading}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-600/80 hover:bg-slate-600 text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
                  aria-label="RSVP on Luma"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                  {lumaLoading ? "Loading…" : "RSVP on Luma"}
                </button>
              )}
            </div>
          )}
        </div>

        <motion.div
          className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-b-lg"
          initial={reducedMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.8, delay: index * 0.1 + 0.3 }
          }
        />
      </div>
    </motion.div>
  );
}
