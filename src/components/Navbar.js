import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-podium-card-bg border-b border-podium-card-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-podium-primary-blue">
              Podium Nexus
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profile')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/settings')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 