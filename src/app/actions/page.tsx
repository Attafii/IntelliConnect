'use client';

import { useState } from 'react';
import RouteTransition from '../components/RouteTransition';
import { motion } from 'framer-motion';
import { 
  PlusCircleIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon, ArrowPathIcon,
  ExclamationCircleIcon, ClockIcon, UserGroupIcon, DocumentCheckIcon
} from '@heroicons/react/24/outline';

const actionItems = [
  {
    id: 'A001',
    title: 'Finalize Q4 Marketing Budget',
    assignedTo: 'Sarah Miller',
    dueDate: '2023-09-15',
    priority: 'High',
    status: 'In Progress',
    project: 'Marketing Campaign Q4',
  },
  {
    id: 'A002',
    title: 'Develop New User Onboarding Flow',
    assignedTo: 'John Davis',
    dueDate: '2023-10-01',
    priority: 'High',
    status: 'Pending',
    project: 'Product Enhancement Initiative',
  },
  {
    id: 'A003',
    title: 'Conduct Security Audit for API Endpoints',
    assignedTo: 'Tech Team',
    dueDate: '2023-09-20',
    priority: 'Medium',
    status: 'Completed',
    project: 'System Security Upgrade',
  },
  {
    id: 'A004',
    title: 'Update Customer Support Documentation',
    assignedTo: 'Emily White',
    dueDate: '2023-09-30',
    priority: 'Low',
    status: 'Pending',
    project: 'Knowledge Base Refresh',
  },
  {
    id: 'A005',
    title: 'Review and Approve Design Mockups for Mobile App',
    assignedTo: 'Michael Brown',
    dueDate: '2023-09-12',
    priority: 'Medium',
    status: 'In Progress',
    project: 'Mobile App Development v2.0',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'text-green-600';
    case 'In Progress': return 'text-blue-600';
    case 'Pending': return 'text-amber-600';
    default: return 'text-gray-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-600';
    case 'Medium': return 'text-orange-600';
    case 'Low': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-orange-100 text-orange-800';
    case 'Low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ActionsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const metrics = {
    total: actionItems.length,
    completed: actionItems.filter(item => item.status === 'Completed').length,
    inProgress: actionItems.filter(item => item.status === 'In Progress').length,
    pending: actionItems.filter(item => item.status === 'Pending').length,
    highPriority: actionItems.filter(item => item.priority === 'High').length,
  };

  const filteredActions = actionItems.filter(item => {
    if (selectedStatus && item.status !== selectedStatus) return false;
    if (selectedPriority && item.priority !== selectedPriority) return false;
    return true;
  });

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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-800">
              Action Items
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg 
                shadow-lg transition-colors duration-300 flex items-center gap-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              New Action
            </motion.button>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Track and manage action items across all projects and teams.
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
            onClick={() => setSelectedStatus(selectedStatus === 'Completed' ? null : 'Completed')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-green-600 mb-2">Completed</h3>
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.completed}</p>
            <p className="text-sm text-gray-600 mt-2">Done</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'In Progress' ? null : 'In Progress')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-600 mb-2">In Progress</h3>
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.inProgress}</p>
            <p className="text-sm text-gray-600 mt-2">Active</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === 'Pending' ? null : 'Pending')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-600 mb-2">Pending</h3>
              <ArrowPathIcon className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.pending}</p>
            <p className="text-sm text-gray-600 mt-2">Awaiting action</p>
          </div>

          <div 
            className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedPriority(selectedPriority === 'High' ? null : 'High')}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-red-600 mb-2">High Priority</h3>
              <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{metrics.highPriority}</p>
            <p className="text-sm text-gray-600 mt-2">Urgent tasks</p>
          </div>
        </motion.div>

        {/* Filters */}
        {(selectedStatus || selectedPriority) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="text-gray-600">Active filters:</span>
            {selectedStatus && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium flex items-center gap-2">
                {selectedStatus}
                <button 
                  onClick={() => setSelectedStatus(null)}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedPriority && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium flex items-center gap-2">
                {selectedPriority} Priority
                <button 
                  onClick={() => setSelectedPriority(null)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Action Items Table */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Assigned To</th>
                <th scope="col" className="px-6 py-3">Due Date</th>
                <th scope="col" className="px-6 py-3">Priority</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Project</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredActions.map((item) => (
                <motion.tr 
                  key={item.id} 
                  className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors duration-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-gray-700">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-gray-700">{item.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.project}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </RouteTransition>
  );
};

export default ActionsPage;