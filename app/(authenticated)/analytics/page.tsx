import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { HostDashboard } from "app/containers/analytics/HostDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host dashboard",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return (
    <>
      <RouteLoaderCleaner />
      <HostDashboard />
    </>
  );
}
