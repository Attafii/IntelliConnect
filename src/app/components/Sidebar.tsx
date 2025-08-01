'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  FlagIcon,
  ChartBarIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
  ShieldExclamationIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { Lightbulb } from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
};

const navigation: NavItem[] = [
  { name: 'Overview', href: '/overview', icon: HomeIcon },
  { name: 'Financials', href: '/financials', icon: BanknotesIcon },
  { name: 'Risks', href: '/risks', icon: ShieldExclamationIcon },  { name: 'Resources', href: '/resources', icon: UsersIcon },
  { name: 'Milestones', href: '/milestones', icon: CalendarDaysIcon },
  { name: 'KPIs', href: '/kpis', icon: ChartBarIcon },
  { name: 'Actions', href: '/actions', icon: ClipboardDocumentCheckIcon },
  { name: 'Analytics & Insights', href: '/analytics-insights', icon: Lightbulb as any }, // Using 'as any' because Lightbulb is from lucide-react
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (    <motion.div
      layout
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] ${expanded ? 'w-64' : 'w-20'} 
        bg-white/70 backdrop-blur-xl border-r border-gray-200/40 shadow-lg
        flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
        {expanded && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            IntelliConnect
          </motion.div>
        )}
        <motion.button
          layout
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 ease-in-out"
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        >
          {expanded ? (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          )}
        </motion.button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <motion.div
                  layout
                  className={`flex items-center p-3 rounded-xl text-gray-700 
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/80 
                    hover:text-blue-700 transition-all duration-300 ease-in-out 
                    ${expanded ? 'justify-start' : 'justify-center'} group`}
                  transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-3 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}