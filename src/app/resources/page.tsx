'use client';

import RouteTransition from '../components/RouteTransition';
import { UsersIcon, CpuChipIcon, DocumentTextIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import ResourceUtilizationPanel from '@/app/components/ResourceUtilizationPanel';
import { ResourceData } from '@/app/components/ResourceUtilizationItem';

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


const resourceCategories = [
  {
    name: 'Human Resources',
    icon: UsersIcon,
    count: 58,
    details: ['Developers: 25', 'Designers: 10', 'QA: 8', 'PMs: 5', 'Support: 10'],
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    hoverShadow: 'hover:shadow-sky-500/30'
  },
  {
    name: 'Technical Infrastructure',
    icon: CpuChipIcon,
    count: 120,
    details: ['Servers: 50', 'Databases: 30', 'Cloud Services: 40'],
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    hoverShadow: 'hover:shadow-emerald-500/30'
  },
  {
    name: 'Documentation & Knowledge Base',
    icon: DocumentTextIcon,
    count: 1500,
    details: ['Articles: 800', 'Tutorials: 400', 'Guides: 300'],
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    hoverShadow: 'hover:shadow-amber-500/30'
  },
  {
    name: 'Physical Assets',
    icon: BuildingLibraryIcon,
    count: 3,
    details: ['Office Buildings: 2', 'Labs: 1'],
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    hoverShadow: 'hover:shadow-rose-500/30'
  },
];

const ResourcesPage = () => {
  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
          Resource Allocation
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {resourceCategories.map((category, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 ease-out ${category.bgColor} ${category.borderColor} ${category.hoverShadow}`}
            >
              <div className="flex items-center mb-4">
                <category.icon className={`h-8 w-8 mr-3 ${category.color}`} />
                <h2 className={`text-xl font-semibold ${category.color}`}>{category.name}</h2>
              </div>
              <p className="text-3xl font-bold text-gray-100 mb-2">{category.count} <span className="text-sm font-normal text-gray-400">units/items</span></p>
              <ul className="text-gray-300 text-sm space-y-1">
                {category.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
              <button className={`mt-6 ${category.color.replace('text-', 'bg-')}/70 hover:${category.color.replace('text-', 'bg-')}/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm w-full`}>
                Manage {category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Resource Utilization Panel Added Below */}
        <div className="mt-12 max-w-4xl mx-auto">
          <ResourceUtilizationPanel resources={sampleResourceData} title="Team Utilization Overview" />
        </div>

      </div>
    </RouteTransition>
  );
};

export default ResourcesPage;