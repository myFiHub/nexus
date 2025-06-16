import { useState } from "react";
import { Switch } from "../../../components/Switch";

export const PrivacySection = () => {
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 text-white">Privacy</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white">Show WalletAddress</span>
        <Switch
          checked={showWalletAddress}
          onCheckedChange={setShowWalletAddress}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white">Show Activity</span>
        <Switch checked={showActivity} onCheckedChange={setShowActivity} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white">Show Profile</span>
        <Switch checked={showProfile} onCheckedChange={setShowProfile} />
      </div>
    </div>
  );
};
