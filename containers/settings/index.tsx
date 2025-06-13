"use client";
import { useState } from "react";
import { Button } from "../../components/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Switch } from "../../components/Switch";

const popoverOptions = {
  theme: ["Dark", "Light"],
  currency: ["APT", "USD", "EUR"],
  language: ["English", "Spanish", "French"],
};

export const Settings = () => {
  // For UI only, no logic/state persistence
  const [theme, setTheme] = useState("Dark");
  const [currency, setCurrency] = useState("APT");
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#191A23]">
      <div className="bg-[#23243a] rounded-2xl p-8 w-full max-w-xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#c26bfa] mb-6">Settings</h2>
        <div className="space-y-8">
          {/* Notifications */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-white">
              Notifications
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Email Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Push Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Marketing Notifications</span>
              <Switch />
            </div>
          </div>

          {/* Display */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-white">Display</h3>
            <div className="mb-3">
              <span className="block text-white mb-1">Theme</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-[#181926] text-white rounded-lg px-4 py-2 text-left">
                    {theme}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2 w-48">
                  {popoverOptions.theme.map((option) => (
                    <div
                      key={option}
                      className={`px-3 py-2 rounded hover:bg-[#c26bfa] hover:text-white cursor-pointer ${
                        theme === option
                          ? "bg-[#c26bfa] text-white"
                          : "text-black dark:text-white"
                      }`}
                      onClick={() => setTheme(option)}
                    >
                      {option}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-3">
              <span className="block text-white mb-1">Currency</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-[#181926] text-white rounded-lg px-4 py-2 text-left">
                    {currency}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2 w-48">
                  {popoverOptions.currency.map((option) => (
                    <div
                      key={option}
                      className={`px-3 py-2 rounded hover:bg-[#c26bfa] hover:text-white cursor-pointer ${
                        currency === option
                          ? "bg-[#c26bfa] text-white"
                          : "text-black dark:text-white"
                      }`}
                      onClick={() => setCurrency(option)}
                    >
                      {option}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <span className="block text-white mb-1">Language</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-[#181926] text-white rounded-lg px-4 py-2 text-left">
                    {language}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2 w-48">
                  {popoverOptions.language.map((option) => (
                    <div
                      key={option}
                      className={`px-3 py-2 rounded hover:bg-[#c26bfa] hover:text-white cursor-pointer ${
                        language === option
                          ? "bg-[#c26bfa] text-white"
                          : "text-black dark:text-white"
                      }`}
                      onClick={() => setLanguage(option)}
                    >
                      {option}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-white">Privacy</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Show WalletAddress</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Show Activity</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Show Profile</span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-[#c26bfa] text-white px-6 py-2 rounded-lg hover:bg-[#a259d9]">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
