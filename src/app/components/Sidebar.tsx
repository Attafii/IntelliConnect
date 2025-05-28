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
  { name: 'Risks', href: '/risks', icon: ShieldExclamationIcon },
  { name: 'Resources', href: '/resources', icon: UsersIcon },
  { name: 'Milestones', href: '/milestones', icon: CalendarDaysIcon },
  { name: 'KPIs', href: '/kpis', icon: ChartBarIcon },
  { name: 'Actions', href: '/actions', icon: ClipboardDocumentCheckIcon },
  { name: 'Intelligence', href: '/intelligence', icon: Lightbulb as any }, // Using 'as any' because Lightbulb is from lucide-react
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      layout
      className={`fixed left-0 top-0 z-40 h-screen ${expanded ? 'w-64' : 'w-20'} 
        bg-white/10 backdrop-blur-md border-r border-white/20 
        flex flex-col transition-all duration-300 ease-in-out`}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {expanded && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="text-xl font-bold text-white"
          >
            IntelliConnect
          </motion.div>
        )}
        <motion.button
          layout
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 ease-in-out"
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        >
          {expanded ? (
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-white" />
          )}
        </motion.button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <motion.div
                  layout
                  className={`flex items-center p-3 rounded-lg text-white 
                    hover:bg-white/10 transition-all duration-300 ease-in-out 
                    ${expanded ? 'justify-start' : 'justify-center'}`}
                  transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                >
                  <item.icon className="h-6 w-6" />
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-3"
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