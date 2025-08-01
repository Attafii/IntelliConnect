'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SimpleNavbar from './SimpleNavbar';
import Sidebar from './Sidebar';
import SplineModels from './SplineModels';
import ChatbotAssistant from './ChatbotAssistant';
import GlobalSearch from './GlobalSearch';
import { NotificationProvider, ToastContainer } from './NotificationSystem';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-200 to-white relative overflow-hidden">
        {/* Spline 3D Models Background */}
        <SplineModels />

        {/* Navigation Header */}
        <SimpleNavbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 pt-20 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}>
            <div className="p-6">
              {children}
            </div>
          </main></div>

        {/* Chatbot Assistant */}
        <ChatbotAssistant 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Global Search */}
        <GlobalSearch 
          isOpen={isGlobalSearchOpen}
          onClose={() => setIsGlobalSearchOpen(false)}
        />

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </NotificationProvider>
  );
};

export default SimpleLayout;
