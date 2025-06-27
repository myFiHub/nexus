import { OutpostDetailsContainer } from "app/containers/outpostDetails";
import { LumaEventDetails } from "app/containers/outpostDetails/components/LumaEventDetails";
import podiumApi from "app/services/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface OutpostDetailsPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    return {
      title: "Outpost Not Found",
      description: "The requested outpost could not be found.",
    };
  }

  return {
    title: outpost.name,
    description: outpost.subject,
    openGraph: {
      title: outpost.name,
      description: outpost.subject,
      images: outpost.image ? [outpost.image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: outpost.name,
      description: outpost.subject,
      images: outpost.image ? [outpost.image] : [],
    },
  };
}

export default async function OutpostDetailsPage({
  params,
}: OutpostDetailsPageProps) {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    notFound();
  }

  // Create the luma slot content if the outpost has a luma_event_id
  const lumaSlot = outpost.luma_event_id ? (
    <LumaEventDetails eventId={outpost.luma_event_id} />
  ) : null;

  return <OutpostDetailsContainer outpost={outpost} lumaSlot={lumaSlot} />;
}
