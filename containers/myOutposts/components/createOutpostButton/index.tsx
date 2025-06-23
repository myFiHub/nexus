import { AppLink } from "app/components/AppLink";

export const CreateOutpostButton = () => {
  return (
    <AppLink
      href="/create_outpost"
      variant="default"
      size="default"
      className="bg-[var(--primary)] text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-[var(--primary-hover)] transition"
    >
      Create an Outpost
    </AppLink>
  );
};
