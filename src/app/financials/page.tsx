'use client';

import RouteTransition from '../components/RouteTransition';
import BudgetActualChart from '../components/BudgetActualChart';
import ContributionMarginChart from '../components/ContributionMarginChart';

const FinancialsPage = () => {
  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Financial Insights
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BudgetActualChart />
          <ContributionMarginChart />
        </div>
        {/* You can add more financial components or data sections here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Key Financial Metrics</h2>
            <p className="text-gray-300">Return on Investment (ROI): 15%</p>
            <p className="text-gray-300">Burn Rate: $25,000/month</p>
            <p className="text-gray-300">Customer Acquisition Cost (CAC): $150</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Revenue Streams</h2>
            <p className="text-gray-300">Product Sales: $350,000</p>
            <p className="text-gray-300">Service Subscriptions: $120,000</p>
            <p className="text-gray-300">Consulting Fees: $30,000</p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default FinancialsPage;