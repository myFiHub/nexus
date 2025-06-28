import { Img } from "../../../components/Img";
import { lumaApiDirect } from "../../../services/api/luma";

interface LumaEventDetailsProps {
  eventId: string;
}

export async function LumaEventDetails({ eventId }: LumaEventDetailsProps) {
  try {
    const eventData = await lumaApiDirect.getEvent(eventId);

    if (!eventData) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Unable to load Luma event details</p>
          </div>
        </div>
      );
    }

    const { event, hosts } = eventData;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Event Cover Image */}
        {event.cover_url && (
          <div className="relative h-48 w-full">
            <Img
              src={event.cover_url}
              alt={event.name}
              useImgTag
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                <h3 className="text-lg font-semibold text-white">
                  Luma Event Details
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Event Content */}
        <div className="p-6 space-y-4">
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
                      <Img
                        src={host.avatar_url}
                        alt={host.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                        useImgTag
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

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Event Link
            </p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
            >
              {event.url}
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching Luma event:", error);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Unable to load Luma event details</p>
          <p className="text-sm mt-1">Error loading event data</p>
        </div>
      </div>
    );
  }
}
