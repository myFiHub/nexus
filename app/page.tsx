import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { HomeContainer } from "../containers/home";
export default async function Home() {
  let outposts: OutpostModel[] = [];
  const results = await podiumApi.getOutposts(0, 3);
  if (!(results instanceof Error)) {
    outposts = results;
  }

  return <HomeContainer trendingOutposts={outposts} />;
}
