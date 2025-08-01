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
        message: 'Your intelligent document analysis platform is ready to use! New features include Excel and PowerPoint processing.',
        duration: 5000
      });

      // Add system notifications with variety
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'System Status Update',
          message: 'All systems operational. Document analysis API is running smoothly. PDF, CSV, Excel, and PowerPoint processing available.',
          actionLabel: 'View System Status',
          onAction: () => console.log('Navigate to system status')
        });
      }, 1000);

      setTimeout(() => {
        addNotification({
          type: 'warning',
          title: 'Storage Usage Alert',
          message: 'Your document storage is 75% full. Consider archiving old files to free up space.',
          actionLabel: 'Manage Storage',
          onAction: () => console.log('Navigate to storage management')
        });
      }, 2000);

      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'New Feature Available',
          message: 'PowerPoint and Excel analysis is now supported! Upload .pptx and .xlsx files for comprehensive insights.',
          actionLabel: 'Try Now',
          onAction: () => console.log('Navigate to analytics page')
        });
      }, 3000);

      setTimeout(() => {
        addNotification({
          type: 'error',
          title: 'Processing Error',
          message: 'Failed to process document "quarterly-report.pdf". Please check file format and try again.',
          actionLabel: 'Retry Upload',
          onAction: () => console.log('Retry upload process')
        });
      }, 4000);

      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Scheduled Maintenance',
          message: 'System maintenance is scheduled for tonight at 2:00 AM EST. Expected downtime: 30 minutes.',
        });
      }, 5000);

      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'Analysis Complete',
          message: 'Document analysis for "market-research.xlsx" has been completed with 98% confidence score.',
          actionLabel: 'View Results',
          onAction: () => console.log('Navigate to results')
        });
      }, 6000);

    }, 500);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return null; // This component doesn't render anything
}
