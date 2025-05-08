import React from 'react';
import Navbar from './Navbar';

/**
 * MainLayout wraps all pages, includes Navbar and notification area
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      {/* Toast/Notification area (to be implemented with global state) */}
      <div id="toast-root" aria-live="polite" />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout; 