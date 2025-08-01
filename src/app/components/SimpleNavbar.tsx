'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User, Search, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import NotificationCenter from './NotificationCenter';

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/overview': 'Overview',
    '/financials': 'Financials',
    '/kpis': 'KPIs',
    '/resources': 'Resources',
    '/milestones': 'Milestones',
    '/risks': 'Risks & Opportunities',
    '/intelligence': 'Business Intelligence'
  };
  return routes[pathname] || 'Dashboard';
};

interface SimpleNavbarProps {
  onToggleSidebar?: () => void;
  onToggleChat?: () => void;
  onOpenSearch?: () => void;
}

export default function SimpleNavbar({ onToggleSidebar, onToggleChat, onOpenSearch }: SimpleNavbarProps) {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/80 via-blue-50/70 to-white/80 backdrop-blur-2xl border-b border-white/20 shadow-lg transform transition-all duration-500 ease-out animate-slideDown">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-18">
          {/* Left section */}
          <div className="flex items-center animate-fadeInLeft">
            <div className="flex items-center">
              <Image
                src="/Navlogo.png"
                alt="IntelliConnect"
                width={140}
                height={36}
                className="h-9 w-auto transform hover:scale-105 transition-transform duration-300"
              />
              <div className="ml-6 text-gray-800">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse-subtle">{getPageTitle(pathname)}</h1>
              </div>
            </div>
          </div>          {/* Right section */}
          <div className="flex items-center space-x-3 animate-fadeInRight">
            <button
              onClick={onOpenSearch}
              className="p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={onToggleChat}
              className="p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <NotificationCenter />

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent mx-3"></div>

            <button className="p-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
