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
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import {
  HomeIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon
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

        {/* Enhanced Header */}
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              className="p-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HomeIcon className="h-12 w-12 text-blue-600" />
            </motion.div>
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gradient-blue">
                Project Overview
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Comprehensive view of all projects, metrics, and action items
              </p>
            </div>
          </div>
        </motion.header>

        {/* Enhanced Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <EnhancedCard 
                variant="glass" 
                hover 
                glow={selectedMetric === metric.title}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMetric === metric.title ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : ''
                }`}
                onClick={() => setSelectedMetric(selectedMetric === metric.title ? null : metric.title)}
              >
                <EnhancedCardHeader>
                  <EnhancedCardTitle gradient>
                    {metric.title}
                  </EnhancedCardTitle>
                  <motion.div
                    className={`p-3 rounded-2xl bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </motion.div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="flex items-end justify-between">
                    <motion.div 
                      className="text-4xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    >
                      {metric.value}
                    </motion.div>
                    <div className={`text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' :
                      metric.change.startsWith('-') ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {metric.change} from last month
                      </motion.span>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          ))}
        </motion.div>        {/* Enhanced Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EnhancedCard variant="glass" className="mb-8">
            <EnhancedCardHeader>
              <EnhancedCardTitle gradient className="flex items-center gap-3">
                <FunnelIcon className="h-6 w-6 text-blue-600" />
                Filters & Controls
              </EnhancedCardTitle>
              <EnhancedButton variant="primary" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </EnhancedButton>
            </EnhancedCardHeader>
            <EnhancedCardContent>
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
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Enhanced Projects Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {errorProjects && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <EnhancedCard variant="glass" className="border-red-300/50 bg-red-50/20">
                <EnhancedCardContent>
                  <div className="flex items-center gap-3 text-red-800">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <span>Error loading projects: {errorProjects}</span>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          )}
          <ProjectGrid 
            projects={filteredProjects} 
            currentRole={currentRole} 
            isLoading={isLoadingProjects} 
          />
        </motion.div>

        {/* Enhanced Predictions Panel */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <EnhancedCard variant="strong" glow>
            <EnhancedCardHeader>
              <EnhancedCardTitle gradient className="flex items-center gap-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
                Predictions & Insights
              </EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <PredictionsPanel />
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Enhanced Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <EnhancedCard variant="glass" hover>
            <EnhancedCardHeader>
              <EnhancedCardTitle gradient className="flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600" />
                Action Items
              </EnhancedCardTitle>
              <EnhancedButton variant="glass" size="sm">
                View All
              </EnhancedButton>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <ActionItemList items={sampleActionItems} />
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>
    </RouteTransition>
  );
}