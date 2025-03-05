import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SkipToContent from './SkipToContent';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-app">
      <SkipToContent />
      <Sidebar />
      <div className="lg:pl-20">
        <Header />
        <main 
          id="main-content" 
          className="py-6 sm:py-8 lg:py-10"
          tabIndex={-1} // Makes the main content focusable
        >
          <div className="px-3 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;