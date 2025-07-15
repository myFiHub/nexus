import UsersSlot from "../../dashboard/@users/page";
import { UserTags } from "./_filters";

interface Props {
  params: Promise<{ filter: UserTags }>;
}

export default async function UsersPage({ params }: Props) {
  const { filter } = await params;

  console.log(filter);
  return <UsersSlot />;
}
