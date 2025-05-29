'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RouteTransition from '../components/RouteTransition';
import ProjectGrid, { Project } from '../components/ProjectGrid';
import ProjectFilters, { FilterValues } from '../components/ProjectFilters';
import RoleSwitcher, { UserRole } from '../components/RoleSwitcher';
import ActionItemList from '../components/ActionItemList';
import { ActionItem } from '../components/ActionItemCard';
import PredictionsPanel from '../components/PredictionsPanel';
import {
  HomeIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Sample action items data
const sampleActionItems: ActionItem[] = [
  {
    id: 'action-1',
    title: 'Review Q3 Budget Proposal',
    dueDate: '2024-08-15',
    status: 'pending',
    assignee: 'Alice Wonderland',
  },
  {
    id: 'action-2',
    title: 'Finalize Marketing Campaign Assets',
    dueDate: '2024-07-30',
    status: 'completed',
    assignee: 'Bob The Builder',
  },
  {
    id: 'action-3',
    title: 'Submit Project Milestone Report',
    dueDate: '2024-07-20',
    status: 'overdue',
    assignee: 'Charlie Brown',
  },
  {
    id: 'action-4',
    title: 'Onboard New Team Member',
    dueDate: '2024-08-05',
    status: 'pending',
    assignee: 'Diana Prince',
  },
  {
    id: 'action-5',
    title: 'Client Follow-up Meeting',
    dueDate: '2024-07-15',
    status: 'overdue',
    assignee: 'Edward Scissorhands',
  },
];

export default function OverviewPage() {
  const [filters, setFilters] = useState<FilterValues>({ status: 'all', risk: 'all', bu: 'all' });
  const [currentRole, setCurrentRole] = useState<UserRole>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setErrorProjects(null);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (e: any) {
        console.error("Failed to fetch projects:", e);
        setErrorProjects(e.message || 'Failed to load projects.');
      }
      setIsLoadingProjects(false);
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (filterName: keyof FilterValues, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  const uniqueStatuses = useMemo(() => 
    ['All Statuses', ...Array.from(new Set(projects.map(p => p.statusText))).sort()], 
  [projects]);
  const uniqueRisks = useMemo(() => 
    ['All Risks', ...Array.from(new Set(projects.map(p => p.risk))).sort()], 
  [projects]);
  const uniqueBUs = useMemo(() => 
    ['All BUs', ...Array.from(new Set(projects.map(p => p.bu).filter(Boolean) as string[])).sort()],
  [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const statusMatch = filters.status === 'all' || project.statusText === filters.status;
      const riskMatch = filters.risk === 'all' || project.risk === filters.risk;
      const buMatch = filters.bu === 'all' || project.bu === filters.bu;
      return statusMatch && riskMatch && buMatch;
    });
  }, [filters, projects]);

  const metrics = useMemo(() => [
    {
      title: 'Total Projects',
      value: filteredProjects.length,
      change: '+2',
      icon: ChartBarSquareIcon,
      color: 'blue'
    },
    {
      title: 'Completed',
      value: filteredProjects.filter(p => p.statusText === 'Completed').length,
      change: '+1',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'In Progress',
      value: filteredProjects.filter(p => p.statusText === 'In Progress').length,
      change: '0',
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      title: 'High Risk',
      value: filteredProjects.filter(p => p.risk === 'High').length,
      change: '-1',
      icon: ExclamationTriangleIcon,
      color: 'red'
    }
  ], [filteredProjects]);

  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen relative">
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30 -z-10"></div>

        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <HomeIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-800">
              Project Overview
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Comprehensive view of all projects, metrics, and action items
          </p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              className={`bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all 
                cursor-pointer ${selectedMetric === metric.title ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'}`}
              onClick={() => setSelectedMetric(selectedMetric === metric.title ? null : metric.title)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{metric.title}</h3>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <div className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' :
                  metric.change.startsWith('-') ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {metric.change} from last month
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
            <ProjectFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              uniqueStatuses={uniqueStatuses.slice(1)}
              uniqueRisks={uniqueRisks.slice(1)}
              uniqueBUs={uniqueBUs.slice(1)}
            />
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {errorProjects && (
            <motion.div 
              className="bg-red-50 text-red-800 p-4 rounded-lg mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Error loading projects: {errorProjects}
            </motion.div>
          )}
          <ProjectGrid 
            projects={filteredProjects} 
            currentRole={currentRole} 
            isLoading={isLoadingProjects} 
          />
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Predictions & Insights</h2>
            </div>
            <PredictionsPanel />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Action Items</h2>
            </div>
            <ActionItemList items={sampleActionItems} />
          </div>
        </motion.div>
      </div>
    </RouteTransition>
  );
}