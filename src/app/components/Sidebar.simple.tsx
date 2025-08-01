'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  BanknotesIcon,
  ShieldExclamationIcon,
  UsersIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
};

const navigation: NavItem[] = [
  { name: 'Overview', href: '/overview', icon: HomeIcon },
  { name: 'Financials', href: '/financials', icon: BanknotesIcon },
  { name: 'Risks', href: '/risks', icon: ShieldExclamationIcon },
  { name: 'Resources', href: '/resources', icon: UsersIcon },
  { name: 'Milestones', href: '/milestones', icon: CalendarDaysIcon },
  { name: 'KPIs', href: '/kpis', icon: ChartBarIcon },
  { name: 'Actions', href: '/actions', icon: ClipboardDocumentCheckIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`fixed left-0 top-16 z-40 h-screen ${expanded ? 'w-64' : 'w-20'} 
        bg-white border-r border-gray-200 
        flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {expanded ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 group"
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {expanded && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
