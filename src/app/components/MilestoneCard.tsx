'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export interface Milestone {
  id: string;
  name: string;
  date: string; // e.g., "2024-08-15"
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  description?: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
}

const getStatusStyles = (status: Milestone['status']) => {
  switch (status) {
    case 'completed':
      return { bgColor: 'bg-cap-accent-green/20', textColor: 'text-cap-accent-green', borderColor: 'border-cap-accent-green', Icon: CheckCircleIcon };
    case 'in-progress':
      return { bgColor: 'bg-cap-secondary-blue/20', textColor: 'text-cap-secondary-blue', borderColor: 'border-cap-secondary-blue', Icon: ClockIcon };
    case 'pending':
      return { bgColor: 'bg-cap-gray-medium/20', textColor: 'text-cap-gray-medium', borderColor: 'border-cap-gray-medium', Icon: CalendarDaysIcon };
    case 'delayed':
      return { bgColor: 'bg-destructive/20', textColor: 'text-destructive', borderColor: 'border-destructive', Icon: XCircleIcon };
    default:
      return { bgColor: 'bg-muted', textColor: 'text-muted-foreground', borderColor: 'border-muted', Icon: CalendarDaysIcon };
  }
};

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const { bgColor, textColor, borderColor, Icon } = getStatusStyles(milestone.status);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`relative flex-shrink-0 w-64 h-40 p-4 rounded-lg shadow-md 
                  border ${borderColor} ${bgColor} 
                  hover:shadow-cap-blue/40 hover:shadow-lg hover:border-cap-blue 
                  transition-all duration-300 ease-in-out group`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold ${textColor}`}>{milestone.name}</h3>
          <Icon className={`w-6 h-6 ${textColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <CalendarDaysIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{new Date(milestone.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        <p className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full self-start ${bgColor} ${textColor} border ${borderColor}`}>
          {milestone.status.replace('-', ' ')}
        </p>
        {milestone.description && (
          <p className="text-xs text-muted-foreground mt-auto pt-2 truncate group-hover:whitespace-normal group-hover:overflow-visible">
            {milestone.description}
          </p>
        )}
      </div>
      {/* Subtle glow effect on hover */}
      <div 
        className={`absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-cap-blue/50 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out 
                    animate-pulse group-hover:animate-none`}
        style={{ animationDuration: '2s' }}
      /> 
    </motion.div>
  );
};

export default MilestoneCard;