import { useState } from "react";
import { Switch } from "../../../components/Switch";

export const NotificationsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 text-foreground">
        Notifications
      </h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground">Email Notifications</span>
        <Switch
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground">Push Notifications</span>
        <Switch
          checked={pushNotifications}
          onCheckedChange={setPushNotifications}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-foreground">Marketing Notifications</span>
        <Switch
          checked={marketingNotifications}
          onCheckedChange={setMarketingNotifications}
        />
      </div>
    </div>
  );
};
