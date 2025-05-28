'use client';

import RouteTransition from '../components/RouteTransition';
import RiskOpportunityGrid from '@/app/components/RiskOpportunityGrid';
import { RiskOpportunityItem } from '@/app/components/RiskOpportunityCard';
import { motion } from 'framer-motion';

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
  const riskMetrics = {
    totalRisks: sampleRiskOpportunityData.reduce((acc, item) => acc + item.riskCount, 0),
    totalOpportunities: sampleRiskOpportunityData.reduce((acc, item) => acc + item.opportunityCount, 0),
    atRiskProjects: sampleRiskOpportunityData.filter(item => item.mitigationStatus === 'At Risk').length,
    completedMitigations: sampleRiskOpportunityData.filter(item => item.mitigationStatus === 'Completed').length,
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
            Risk & Opportunity Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Comprehensive overview of project risks and opportunities with real-time mitigation tracking and analysis.
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
            <h3 className="text-sm font-semibold text-red-600 mb-2">Active Risks</h3>
            <p className="text-3xl font-bold text-gray-800">{riskMetrics.totalRisks}</p>
            <p className="text-sm text-gray-600 mt-2">Across all projects</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-green-600 mb-2">Opportunities</h3>
            <p className="text-3xl font-bold text-gray-800">{riskMetrics.totalOpportunities}</p>
            <p className="text-sm text-gray-600 mt-2">Growth potential identified</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-amber-600 mb-2">At Risk Projects</h3>
            <p className="text-3xl font-bold text-gray-800">{riskMetrics.atRiskProjects}</p>
            <p className="text-sm text-gray-600 mt-2">Requiring immediate attention</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Mitigations Complete</h3>
            <p className="text-3xl font-bold text-gray-800">{riskMetrics.completedMitigations}</p>
            <p className="text-sm text-gray-600 mt-2">Successfully addressed</p>
          </div>
        </motion.div>

        {/* Risk Status Summary */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-blue-800">Risk Status Distribution</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="bg-green-500 h-full" style={{ width: '40%' }}></div>
                <div className="bg-amber-500 h-full" style={{ width: '35%' }}></div>
                <div className="bg-red-500 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">On Track</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <span className="text-gray-700">Needs Attention</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-700">At Risk</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Risk & Opportunity Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-blue-800">Project Risk Analysis</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg">
            <RiskOpportunityGrid items={sampleRiskOpportunityData} />
          </div>
        </motion.div>
      </div>
    </RouteTransition>
  );
};

export default RisksPage;