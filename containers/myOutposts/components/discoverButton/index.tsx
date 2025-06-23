import { AppLink } from "app/components/AppLink";

export const DiscoverButton = () => {
  return (
    <AppLink
      href="/all_outposts"
      variant="outline"
      size="default"
      className="  rounded-full text-lg font-semibold shadow-md hover:text-white"
    >
      Discover
    </AppLink>
  );
};
