'use client';

import { useState } from 'react';
import RouteTransition from '../components/RouteTransition';
import { UsersIcon, CpuChipIcon, DocumentTextIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import ResourceUtilizationPanel from '@/app/components/ResourceUtilizationPanel';
import ResourceAllocationChart from '@/app/components/ResourceAllocationChart';
import ResourceTrends from '@/app/components/ResourceTrends';
import { ResourceData } from '@/app/components/ResourceUtilizationItem';
import { motion } from 'framer-motion';

const sampleResourceData: ResourceData[] = [
  {
    id: 'res-001',
    name: 'Alice Wonderland',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    utilization: 75,
    role: 'Frontend Developer',
    project: 'Project Phoenix',
    availableHours: 40,
    assignedHours: 30,
  },
  {
    id: 'res-002',
    name: 'Bob The Builder',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    utilization: 90,
    role: 'Backend Developer',
    project: 'Project Phoenix',
    availableHours: 40,
    assignedHours: 36,
  },
  {
    id: 'res-003',
    name: 'Carol Danvers',
    avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    utilization: 50,
    role: 'UI/UX Designer',
    project: 'Project Chimera',
    availableHours: 30,
    assignedHours: 15,
  },
  {
    id: 'res-004',
    name: 'David Copperfield',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    utilization: 80,
    role: 'DevOps Engineer',
    project: 'Infrastructure Overhaul',
    availableHours: 40,
    assignedHours: 32,
  },
  {
    id: 'res-005',
    name: 'Eve Harrington',
    avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    utilization: 100,
    role: 'Project Manager',
    project: 'Project Phoenix',
    availableHours: 40,
    assignedHours: 40,
  },
];

interface ResourceCategory {
  name: string;
  icon: typeof UsersIcon;
  count: number;
  details: string[];
  color: string;
}

const resourceCategories: ResourceCategory[] = [
  {
    name: 'Human Resources',
    icon: UsersIcon,
    count: 58,
    details: ['Developers: 25', 'Designers: 10', 'QA: 8', 'PMs: 5', 'Support: 10'],
    color: 'text-blue-600',
  },
  {
    name: 'Technical Infrastructure',
    icon: CpuChipIcon,
    count: 120,
    details: ['Servers: 50', 'Databases: 30', 'Cloud Services: 40'],
    color: 'text-green-600',
  },
  {
    name: 'Documentation & Knowledge',
    icon: DocumentTextIcon,
    count: 1500,
    details: ['Articles: 800', 'Tutorials: 400', 'Guides: 300'],
    color: 'text-amber-600',
  },
  {
    name: 'Physical Assets',
    icon: BuildingLibraryIcon,
    count: 3,
    details: ['Office Buildings: 2', 'Labs: 1'],
    color: 'text-red-600',
  },
];

const resourceAllocationData = [
  { category: 'Development Team', allocated: 45, available: 15, color: '#60a5fa' },
  { category: 'Design Team', allocated: 18, available: 12, color: '#c084fc' },
  { category: 'DevOps Team', allocated: 12, available: 8, color: '#f472b6' },
  { category: 'Management', allocated: 8, available: 2, color: '#818cf8' }
];

const resourceTrendData = Array.from({ length: 12 }, (_, i) => ({
  date: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  utilization: Math.round(65 + Math.random() * 20),
  allocation: Math.round(75 + Math.random() * 15)
}));

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const resourceMetrics = {
    totalResources: resourceCategories.reduce((acc, item) => acc + item.count, 0),
    humanResources: resourceCategories.find(cat => cat.name === 'Human Resources')?.count || 0,
    technicalResources: resourceCategories.find(cat => cat.name === 'Technical Infrastructure')?.count || 0,
    utilizationRate: 85, // Example value, could be calculated from actual data
  };

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
            Resource Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Comprehensive overview of organizational resources with real-time allocation tracking and utilization analysis.
          </p>
        </motion.header>

        {/* Quick Stats Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Total Resources</h3>
            <p className="text-3xl font-bold text-gray-800">{resourceMetrics.totalResources}</p>
            <p className="text-sm text-gray-600 mt-2">Across all categories</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-green-600 mb-2">Team Members</h3>
            <p className="text-3xl font-bold text-gray-800">{resourceMetrics.humanResources}</p>
            <p className="text-sm text-gray-600 mt-2">Active employees</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-amber-600 mb-2">Technical Assets</h3>
            <p className="text-3xl font-bold text-gray-800">{resourceMetrics.technicalResources}</p>
            <p className="text-sm text-gray-600 mt-2">Infrastructure components</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-red-600 mb-2">Utilization Rate</h3>
            <p className="text-3xl font-bold text-gray-800">{resourceMetrics.utilizationRate}%</p>
            <p className="text-sm text-gray-600 mt-2">Average across resources</p>
          </div>
        </motion.div>

        {/* Resource Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {resourceCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <category.icon className={`h-8 w-8 mr-3 ${category.color}`} />
                <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">
                {category.count}
                <span className="text-sm font-normal text-gray-600 ml-2">units</span>
              </p>
              <ul className="space-y-1">
                {category.details?.map((detail, i) => (
                  <li 
                    key={i}
                    className="text-gray-600 text-sm flex items-center"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${category.color.replace('text', 'bg')} mr-2`} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Resource Utilization Panel */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ResourceUtilizationPanel 
            resources={sampleResourceData} 
            title="Team Utilization Overview" 
          />
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          >
            <ResourceAllocationChart data={resourceAllocationData} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          >
            <ResourceTrends data={resourceTrendData} />
          </motion.div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default ResourcesPage;