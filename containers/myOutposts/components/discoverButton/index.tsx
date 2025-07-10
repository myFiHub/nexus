import { AppLink } from "app/components/AppLink";
import { AppPages } from "app/lib/routes";

export const DiscoverButton = () => {
  return (
    <AppLink
      href={AppPages.allOutposts}
      variant="outline"
      size="default"
      className="  rounded-full text-lg font-semibold shadow-md hover:text-white"
    >
      Discover
    </AppLink>
  );
};
