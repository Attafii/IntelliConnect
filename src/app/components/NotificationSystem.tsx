'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // milliseconds, null for persistent
  timestamp: Date;
  read?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  category?: string; // Optional categorization
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // Priority level
}

interface NotificationState {
  notifications: Notification[];
  toasts: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'ADD_TOAST'; payload: Notification }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: NotificationState = {
  notifications: [],
  toasts: []
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      };
    default:
      return state;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  toasts: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  showToast: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      priority: notification.priority || 'medium'
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, []);
  const showToast = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newToast: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      duration: notification.duration ?? 5000,
      priority: notification.priority || 'medium'
    };
    
    dispatch({ type: 'ADD_TOAST', payload: newToast });

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: newToast.id });
      }, newToast.duration);
    }
  }, []);

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    toasts: state.toasts,
    addNotification,
    removeNotification,
    markAsRead,
    clearAllNotifications,
    showToast,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Toast Container Component
export function ToastContainer() {
  const { toasts } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} notification={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual Toast Component
function ToastNotification({ notification }: { notification: Notification }) {
  const { toasts } = useNotifications();

  const removeToast = () => {
    // This will be handled by the auto-removal timeout
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityIndicator = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'medium':
        return 'border-l-4 border-blue-500';
      case 'low':
        return 'border-l-4 border-gray-400';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`max-w-sm w-full bg-white rounded-lg shadow-lg border ${getColorClasses()} ${getPriorityIndicator()} pointer-events-auto overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
                {notification.actionLabel && notification.onAction && (
                  <div className="mt-3">
                    <button
                      onClick={notification.onAction}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
                    >
                      {notification.actionLabel}
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={removeToast}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
