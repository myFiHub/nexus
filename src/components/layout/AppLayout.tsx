import React from 'react';
import Navbar from './Navbar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-podium-page-bg text-podium-primary-text">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 