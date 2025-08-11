'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  const buttonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  const logoVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl border-b border-sky-100/20 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(240, 249, 255, 0.08) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Blue-themed glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-white/10 to-blue-50/20" />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Left section */}
          <motion.div 
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center">
              <motion.div
                variants={logoVariants}
                initial="rest"
                whileHover="hover"
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Image
                  src="/Navlogo.png"
                  alt="IntelliConnect"
                  width={140}
                  height={36}
                  className="h-10 w-auto"
                />
              </motion.div>
              <div className="ml-8 text-gray-800">
                <motion.h1 
                  className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-blue-800 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {getPageTitle(pathname)}
                </motion.h1>
              </div>
            </div>
          </motion.div>          {/* Right section */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              onClick={onOpenSearch}
              className="relative p-3 rounded-2xl text-sky-500 hover:text-sky-600 backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-sky-100/30 focus:outline-none focus:ring-2 focus:ring-sky-400/20 shadow-lg"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Search className="h-5 w-5" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/8 to-blue-300/8 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              onClick={onToggleChat}
              className="relative p-3 rounded-2xl text-sky-500 hover:text-sky-600 backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-sky-100/30 focus:outline-none focus:ring-2 focus:ring-sky-400/20 shadow-lg"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400 }}
            >
              <MessageCircle className="h-5 w-5" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/8 to-blue-300/8 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <NotificationCenter />

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-sky-200/30 to-transparent mx-2" />

            <motion.button 
              className="relative p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xl border border-white/20"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400 }}
            >
              <User className="h-5 w-5" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
