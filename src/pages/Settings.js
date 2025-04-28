import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function Settings() {
  useApp();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    display: {
      theme: 'dark',
      currency: 'APT',
      language: 'en'
    },
    privacy: {
      showWalletAddress: false,
      showActivity: true,
      showProfile: true
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const handleToggleChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-podium-card-bg rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-podium-text mb-6">Settings</h1>
        
        {saveMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            {saveMessage}
          </div>
        )}
        
        {/* Notifications Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-podium-text mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.email}
                  onChange={() => handleToggleChange('notifications', 'email')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.push}
                  onChange={() => handleToggleChange('notifications', 'push')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Marketing Communications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.marketing}
                  onChange={() => handleToggleChange('notifications', 'marketing')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Display Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-podium-text mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-podium-text mb-2">Theme</label>
              <select 
                className="input"
                value={settings.display.theme}
                onChange={(e) => handleSelectChange('display', 'theme', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-podium-text mb-2">Currency</label>
              <select 
                className="input"
                value={settings.display.currency}
                onChange={(e) => handleSelectChange('display', 'currency', e.target.value)}
              >
                <option value="APT">APT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-podium-text mb-2">Language</label>
              <select 
                className="input"
                value={settings.display.language}
                onChange={(e) => handleSelectChange('display', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-podium-text mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Show Wallet Address</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.privacy.showWalletAddress}
                  onChange={() => handleToggleChange('privacy', 'showWalletAddress')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Show Activity</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.privacy.showActivity}
                  onChange={() => handleToggleChange('privacy', 'showActivity')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-podium-text">Show Profile</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.privacy.showProfile}
                  onChange={() => handleToggleChange('privacy', 'showProfile')}
                />
                <div className="w-11 h-6 bg-podium-secondary-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-podium-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-podium-primary-blue"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            className="btn-primary"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Saving...
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings; 