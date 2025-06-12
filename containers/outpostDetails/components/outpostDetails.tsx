import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Mic, Shield, Tag, Users, Video } from "lucide-react";
import { AppLink } from "../../../components/AppLink";
import { Img } from "../../../components/Img";
import { logoUrl } from "../../../lib/constants";
import { OutpostModel } from "../../../services/api/types";

interface OutpostDetailsProps {
  outpost: OutpostModel;
}

export function OutpostDetails({ outpost }: OutpostDetailsProps) {
  const scheduledDate = new Date(outpost.scheduled_for);
  const isUpcoming = scheduledDate > new Date();
  const timeUntil = formatDistanceToNow(scheduledDate, { addSuffix: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Image with Overlay */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden group flex justify-center">
          <div className="w-full h-full rounded-[400px] group-hover:rounded-none transition-all duration-500 ease-in-out overflow-hidden max-w-xl">
            <Img
              src={outpost.image || logoUrl}
              alt={outpost.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-lg lg:text-4xl font-bold mb-2 ">
              {outpost.name}
            </h1>
            <p className="text-xl opacity-90">{outpost.subject}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Info */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
              <AppLink
                href={`/user/${outpost.creator_user_uuid}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <Img
                  src={outpost.creator_user_image || logoUrl}
                  alt={outpost.creator_user_name}
                  className="w-16 h-16 rounded-full border-2 border-[var(--primary)]"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {outpost.creator_user_name}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Users className="w-4 h-4" />
                    <span>{outpost.members_count || 0} members</span>
                    {outpost.online_users_count ? (
                      <>
                        <span>•</span>
                        <span>{outpost.online_users_count} online</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </AppLink>
            </div>

            {/* Event Details */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-medium">Scheduled For</p>
                    <p className="text-[var(--muted-foreground)]">
                      {scheduledDate.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-medium">Time Until</p>
                    <p className="text-[var(--muted-foreground)]">
                      {timeUntil}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-medium">Access Type</p>
                    <p className="text-[var(--muted-foreground)] capitalize">
                      {outpost.enter_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-medium">Speaking Type</p>
                    <p className="text-[var(--muted-foreground)] capitalize">
                      {outpost.speak_type}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {outpost.tags.length > 0 && (
              <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-[var(--primary)]" />
                  <h2 className="text-2xl font-semibold">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {outpost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium hover:bg-[var(--primary)]/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Members List */}
            {outpost.members && outpost.members.length > 0 && (
              <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[var(--primary)]" />
                  <h2 className="text-2xl font-semibold">Members</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {outpost.members.map((member) => (
                    <AppLink
                      key={member.uuid}
                      href={`/user/${member.uuid}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] hover:bg-[var(--background)]/80 transition-colors"
                    >
                      <Img
                        src={member.image || logoUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border-2 border-[var(--primary)]"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          {member.is_present && (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Online
                            </span>
                          )}
                          {member.can_speak && (
                            <span className="flex items-center gap-1">
                              <Mic className="w-3 h-3" />
                              Can Speak
                            </span>
                          )}
                        </div>
                      </div>
                    </AppLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Join Button */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
              {isUpcoming ? (
                <button className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                  Join Event
                </button>
              ) : (
                <button
                  className="w-full bg-[var(--primary)]/20 text-[var(--primary)] py-3 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  Event Ended
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="font-semibold text-lg mb-2">
                Additional Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--muted-foreground)]">
                    {outpost.is_recordable
                      ? "Recording Enabled"
                      : "Recording Disabled"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--muted-foreground)]">
                    {outpost.has_adult_content ? "Adult Content" : "All Ages"}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Share This Event</h3>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#1DA1F2] text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Twitter
                </button>
                <button className="flex-1 bg-[#4267B2] text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
