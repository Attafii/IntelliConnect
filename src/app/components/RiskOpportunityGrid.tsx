'use client';

import { motion } from 'framer-motion';
import RiskOpportunityCard, { RiskOpportunityItem } from './RiskOpportunityCard';
import React from 'react';

interface RiskOpportunityGridProps {
  items: RiskOpportunityItem[];
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger delay between each card
      delayChildren: 0.2, // Delay before starting the stagger animation
    },
  },
};

const RiskOpportunityGrid: React.FC<RiskOpportunityGridProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <p>No risk or opportunity data available at the moment.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6"
    >
      {items.map((item) => (
        <RiskOpportunityCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
};

export default RiskOpportunityGrid;