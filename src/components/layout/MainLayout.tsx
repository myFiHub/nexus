import React from 'react';
import Navbar from './Navbar';

/**
 * MainLayout wraps all pages, includes Navbar and notification area
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#181A20] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
      {/* Optional Footer */}
      <footer className="w-full py-6 text-center text-neutral-500 text-sm bg-[#181A20] border-t border-[#23263B]">
        © {new Date().getFullYear()} Podium Nexus. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout; 