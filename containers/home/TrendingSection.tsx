import { AppLink } from "../../components/AppLink";

export function TrendingSection() {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
        Trending Outposts
      </h2>
      <AppLink
        href="/all_outposts"
        className="text-primary font-semibold hover:underline text-lg"
      >
        View All Outposts &rarr;
      </AppLink>
    </div>
  );
}
