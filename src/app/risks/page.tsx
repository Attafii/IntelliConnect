'use client';

import RouteTransition from '../components/RouteTransition';
import RiskOpportunityGrid from '@/app/components/RiskOpportunityGrid'; // Adjusted import path
import { RiskOpportunityItem } from '@/app/components/RiskOpportunityCard'; // Adjusted import path

const sampleRiskOpportunityData: RiskOpportunityItem[] = [
  {
    id: 'proj-001',
    projectName: 'Alpha Initiative',
    riskCount: 5,
    opportunityCount: 3,
    mitigationStatus: 'On Track',
  },
  {
    id: 'proj-002',
    projectName: 'Beta Platform Development',
    riskCount: 8,
    opportunityCount: 1,
    mitigationStatus: 'Needs Attention',
  },
  {
    id: 'proj-003',
    projectName: 'Gamma Expansion',
    riskCount: 2,
    opportunityCount: 5,
    mitigationStatus: 'Completed',
  },
  {
    id: 'proj-004',
    projectName: 'Delta System Upgrade',
    riskCount: 12,
    opportunityCount: 2,
    mitigationStatus: 'At Risk',
  },
  {
    id: 'proj-005',
    projectName: 'Epsilon Research Project',
    riskCount: 3,
    opportunityCount: 7,
    mitigationStatus: 'On Track',
  },
  {
    id: 'proj-006',
    projectName: 'Zeta Market Entry',
    riskCount: 6,
    opportunityCount: 4,
    mitigationStatus: 'Needs Attention',
  },
];

const RisksPage = () => {
  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-500">
            Risk & Opportunity Dashboard
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-400 max-w-2xl">
            Overview of project risks and opportunities with current mitigation statuses.
          </p>
        </header>
        <RiskOpportunityGrid items={sampleRiskOpportunityData} />
      </div>
    </RouteTransition>
  );
};

export default RisksPage;