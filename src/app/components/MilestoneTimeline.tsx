'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MilestoneCard, { Milestone } from './MilestoneCard'; // Assuming MilestoneCard is in the same directory

interface MilestoneTimelineProps {
  milestones: Milestone[];
  title?: string;
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones, title = "Project Milestones" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Stagger effect for each card
        delayChildren: 0.2,
      },
    },
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground">No milestones to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-background">
      {title && <h2 className="text-2xl font-bold text-foreground mb-6 px-4 md:px-6">{title}</h2>}
      <div className="relative">
        <motion.div
          className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-6 scroll-smooth snap-x snap-mandatory 
                     scrollbar-thin scrollbar-thumb-primary/70 scrollbar-track-primary/20 scrollbar-thumb-rounded-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {milestones.map((milestone) => (
            <div key={milestone.id} className="snap-center flex-shrink-0">
              <MilestoneCard milestone={milestone} />
            </div>
          ))}
          {/* Optional: Add a spacer at the end if needed for better scroll snapping on the last item */}
          <div className="flex-shrink-0 w-1 md:w-6 snap-end"></div>
        </motion.div>
        {/* Optional: Left/Right scroll indicators or buttons could be added here */}
      </div>
    </div>
  );
};

export default MilestoneTimeline;