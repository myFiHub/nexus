"use client";

import { useEffect, useState } from "react";
import { lumaApi, LumaEventModel } from "../../../services/api/luma";

interface LumaEventDetailsProps {
  eventId: string;
}

export function LumaEventDetails({ eventId }: LumaEventDetailsProps) {
  const [eventData, setEventData] = useState<LumaEventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventData() {
      try {
        setLoading(true);
        const data = await lumaApi.getEvent(eventId);
        if (data) {
          setEventData(data);
        } else {
          setError("Failed to load event data");
        }
      } catch (err) {
        setError("Error loading event data");
        console.error("Error fetching Luma event:", err);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Unable to load Luma event details</p>
          {error && <p className="text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  const { event, hosts } = eventData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Luma Event Details
        </h3>
      </div>

      <div className="space-y-4">
        {/* Event Info */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {event.name}
          </h4>
          {event.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {event.description}
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Start Time
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(event.start_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              End Time
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(event.end_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Timezone
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {event.timezone}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Visibility
            </p>
            <p className="text-sm text-gray-900 dark:text-white capitalize">
              {event.visibility}
            </p>
          </div>
        </div>

        {/* Hosts */}
        {hosts && hosts.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Hosts ({hosts.length})
            </p>
            <div className="space-y-2">
              {hosts.map((host) => (
                <div key={host.api_id} className="flex items-center gap-3">
                  {host.avatar_url && (
                    <img
                      src={host.avatar_url}
                      alt={host.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {host.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {host.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting URL */}
        {event.meeting_url && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Meeting Link
            </p>
            <a
              href={event.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
            >
              {event.meeting_url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
