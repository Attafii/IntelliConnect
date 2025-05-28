'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ResourceUtilizationItem, { ResourceData } from './ResourceUtilizationItem';

interface ResourceUtilizationPanelProps {
  resources: ResourceData[];
  title?: string;
}

const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ResourceUtilizationPanel: React.FC<ResourceUtilizationPanelProps> = ({ 
  resources, 
  title = 'Resource Utilization'
}) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="p-6 bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">No resource data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 md:mb-6">{title}</h2>
      <motion.div
        className="space-y-3 md:space-y-4"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        {resources.map((resource) => (
          <ResourceUtilizationItem key={resource.id} resource={resource} />
        ))}
      </motion.div>
    </div>
  );
};

export default ResourceUtilizationPanel;