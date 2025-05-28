'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AnimatedChartCard: React.FC<AnimatedChartCardProps> = ({ title, children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl shadow-lg p-6 ${className || ''}`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <div className="h-72 md:h-96"> {/* Default height, can be overridden by child chart component if needed */}
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedChartCard;