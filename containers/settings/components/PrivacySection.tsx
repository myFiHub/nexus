import { useState } from "react";
import { Switch } from "../../../components/Switch";

export const PrivacySection = () => {
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 text-foreground">Privacy</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground">Show WalletAddress</span>
        <Switch
          checked={showWalletAddress}
          onCheckedChange={setShowWalletAddress}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground">Show Activity</span>
        <Switch checked={showActivity} onCheckedChange={setShowActivity} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-foreground">Show Profile</span>
        <Switch checked={showProfile} onCheckedChange={setShowProfile} />
      </div>
    </div>
  );
};
