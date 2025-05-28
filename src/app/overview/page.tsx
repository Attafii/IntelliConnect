'use client';

import { useState, useMemo, useEffect } from 'react';
import RouteTransition from '../components/RouteTransition';
import ProjectGrid, { Project } from '../components/ProjectGrid'; // Import Project type
import ProjectFilters, { FilterValues } from '../components/ProjectFilters';
import RoleSwitcher, { UserRole } from '../components/RoleSwitcher';
import ActionItemList from '../components/ActionItemList';
import { ActionItem } from '../components/ActionItemCard';
import PredictionsPanel from '../components/PredictionsPanel'; // Added import

// Removed hardcoded initialProjects, will be fetched from API

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
    ['All BUs', ...Array.from(new Set(projects.map(p => p.bu).filter(Boolean) as string[])) .sort()],
  [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const statusMatch = filters.status === 'all' || project.statusText === filters.status;
      const riskMatch = filters.risk === 'all' || project.risk === filters.risk;
      const buMatch = filters.bu === 'all' || project.bu === filters.bu;
      return statusMatch && riskMatch && buMatch;
    });
  }, [filters, projects]);

  return (
    <RouteTransition>
      <div className="bg-background/30 backdrop-blur-md rounded-xl p-6 border border-border/50 shadow-xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Project Dashboard</h1>
        
        <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
        <ProjectFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          uniqueStatuses={uniqueStatuses.slice(1)} // Remove 'All Statuses' for the dropdown items
          uniqueRisks={uniqueRisks.slice(1)}     // Remove 'All Risks'
          uniqueBUs={uniqueBUs.slice(1)}         // Remove 'All BUs'
        />
        
        {errorProjects && <div className="text-red-500 text-center py-4">Error loading projects: {errorProjects}</div>}
        <ProjectGrid projects={filteredProjects} currentRole={currentRole} isLoading={isLoadingProjects} />

        <div className="mt-10">
          <PredictionsPanel />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mt-10 mb-6">Action Items</h2>
        <ActionItemList items={sampleActionItems} />
      </div>
    </RouteTransition>
  );
}