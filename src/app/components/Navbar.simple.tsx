'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User } from 'lucide-react';
import Image from 'next/image';

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

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Image
              src="/Navlogo.png"
              alt="IntelliConnect"
              width={32}
              height={32}
              className="rounded"
            />
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
