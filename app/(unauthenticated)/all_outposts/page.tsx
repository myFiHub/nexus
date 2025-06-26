import { AllOutpostsContainer } from "app/containers/allOutposts";
import podiumApi from "app/services/api";
import { AlertCircle } from "lucide-react";
import { ErrorState } from "./ErrorState";

export default async function AllOutpostsPage() {
  const outposts = await podiumApi.getOutposts(0, 50);
  if (outposts instanceof Error) {
    return (
      <ErrorState
        error={outposts}
        title="Unable to load outposts"
        description="Please try again"
        buttonHref="/all_outposts"
        icon={<AlertCircle className="h-10 w-10 text-destructive" />}
      />
    );
  }
  return <AllOutpostsContainer initialOutposts={outposts} />;
}
