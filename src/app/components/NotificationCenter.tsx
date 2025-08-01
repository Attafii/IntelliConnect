'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './NotificationSystem';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
  TrashIcon,
  CheckIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'warning' | 'info'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'info':
        return <InformationCircleIcon className="h-4 w-4" />;
      default:
        return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100 hover:bg-green-200';
      case 'error':
        return 'text-red-600 bg-red-100 hover:bg-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-100 hover:bg-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 hover:bg-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };
  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.onAction) {
      notification.onAction();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getCategoryCount = (type: string) => {
    if (type === 'all') return notifications.length;
    if (type === 'unread') return unreadCount;
    return notifications.filter(n => n.type === type).length;
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markAsRead(n.id);
    });
  };
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full transition-colors duration-200"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Filter notifications"
                  >
                    <FunnelIcon className="h-4 w-4" />
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Clear all notifications"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 border-b border-gray-200 bg-gray-50"
                >
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'unread', 'success', 'info', 'warning', 'error'] as const).map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          filter === filterType
                            ? 'bg-blue-600 text-white'
                            : filterType === 'unread'
                            ? 'text-purple-600 bg-purple-100 hover:bg-purple-200'
                            : filterType === 'all'
                            ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            : getCategoryColor(filterType)
                        }`}
                      >
                        {filterType === 'all' ? (
                          <ArchiveBoxIcon className="h-3 w-3 mr-1" />
                        ) : filterType === 'unread' ? (
                          <EyeSlashIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <span className="mr-1">{getCategoryIcon(filterType)}</span>
                        )}
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        <span className="ml-1.5 bg-white bg-opacity-30 text-xs px-1.5 py-0.5 rounded-full">
                          {getCategoryCount(filterType)}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  {filter === 'all' ? (
                    <>
                      <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No notifications yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        We'll notify you when something important happens
                      </p>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No {filter} notifications</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try changing the filter to see more notifications
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative px-6 py-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        !notification.read 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`p-2 rounded-full ${
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'error' ? 'bg-red-100' :
                            notification.type === 'warning' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            {getIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-3 text-xs text-gray-400">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatTime(notification.timestamp)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-3">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                  title="Mark as read"
                                >
                                  <CheckIcon className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                                title="Remove notification"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {notification.actionLabel && notification.onAction && (
                        <div className="mt-3 ml-12">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.onAction?.();
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            {notification.actionLabel}
                          </button>
                        </div>
                      )}
                      {!notification.read && (
                        <div className="absolute top-4 right-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark all as read
                  </button>
                  <div className="text-xs text-gray-500">
                    {filteredNotifications.length} of {notifications.length} shown
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
