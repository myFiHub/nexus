import { OutpostDetailsContainer } from "app/containers/outpostDetails";
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
}: OutpostDetailsPageProps): Promise<Metadata> {
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

  return <OutpostDetailsContainer outpost={outpost} />;
}
