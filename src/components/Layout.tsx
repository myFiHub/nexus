import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] font-main">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

export default Layout; 