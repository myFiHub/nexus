import { useState } from "react";
import { SettingsOption } from "./SettingsOption";

const popoverOptions = {
  theme: ["Dark", "Light"],
  currency: ["APT", "USD", "EUR"],
  language: ["English", "Spanish", "French"],
};

export const DisplaySection = () => {
  const [theme, setTheme] = useState("Dark");
  const [currency, setCurrency] = useState("APT");
  const [language, setLanguage] = useState("English");

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 text-white">Display</h3>
      <SettingsOption
        label="Theme"
        value={theme}
        options={popoverOptions.theme}
        onChange={setTheme}
      />
      <SettingsOption
        label="Currency"
        value={currency}
        options={popoverOptions.currency}
        onChange={setCurrency}
      />
      <SettingsOption
        label="Language"
        value={language}
        options={popoverOptions.language}
        onChange={setLanguage}
      />
    </div>
  );
};
