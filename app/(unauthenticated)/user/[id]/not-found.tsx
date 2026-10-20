import { AppLink } from "app/components/AppLink";
import { primaryActionClass, StatusPage } from "app/components/aurora/StatusPage";
import { UserX } from "lucide-react";

export default function UserNotFound() {
  return (
    <StatusPage
      icon={<UserX className="h-6 w-6" />}
      tone="magenta"
      title="User not found"
      message="The person you are looking for does not exist or has removed their account."
    >
      <AppLink href="/" className={primaryActionClass}>
        Go home
      </AppLink>
    </StatusPage>
  );
}
