'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <motion.div
      layout
      className={`fixed left-0 top-20 z-30 h-[calc(100vh-5rem)] ${expanded ? 'w-72' : 'w-20'} 
        backdrop-blur-3xl border-r border-blue-200/30 shadow-2xl
        flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(239, 246, 255, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '4px 0 24px rgba(59, 130, 246, 0.1)'
      }}
      initial={{ x: -300, opacity: 0 }}
      animate={{ 
        x: isOpen ? 0 : -300, 
        opacity: isOpen ? 1 : 0 
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Blue-themed glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/15 via-white/8 to-sky-100/12 rounded-r-3xl" />
      
      <div className="relative flex items-center justify-between p-6 border-b border-blue-200/30">
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-blue-300 to-sky-500 bg-clip-text text-transparent"
            >
              IntelliConnect
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          layout
          onClick={() => setExpanded(!expanded)}
          className="relative p-3 rounded-2xl backdrop-blur-sm bg-blue-50/40 hover:bg-blue-100/50 border border-blue-200/50 transition-all duration-300 ease-in-out shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeftIcon className="h-5 w-5 text-sky-600" />
          </motion.div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/15 to-blue-300/15 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>

      <nav className="relative flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item, index) => (
            <motion.li 
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link href={item.href}>
                <motion.div
                  layout
                  className={`relative flex items-center p-4 rounded-2xl text-sky-600 
                    backdrop-blur-sm bg-sky-50/20 hover:bg-sky-100/30 border border-sky-200/30
                    hover:text-sky-700 transition-all duration-300 ease-in-out 
                    ${expanded ? 'justify-start' : 'justify-center'} group shadow-lg hover:shadow-xl`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { type: 'spring', stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  {/* Icon container with background glow */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <item.icon className="h-6 w-6 transition-all duration-200" />
                  </motion.div>
                  
                  {/* Background glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/15 via-blue-200/10 to-sky-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 font-semibold text-base"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Hover indicator */}
                  <motion.div
                    className="absolute right-2 w-1 h-8 bg-gradient-to-b from-sky-400 to-sky-600 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}