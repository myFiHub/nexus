import OutpostLink from "app/components/AppLink/outpostLink";
import { Img } from "app/components/Img";
import { OutpostModel } from "app/services/api/types";
import { AppLink } from "../../components/AppLink";

export function TrendingSection({
  trendingOutposts,
}: {
  trendingOutposts: OutpostModel[];
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text text-transparent">
          Trending Outposts
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Join the most popular communities and start your journey today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
        {trendingOutposts.map((outpost) => (
          <div
            key={outpost.uuid}
            className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group  border border-[var(--border)]"
          >
            <div className="relative h-48 overflow-hidden">
              <Img
                src={outpost.image}
                alt={outpost.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-1">
                  {outpost.subject}
                </h3>
                <p className="text-white/80 text-sm">
                  by {outpost.creator_user_name}
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {outpost.online_users_count ?? 0} online
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {outpost.members_count ?? 0} members
                </span>
              </div>

              <OutpostLink
                id={outpost.uuid}
                underline={false}
                className="w-full bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Join Outpost
              </OutpostLink>
            </div>
          </div>
        ))}
      </div>

      <AppLink
        href="/all_outposts"
        className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:text-purple-600 text-lg group transition-colors duration-200"
      >
        <span>View All Outposts</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          &rarr;
        </span>
      </AppLink>
    </div>
  );
}
