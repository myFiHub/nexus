import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { OutpostsList } from "app/components/outpost/OutpostsList";
import { PopularTags } from "app/containers/home/PublicRails";
import { getCachedDiscovery, getCachedTagOutposts } from "app/lib/discovery";
import { AppPages } from "app/lib/routes";
import { Hash } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
};

const parseTagId = (raw: string) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const resolveTagName = async (id: number, fallback?: string) => {
  const { tags } = await getCachedDiscovery();
  return tags.find((t) => t.id === id)?.name ?? fallback ?? `Topic ${id}`;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const id = parseTagId((await params).id);
  if (!id) return {};
  const name = await resolveTagName(id, (await searchParams).name);
  return {
    title: `#${name} outposts`,
    description: `Live and upcoming outposts about ${name} on Podium Nexus.`,
    alternates: { canonical: AppPages.tag(id) },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const id = parseTagId((await params).id);
  if (!id) notFound();
  const [name, outposts, discovery] = await Promise.all([
    resolveTagName(id, (await searchParams).name),
    getCachedTagOutposts(id),
    getCachedDiscovery(),
  ]);
  const live = outposts.filter((o) => (o.online_users_count ?? 0) > 0).length;
  const related = discovery.tags.filter((t) => t.id !== id).slice(0, 12);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      <RouteLoaderCleaner />
      <header className="animate-entrance flex items-center gap-4">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-[18px]"
          style={{
            color: "var(--p-on-accent)",
            backgroundImage: "var(--grad-aurora)",
          }}
        >
          <Hash className="h-7 w-7" />
        </span>
        <div>
          <p className="label-caps">
            <Link href={AppPages.allOutposts} className="hover:text-primary">
              Explore
            </Link>{" "}
            / Topic
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">#{name}</h1>
          <p className="text-sm text-muted-foreground tabular-nums">
            {outposts.length} {outposts.length === 1 ? "outpost" : "outposts"}
            {live > 0 && ` · ${live} live now`}
          </p>
        </div>
      </header>
      <OutpostsList
        outposts={outposts}
        noOutpostComponent={
          <p className="text-muted-foreground">No outposts about #{name} yet.</p>
        }
      />
      {related.length > 0 && <PopularTags tags={related} title="More topics" />}
    </div>
  );
}
