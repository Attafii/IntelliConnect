'use client';

import { motion } from 'framer-motion';
import { ShieldExclamationIcon, CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface RiskOpportunityItem {
  id: string;
  projectName: string;
  riskCount: number;
  opportunityCount: number;
  mitigationStatus: 'On Track' | 'Needs Attention' | 'At Risk' | 'Completed';
}

interface RiskOpportunityCardProps {
  item: RiskOpportunityItem;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const iconVariants = {
  hover: { scale: 1.2, transition: { type: 'spring', stiffness: 300 } },
  initial: { scale: 1 },
};

const getStatusStyles = (status: RiskOpportunityItem['mitigationStatus']) => {
  switch (status) {
    case 'On Track':
      return { icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
    case 'Needs Attention':
      return { icon: ShieldExclamationIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' };
    case 'At Risk':
      return { icon: ShieldExclamationIcon, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' };
    case 'Completed':
      return { icon: CheckCircleIcon, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' };
    default:
      return { icon: ShieldExclamationIcon, color: 'text-gray-500', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' };
  }
};

const RiskOpportunityCard: React.FC<RiskOpportunityCardProps> = ({ item }) => {
  const statusStyles = getStatusStyles(item.mitigationStatus);
  const StatusIcon = statusStyles.icon;

  return (
    <motion.div
      variants={cardVariants}
      className={`p-5 rounded-xl shadow-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border ${statusStyles.borderColor} hover:shadow-xl transition-all duration-300`}
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 truncate">{item.projectName}</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center p-2 rounded-md bg-black/10 dark:bg-white/5">
          <ShieldExclamationIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.riskCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Risks</span>
          </div>
        </div>
        <div className="flex items-center p-2 rounded-md bg-black/10 dark:bg-white/5">
          <LightBulbIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.opportunityCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Opps</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles.bgColor} ${statusStyles.color}`}>
          {item.mitigationStatus}
        </span>
        <motion.div whileHover="hover" initial="initial" variants={iconVariants}>
          <StatusIcon className={`h-6 w-6 ${statusStyles.color}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RiskOpportunityCard;