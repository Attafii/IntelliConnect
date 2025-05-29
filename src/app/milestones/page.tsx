'use client';

import { useState } from 'react';
import RouteTransition from '../components/RouteTransition';
import MilestoneTimeline from '../components/MilestoneTimeline';
import { Milestone } from '../components/MilestoneCard';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Sample data adapted for the new MilestoneTimeline component
const sampleMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Project Alpha - Phase 1',
    date: '2023-08-15',
    status: 'completed',
    description: 'Initial design and prototype development finished ahead of schedule.',
  },
  {
    id: '2',
    name: 'Beta Testing Launch',
    date: '2023-10-01',
    status: 'in-progress',
    description: 'Recruiting beta testers and preparing testing environments.',
  },
  {
    id: '3',
    name: 'Feature X Integration',
    date: '2023-11-20',
    status: 'pending', // Changed from 'Upcoming' to 'pending' to match MilestoneStatus
    description: 'Development of Feature X is on track for November integration.',
  },
  {
    id: '4',
    name: 'Marketing Campaign Kick-off',
    date: '2024-01-10',
    status: 'pending',
    description: 'Planning for the main marketing campaign to start in the new year.',
  },
  {
    id: '5',
    name: 'Seed Funding Secured',
    date: '2023-05-01',
    status: 'completed',
    description: 'Successfully secured seed funding for project initiation.',
  },
  {
    id: '6',
    name: 'EU Regulatory Approval',
    date: '2024-03-01',
    status: 'delayed',
    description: 'Submission delayed due to new documentation requirements.',
  },
  {
    id: '7',
    name: 'User Interface Overhaul',
    date: '2024-05-15',
    status: 'in-progress',
    description: 'Redesigning the user interface for improved user experience based on beta feedback.',
  },
  {
    id: '8',
    name: 'Full Product Launch',
    date: '2024-07-01',
    status: 'pending',
    description: 'Final preparations for the official product launch in Q3.',
  },
];

const MilestonesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Calculate milestone metrics
  const metrics = {
    total: sampleMilestones.length,
    completed: sampleMilestones.filter(m => m.status === 'completed').length,
    inProgress: sampleMilestones.filter(m => m.status === 'in-progress').length,
    pending: sampleMilestones.filter(m => m.status === 'pending').length,
    delayed: sampleMilestones.filter(m => m.status === 'delayed').length,
    completionRate: Math.round((sampleMilestones.filter(m => m.status === 'completed').length / sampleMilestones.length) * 100)
  };

  const filteredMilestones = selectedStatus 
    ? sampleMilestones.filter(m => m.status === selectedStatus)
    : sampleMilestones;

  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen relative">
        {/* Blurred background overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30 -z-10"></div>

        <motion.header 
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-800 mb-4">
            Project Milestones
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Track and monitor key project milestones, deadlines, and progress across all initiatives.
          </p>
        </motion.header>

        {/* Quick Stats Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'completed' ? null : 'completed')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-green-600 mb-2">Completed</h3>
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.completed}</p>
            <p className="text-sm text-gray-600 mt-2">Achieved milestones</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'in-progress' ? null : 'in-progress')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-600 mb-2">In Progress</h3>
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.inProgress}</p>
            <p className="text-sm text-gray-600 mt-2">Active milestones</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'pending' ? null : 'pending')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-600 mb-2">Upcoming</h3>
              <CalendarDaysIcon className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.pending}</p>
            <p className="text-sm text-gray-600 mt-2">Pending milestones</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'delayed' ? null : 'delayed')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-red-600 mb-2">Delayed</h3>
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.delayed}</p>
            <p className="text-sm text-gray-600 mt-2">Delayed milestones</p>
          </div>
        </motion.div>

        {/* Status Filter Indicator */}
        {selectedStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Filtered by:</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </span>
              <button 
                onClick={() => setSelectedStatus(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear filter
              </button>
            </div>
          </motion.div>
        )}

        {/* Milestone Timeline */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MilestoneTimeline 
            milestones={filteredMilestones} 
            title={selectedStatus 
              ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Milestones` 
              : "All Milestones"
            } 
          />
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Progress Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Completion</span>
              <span className="text-gray-800 font-medium">{metrics.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${metrics.completionRate}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {metrics.completed} out of {metrics.total} milestones completed
            </p>
          </div>
        </motion.div>
      </div>
    </RouteTransition>
  );
};

export default MilestonesPage;