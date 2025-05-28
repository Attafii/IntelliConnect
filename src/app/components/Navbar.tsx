'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, HomeIcon, XMarkIcon, ChevronDownIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChatbotAssistant from './ChatbotAssistant';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Project Update',
    description: 'New milestone achieved in Project Phoenix',
    time: '2 minutes ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Resource Alert',
    description: 'Server utilization reached 85%',
    time: '1 hour ago',
    isRead: false,
    type: 'warning'
  },
  {
    id: '3',
    title: 'Team Meeting',
    description: 'Weekly sync at 2:00 PM',
    time: '3 hours ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '4',
    title: 'System Error',
    description: 'Database connection timeout detected',
    time: '5 hours ago',
    isRead: true,
    type: 'error'
  }
];

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const refreshNotifications = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getNotificationIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-blue-400';
    }
  };

  useEffect(() => {
    const closeMenus = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#notification-menu')) {
        setShowNotifications(false);
      }
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
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <motion.button
              onClick={() => setShowChat(!showChat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200
                              ${notification.isRead ? 'opacity-75' : 'opacity-100'} ${getNotificationStyles(notification.type)}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className={`w-2 h-2 mt-2 rounded-full ${getNotificationIconColor(notification.type)} flex-shrink-0`} />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
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
      </div>

      {/* Mobile menu */}
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
              <button
                onClick={() => {
                  setShowNotifications(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
              >
                <BellIcon className="h-5 w-5 mr-3" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
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