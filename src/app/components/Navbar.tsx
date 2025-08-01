'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User, Search, MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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

interface NavbarProps {
  onToggleSidebar?: () => void;
  onToggleChat?: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({ onToggleSidebar, onToggleChat, onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  return (
    <nav className="bg-red-500 border-b border-gray-200 sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Image
                src="/Navlogo.png"
                alt="IntelliConnect"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                {getPageTitle(pathname)}
              </h1>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Search Button */}
            <motion.button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Search...</span>
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 border border-gray-300 rounded">
                Ctrl K
              </kbd>
            </motion.button>

            {/* Chat Button */}
            <motion.button
              onClick={onToggleChat}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NotificationCenter />
            </motion.button>

            {/* Profile */}
            <div className="relative" ref={profileMenuRef}>
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  John Doe
                </span>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Settings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Sign out
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-gray-200"
            >
              <div className="pt-4 pb-3 space-y-1">
                <button
                  onClick={() => {
                    onOpenSearch?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Search className="w-4 h-4 mr-3" />
                  Search
                </button>
                <button
                  onClick={() => {
                    onToggleChat?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Chat Assistant
                </button>
                <button
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowProfileMenu(true);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}