import { AllOutpostsContainer } from "app/containers/allOutposts";
import podiumApi from "app/services/api";

export default async function AllOutpostsPage() {
  const outposts = await podiumApi.getOutposts(0, 50);
  return <AllOutpostsContainer initialOutposts={outposts} />;
}
