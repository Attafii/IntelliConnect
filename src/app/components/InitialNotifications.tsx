'use client';

import { useEffect } from 'react';
import { useNotifications } from './NotificationSystem';

export default function InitialNotifications() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Add some sample notifications when the app loads
    const timer = setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Welcome to IntelliConnect',
        message: 'Your intelligent document analysis platform is ready to use!',
        duration: 5000
      });

      // Add system notifications
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'System Status',
          message: 'All systems operational. Document analysis API is running.',
        });
      }, 1000);

      setTimeout(() => {
        addNotification({
          type: 'warning',
          title: 'Tip',
          message: 'Upload PDF or CSV files to get AI-powered insights and analysis.',
        });
      }, 2000);

    }, 500);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return null; // This component doesn't render anything
}
