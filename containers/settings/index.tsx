"use client";
import { Button } from "../../components/Button";
import { DisplaySection } from "./components/DisplaySection";
import { NotificationsSection } from "./components/NotificationsSection";
import { PrivacySection } from "./components/PrivacySection";

export const Settings = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="bg-card rounded-2xl p-8 w-full max-w-xl shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-6">Settings</h2>
        <div className="space-y-8">
          <NotificationsSection />
          <DisplaySection />
          <PrivacySection />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-hover">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
