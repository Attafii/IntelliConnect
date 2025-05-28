'use client';

import { motion } from 'framer-motion';

type StatusType = 'green' | 'yellow' | 'red';

interface ProjectCardProps {
  name: string;
  status: StatusType;
  statusText: string;
  schedule: string;
  budget: string;
  risk: string;
}

export default function ProjectCard({
  name,
  status,
  statusText,
  schedule,
  budget,
  risk,
}: ProjectCardProps) {
  // Map status to color
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${statusColors[status]} mr-2`}></div>
          <span className="text-sm text-gray-300">{statusText}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Schedule:</span>
          <span className="text-white">{schedule}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Budget:</span>
          <span className="text-white">{budget}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Risk Level:</span>
          <span className="text-white">{risk}</span>
        </div>
      </div>
    </motion.div>
  );
}