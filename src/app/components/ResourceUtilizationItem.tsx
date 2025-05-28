'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress'; // Shadcn UI Progress
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Shadcn UI Tooltip

export interface ResourceData {
  id: string;
  name: string;
  avatarUrl: string; // URL for the avatar image
  utilization: number; // Percentage 0-100
  role: string;
  project: string;
  availableHours: number;
  assignedHours: number;
}

interface ResourceUtilizationItemProps {
  resource: ResourceData;
}

const ResourceUtilizationItem: React.FC<ResourceUtilizationItemProps> = ({ resource }) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Animate progress bar on mount or when utilization changes
    setProgressValue(resource.utilization);
  }, [resource.utilization]);

  const getBarColor = (utilization: number) => {
    if (utilization > 85) return 'bg-destructive'; // Using theme's destructive color
    if (utilization > 65) return 'bg-cap-accent-orange'; // Using Capgemini accent orange as warning
    return 'bg-primary'; // Using theme's primary color (Capgemini Blue)
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className="flex items-center space-x-3 p-3 bg-card dark:bg-card backdrop-blur-sm rounded-lg shadow hover:shadow-md transition-shadow duration-300 cursor-default border border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image 
              src={resource.avatarUrl || '/user-placeholder.svg'} // Fallback avatar
              alt={`${resource.name}'s avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-border"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">{resource.name}</span>
                <span className={`text-xs font-semibold ${getBarColor(resource.utilization).replace('bg-', 'text-')}`}>
                  {resource.utilization}%
                </span>
              </div>
              <Progress 
                value={progressValue} 
                className="h-2 [&>div]:transition-all [&>div]:duration-[1000ms]"
                indicatorClassName={getBarColor(resource.utilization)}
                aria-label={`${resource.name}'s utilization: ${resource.utilization}%`}
              />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
            sideOffset={5} 
            className="bg-popover text-popover-foreground p-3 rounded-md shadow-xl border border-border text-xs"
            style={{ backdropFilter: 'blur(5px)'}}
        >
            <p className="font-semibold text-sm">{resource.name} - {resource.role}</p>
            <p>Project: {resource.project}</p>
            <p>Assigned: {resource.assignedHours}h / Available: {resource.availableHours}h</p>
            <p className="mt-1 pt-1 border-t border-border">Utilization: <span className={`font-bold ${getBarColor(resource.utilization).replace('bg-', 'text-')}`}>{resource.utilization}%</span></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResourceUtilizationItem;