import { AppLink } from "app/components/AppLink";
import { AppPages } from "app/lib/routes";
import { Mic, Users } from "lucide-react";

export function PersonaSection() {
  return (
    <section
      className="w-full py-20"
      aria-labelledby="persona-section-heading"
    >
      <h2
        id="persona-section-heading"
        className="text-center text-3xl md:text-4xl font-bold mb-12 text-foreground"
      >
        Built for Hosts and Listeners
      </h2>
      <p className="text-center text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-16">
        Rooms (Outposts) are live audio spaces. Whether you host or join, Podium
        is built for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
        {/* For Hosts */}
        <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white shadow-lg"
              aria-hidden
            >
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              For Hosts & Creators
            </h3>
          </div>
          <ul className="space-y-3 text-[var(--muted-foreground)] mb-6 list-disc list-inside text-base leading-relaxed">
            <li>Host live Rooms and build your community</li>
            <li>Monetize with passes and direct support</li>
            <li>Schedule events and invite your audience</li>
          </ul>
          <AppLink
            href={AppPages.createOutpost}
            variant="default"
            size="default"
            className="inline-flex items-center gap-2 rounded-full font-semibold"
          >
            Start Your Room
          </AppLink>
        </div>

        {/* For Listeners */}
        <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
              aria-hidden
            >
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              For Listeners & Communities
            </h3>
          </div>
          <ul className="space-y-3 text-[var(--muted-foreground)] mb-6 list-disc list-inside text-base leading-relaxed">
            <li>Join live Rooms on topics you care about</li>
            <li>Discover creators and set reminders for upcoming events</li>
            <li>Participate, react, and support creators</li>
          </ul>
          <AppLink
            href={AppPages.allOutposts}
            variant="outline"
            size="default"
            className="inline-flex items-center gap-2 rounded-full font-semibold border-2"
          >
            Explore Live Rooms
          </AppLink>
        </div>
      </div>
    </section>
  );
}
