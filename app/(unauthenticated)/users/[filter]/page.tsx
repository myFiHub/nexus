import UsersSlot from "../../dashboard/@users/page";

interface Props {
  params: Promise<{ filter: string }>;
}

export default async function UsersPage({ params }: Props) {
  const { filter } = await params;
  console.log(filter);
  return <UsersSlot />;
}
