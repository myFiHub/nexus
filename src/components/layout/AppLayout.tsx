import React from 'react';
import Navbar from './Navbar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)]">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-4">
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 