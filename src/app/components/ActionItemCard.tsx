'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export interface ActionItem {
  id: string;
  title: string;
  dueDate: string; // e.g., "2024-08-15"
  status: 'pending' | 'completed' | 'overdue';
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

interface ActionItemCardProps {
  item: ActionItem;
}

const getStatusStyles = (status: ActionItem['status']) => {
  switch (status) {
    case 'completed':
      return { bgColor: 'bg-cap-accent-green/20', textColor: 'text-cap-accent-green', borderColor: 'border-cap-accent-green', Icon: CheckCircleIcon, pulse: false };
    case 'pending':
      return { bgColor: 'bg-cap-secondary-blue/20', textColor: 'text-cap-secondary-blue', borderColor: 'border-cap-secondary-blue', Icon: ClockIcon, pulse: false };
    case 'overdue':
      return { bgColor: 'bg-destructive/20', textColor: 'text-destructive', borderColor: 'border-destructive', Icon: ExclamationCircleIcon, pulse: true };
    default:
      return { bgColor: 'bg-muted', textColor: 'text-muted-foreground', borderColor: 'border-muted', Icon: ClockIcon, pulse: false };
  }
};

const ActionItemCard: React.FC<ActionItemCardProps> = ({ item }) => {
  const { bgColor, textColor, borderColor, Icon, pulse } = getStatusStyles(item.status);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`p-4 rounded-lg shadow-md border ${borderColor} ${bgColor} 
                  hover:shadow-lg hover:border-primary/50 transition-all duration-300 ease-in-out group
                  ${pulse ? 'animate-pulse-gentle' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-md font-semibold ${textColor} group-hover:text-primary transition-colors`}>{item.title}</h3>
          <Icon className={`w-6 h-6 ${textColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
        </div>
        
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <CalendarDaysIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>

        {item.assignee && (
          <p className="text-xs text-muted-foreground mb-1">Assignee: {item.assignee}</p>
        )}
        
        <p className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full self-start mt-1 ${bgColor} ${textColor} border ${borderColor}`}>
          {item.status}
        </p>

        {item.description && (
          <p className="text-xs text-muted-foreground mt-2 pt-1 border-t border-border/50">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ActionItemCard;