import { AppLink } from "app/components/AppLink";
import {
  primaryActionClass,
  secondaryActionClass,
  StatusPage,
} from "app/components/aurora/StatusPage";
import { AppPages } from "app/lib/routes";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <StatusPage
      icon={<Compass className="h-6 w-6" />}
      title="Page not found"
      message="The page you are looking for does not exist or has been moved."
    >
      <AppLink href="/" className={primaryActionClass}>
        Go home
      </AppLink>
      <AppLink href={AppPages.allOutposts} className={secondaryActionClass}>
        Browse outposts
      </AppLink>
    </StatusPage>
  );
}
