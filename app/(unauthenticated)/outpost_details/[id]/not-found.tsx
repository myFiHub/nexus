import { AppLink } from "app/components/AppLink";
import { primaryActionClass, StatusPage } from "app/components/aurora/StatusPage";
import { AppPages } from "app/lib/routes";
import { RadioTower } from "lucide-react";

export default function OutpostNotFound() {
  return (
    <StatusPage
      icon={<RadioTower className="h-6 w-6" />}
      tone="violet"
      title="Outpost not found"
      message="The outpost you are looking for does not exist or has been removed."
    >
      <AppLink href={AppPages.allOutposts} className={primaryActionClass}>
        Browse outposts
      </AppLink>
    </StatusPage>
  );
}
