import { GlassCard } from "app/components/aurora";
import { Img } from "app/components/Img";
import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { OutpostsList } from "app/components/outpost/OutpostsList";
import { MIN_SEARCH_QUERY_LENGTH } from "app/containers/search/constants";
import { SearchBox } from "app/containers/search/SearchBox";
import { AppPages } from "app/lib/routes";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { Hash, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

type Tab = "outposts" | "people" | "topics";
const TABS: { id: Tab; label: string }[] = [
  { id: "outposts", label: "Outposts" },
  { id: "people", label: "People" },
  { id: "topics", label: "Topics" },
];

type Props = { searchParams: Promise<{ q?: string; tab?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (await searchParams).q?.trim();
  return {
    title: q ? `Search: ${q}` : "Search",
    robots: { index: false, follow: true },
  };
}

const search = async (q: string) => {
  const [outposts, people, topics] = await Promise.all([
    podiumApi.searchOutpostByName(q, 0, 30),
    podiumApi.searchUserByName(q, 0, 30),
    podiumApi.searchTag(q, 0, 30),
  ]);
  return {
    outposts: Object.values(outposts),
    people: Object.values(people),
    topics: Object.values(topics),
  };
};

const Empty = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
    <SearchX className="h-10 w-10 opacity-60" />
    <p>{text}</p>
  </div>
);

const Results = async ({ q, tab }: { q: string; tab: Tab }) => {
  const results = await search(q);
  const counts: Record<Tab, number> = {
    outposts: results.outposts.length,
    people: results.people.length,
    topics: results.topics.length,
  };

  return (
    <div className="flex flex-col gap-6">
      <nav role="tablist" aria-label="Result type" className="flex gap-1 rounded-full bg-surface-raised p-1 w-fit">
        {TABS.map((t) => (
          <Link
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            href={`${AppPages.search}?q=${encodeURIComponent(q)}&tab=${t.id}`}
            replace
            scroll={false}
            className={cn(
              "press rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className="ml-1.5 tabular-nums opacity-70">{counts[t.id]}</span>
          </Link>
        ))}
      </nav>

      <div className="animate-crossfade" key={`${q}-${tab}`}>
        {tab === "outposts" &&
          (counts.outposts ? (
            <OutpostsList outposts={results.outposts} />
          ) : (
            <Empty text={`No outposts match “${q}”.`} />
          ))}

        {tab === "people" &&
          (counts.people ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.people.map((user, i) => (
                <Link
                  key={user.uuid}
                  href={AppPages.userDetails(user.uuid)}
                  className="animate-entrance block"
                  style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
                >
                  <GlassCard interactive className="flex items-center gap-3 p-3">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-raised">
                      <Img
                        src={user.image || undefined}
                        alt={user.name || "User"}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-foreground">
                        {user.name || "Unnamed"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground tabular-nums">
                        {user.followers_count ?? 0} followers
                        {user.followed_by_me && " · Following"}
                      </span>
                    </span>
                  </GlassCard>
                </Link>
              ))}
            </div>
          ) : (
            <Empty text={`No people match “${q}”.`} />
          ))}

        {tab === "topics" &&
          (counts.topics ? (
            <div className="flex flex-wrap gap-2">
              {results.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`${AppPages.tag(topic.id)}?name=${encodeURIComponent(topic.name)}`}
                  className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary"
                >
                  <Hash className="h-3.5 w-3.5 text-primary" />
                  {topic.name}
                </Link>
              ))}
            </div>
          ) : (
            <Empty text={`No topics match “${q}”.`} />
          ))}
      </div>
    </div>
  );
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const tab: Tab = TABS.some((t) => t.id === params.tab) ? (params.tab as Tab) : "outposts";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <RouteLoaderCleaner />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Search</h1>
      <Suspense>
        <SearchBox initialQuery={q} />
      </Suspense>
      {q.length >= MIN_SEARCH_QUERY_LENGTH ? (
        <Suspense
          key={q}
          fallback={<p className="text-sm text-muted-foreground">Searching…</p>}
        >
          <Results q={q} tab={tab} />
        </Suspense>
      ) : (
        <p className="text-sm text-muted-foreground">
          Type at least {MIN_SEARCH_QUERY_LENGTH} characters to search.
        </p>
      )}
    </div>
  );
}
