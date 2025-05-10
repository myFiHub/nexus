import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';

const initialSettings = {
  notifications: {
    email: true,
    push: false,
    marketing: false,
  },
  display: {
    theme: 'dark',
    currency: 'APT',
    language: 'en',
  },
  privacy: {
    showWalletAddress: false,
    showActivity: true,
    showProfile: true,
  },
};

const themeOptions = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
  { label: 'System', value: 'system' },
];
const currencyOptions = [
  { label: 'APT', value: 'APT' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
];
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
];

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleToggle = (category: keyof typeof settings, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleSelect = (category: keyof typeof settings, setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Settings</h1>

        {saveMessage && (
          <div className="bg-[var(--color-success)] bg-opacity-10 border border-[var(--color-success)] text-[var(--color-success)] px-4 py-3 rounded mb-6">
            {saveMessage}
          </div>
        )}

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            {['email', 'push', 'marketing'].map((setting) => (
              <div key={setting} className="flex items-center justify-between">
                <span className="text-[var(--color-text-main)] capitalize">{setting} Notifications</span>
                <button
                  type="button"
                  aria-pressed={settings.notifications[setting]}
                  onClick={() => handleToggle('notifications', setting)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${settings.notifications[setting] ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'}`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${settings.notifications[setting] ? 'translate-x-6' : ''}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Display */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[var(--color-text-main)] mb-2">Theme</label>
              <Select
                options={themeOptions}
                value={settings.display.theme}
                onChange={(e) => handleSelect('display', 'theme', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[var(--color-text-main)] mb-2">Currency</label>
              <Select
                options={currencyOptions}
                value={settings.display.currency}
                onChange={(e) => handleSelect('display', 'currency', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[var(--color-text-main)] mb-2">Language</label>
              <Select
                options={languageOptions}
                value={settings.display.language}
                onChange={(e) => handleSelect('display', 'language', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            {['showWalletAddress', 'showActivity', 'showProfile'].map((setting) => (
              <div key={setting} className="flex items-center justify-between">
                <span className="text-[var(--color-text-main)] capitalize">{setting.replace('show', 'Show ')}</span>
                <button
                  type="button"
                  aria-pressed={settings.privacy[setting]}
                  onClick={() => handleToggle('privacy', setting)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${settings.privacy[setting] ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'}`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${settings.privacy[setting] ? 'translate-x-6' : ''}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings; 