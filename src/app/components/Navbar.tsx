'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronDownIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChatbotAssistant from './ChatbotAssistant';
import NotificationCenter from './NotificationCenter';

const getPageTitle = (pathname: string): string => {
  const routes: { [key: string]: string } = {
    '/': 'Overview',
    '/resources': 'Resources',
    '/kpis': 'KPIs & Metrics',
    '/actions': 'Action Items',
    '/analytics-insights': 'Analytics & Insights',
    '/financials': 'Financials',
    '/milestones': 'Milestones',
    '/risks': 'Risks & Opportunities'
  };
  return routes[pathname] || 'Dashboard';
};

export default function Navbar() {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenus = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  return (    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/70 backdrop-blur-lg text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img src="/intlogo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
            <h1 className="ml-4 text-xl font-semibold hidden sm:block">
              {getPageTitle(pathname)}
            </h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-md hover:bg-gray-800"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            )}
          </button>          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <motion.button
              onClick={() => setShowChat(!showChat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.button>

            <NotificationCenter />

            <div className="relative" id="profile-menu">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
                <ChevronDownIcon className="h-4 w-4" />
              </motion.button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="py-1">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <CogIcon className="h-4 w-4" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100">
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setShowChat(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Chat Assistant
              </button>
              <div className="px-3 py-2">
                <NotificationCenter />
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <ChatbotAssistant isOpen={showChat} onClose={() => setShowChat(false)} />
    </nav>
  );
}