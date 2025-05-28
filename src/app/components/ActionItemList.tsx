'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ActionItemCard, { ActionItem } from './ActionItemCard';

interface ActionItemListProps {
  items: ActionItem[];
  title?: string;
}

const ActionItemList: React.FC<ActionItemListProps> = ({ items, title = "Action Items" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2, // Delay before starting stagger
        staggerChildren: 0.1, // Stagger effect for each card
      },
    },
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-4 bg-card rounded-lg shadow">
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground">No action items to display.</p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-background">
      {title && <h2 className="text-2xl font-bold text-foreground mb-6 px-4 md:px-6">{title}</h2>}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <ActionItemCard key={item.id} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default ActionItemList;