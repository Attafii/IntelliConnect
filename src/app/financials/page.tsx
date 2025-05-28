'use client';

import RouteTransition from '../components/RouteTransition';
import BudgetActualChart from '../components/BudgetActualChart';
import ContributionMarginChart from '../components/ContributionMarginChart';

const FinancialsPage = () => {
  return (
    <RouteTransition>      <div className="p-4 md:p-8 min-h-screen relative">
        {/* Blurred background overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30 -z-10"></div>
        
        <h1 className="text-4xl font-bold mb-8 text-blue-800">
          Financial Analytics Dashboard
        </h1>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$5.2M</p>
            <p className="text-sm text-green-600 mt-2">↑ 12.5% vs last month</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Profit Margin</h3>
            <p className="text-3xl font-bold text-gray-800">28.6%</p>
            <p className="text-sm text-green-600 mt-2">↑ 3.2% vs last month</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Operating Costs</h3>
            <p className="text-3xl font-bold text-gray-800">$1.8M</p>
            <p className="text-sm text-red-600 mt-2">↑ 5.1% vs last month</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">Cash Flow</h3>
            <p className="text-3xl font-bold text-gray-800">$920K</p>
            <p className="text-sm text-green-600 mt-2">↑ 8.3% vs last month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Budget vs. Actual Spending</h2>
            <BudgetActualChart />
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Contribution Margin Analysis</h2>
            <ContributionMarginChart />
          </div>
        </div>

        {/* Detailed Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Key Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700">Return on Investment (ROI)</span>
                <span className="text-blue-600 font-semibold">18.5%</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700">Burn Rate</span>
                <span className="text-blue-600 font-semibold">$22,000/month</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700">Customer Acquisition Cost</span>
                <span className="text-blue-600 font-semibold">$135</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-700">Lifetime Value Ratio</span>
                <span className="text-blue-600 font-semibold">4.2x</span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Revenue Distribution</h2>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Product Sales</span>
                  <span className="text-blue-600 font-semibold">$420,000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Service Subscriptions</span>
                  <span className="text-blue-600 font-semibold">$150,000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Consulting Services</span>
                  <span className="text-blue-600 font-semibold">$30,000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default FinancialsPage;