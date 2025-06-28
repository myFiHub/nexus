import { OutpostDetailsContainer } from "app/containers/outpostDetails";
import { LumaEventDetails } from "app/containers/outpostDetails/components/LumaEventDetails";
import podiumApi from "app/services/api";
import { notFound } from "next/navigation";
import { generateEventStructuredData, generateMetadata } from "./_metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

export { generateMetadata };

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default async function OutpostDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    notFound();
  }

  // Generate structured data for better SEO
  const structuredData = generateEventStructuredData(outpost, id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <OutpostDetailsContainer
        outpost={outpost}
        lumaSlot={
          outpost.luma_event_id ? (
            <LumaEventDetails eventId={outpost.luma_event_id} />
          ) : undefined
        }
      />
    </>
  );
}
