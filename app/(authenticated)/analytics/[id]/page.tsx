import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { OutpostAnalytics } from "app/containers/analytics/OutpostAnalytics";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
};

export const metadata: Metadata = {
  title: "Outpost analytics",
  robots: { index: false, follow: false },
};

export default async function OutpostAnalyticsPage({ params, searchParams }: Props) {
  const [{ id }, { name }] = await Promise.all([params, searchParams]);
  return (
    <>
      <RouteLoaderCleaner />
      <OutpostAnalytics outpostId={id} initialName={name?.slice(0, 120)} />
    </>
  );
}
