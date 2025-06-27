"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "app/components/Tooltip";
import { LumaApi, LumaEventModel } from "app/services/api/luma";
import { Calendar, Clock, ExternalLink, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LumaEventIndicatorProps {
  eventId: string;
}

export function LumaEventIndicator({ eventId }: LumaEventIndicatorProps) {
  const [eventDetails, setEventDetails] = useState<LumaEventModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEventDetails = async () => {
    if (eventDetails || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    try {
      const lumaApi = LumaApi.getInstance();
      const details = await lumaApi.getEvent(eventId);
      setEventDetails(details || null);
    } catch (error) {
      console.error("Error fetching Luma event details:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Start the 1-second timer when tooltip opens
      timeoutRef.current = setTimeout(() => {
        fetchEventDetails();
      }, 1000);
    } else {
      // Clear the timer if tooltip closes before 1 second
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500/80 to-purple-500/80 backdrop-blur-sm border border-white/30 hover:from-blue-500 hover:to-purple-500 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <img
              src="/lumaPng.png"
              alt="Luma Event"
              className="w-5 h-5 rounded-md"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="w-80 p-0 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl overflow-hidden min-h-[120px]"
        >
          {!isLoading && !hasError && !eventDetails ? (
            <div className="p-4 flex items-center justify-center min-h-[120px] bg-white/5 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2 text-sm text-white font-medium">
                Loading event details...
              </span>
            </div>
          ) : isLoading ? (
            <div className="p-4 flex items-center justify-center min-h-[120px] bg-white/5 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2 text-sm text-white font-medium">
                Loading event details...
              </span>
            </div>
          ) : hasError ? (
            <div className="p-4 text-center min-h-[120px] flex items-center justify-center bg-white/5 backdrop-blur-sm">
              <span className="text-sm text-white font-medium">
                Failed to load event details
              </span>
            </div>
          ) : eventDetails ? (
            <div className="bg-white/10 backdrop-blur-xl">
              {/* Event Image */}
              {eventDetails.event.cover_url && (
                <div className="w-full h-32 bg-gradient-to-r from-blue-500/80 to-purple-600/80 relative">
                  <img
                    src={eventDetails.event.cover_url}
                    alt={eventDetails.event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              {/* Event Content */}
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 drop-shadow-sm">
                  {eventDetails.event.name}
                </h3>

                {eventDetails.event.description && (
                  <p className="text-xs text-white/90 mb-3 line-clamp-2 font-medium">
                    {eventDetails.event.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs text-white/95 font-medium">
                    <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span>{formatDate(eventDetails.event.start_at)}</span>
                  </div>

                  <div className="flex items-center text-xs text-white/95 font-medium">
                    <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span>
                      {formatTime(eventDetails.event.start_at)} -{" "}
                      {formatTime(eventDetails.event.end_at)}
                    </span>
                  </div>
                </div>

                {/* URL Section */}
                {eventDetails.event.url && (
                  <div className="mb-3">
                    <div className="flex items-center text-xs text-white/95 font-semibold mb-2">
                      <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>Event URL</span>
                    </div>
                    <a
                      href={eventDetails.event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white font-medium hover:bg-white/30 transition-colors"
                    >
                      <span className="truncate flex-1">View Event</span>
                      <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                )}

                {/* Hosts Section */}
                {eventDetails.hosts && eventDetails.hosts.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center text-xs text-white/95 font-semibold mb-2">
                      <Users className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>Hosts ({eventDetails.hosts.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {eventDetails.hosts.slice(0, 4).map((host, index) => (
                        <div
                          key={host.api_id}
                          className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium"
                        >
                          {host.avatar_url ? (
                            <img
                              src={host.avatar_url}
                              alt={host.name}
                              className="w-4 h-4 rounded-full mr-1"
                            />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          <span className="truncate max-w-[60px]">
                            {host.name}
                          </span>
                        </div>
                      ))}
                      {eventDetails.hosts.length > 4 && (
                        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
                          <span>+{eventDetails.hosts.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
