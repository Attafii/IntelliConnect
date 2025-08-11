'use client';

import { useState } from 'react';
import RouteTransition from '../components/RouteTransition';
import KPIComparisonTable from '../components/KPIComparisonTable';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, UserGroupIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, 
         LightBulbIcon, ShieldCheckIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define interfaces
interface KPI {
  id: string;
  name: string;
  target: string;
  actual: string;
  variance: string;
  status: 'positive' | 'negative' | 'neutral';
  numericValue: number;
}

type KPIName = 'Monthly Active Users (MAU)' | 'Customer Churn Rate' | 'Average Revenue Per User (ARPU)' | 'Net Promoter Score (NPS)' | 'Feature Adoption Rate' | 'System Uptime';

// Mock historical data for each KPI
const historicalData: Record<KPIName, number[]> = {
  'Monthly Active Users (MAU)': [12000, 13500, 14200, 14800, 15230],
  'Customer Churn Rate': [3.2, 3.0, 2.8, 2.6, 2.5],
  'Average Revenue Per User (ARPU)': [40.2, 42.1, 43.5, 44.8, 45.5],
  'Net Promoter Score (NPS)': [48, 50, 52, 54, 55],
  'Feature Adoption Rate': [55, 58, 60, 63, 65],
  'System Uptime': [99.95, 99.96, 99.97, 99.97, 99.98]
};

const heatmapData = [
  { label: 'Revenue Growth', value: 23.5 },
  { label: 'Customer Growth', value: 15.8 },
  { label: 'Feature Usage', value: 42.3 },
  { label: 'Support Tickets', value: 127 }
];

const kpiCards = [
  {
    name: 'Monthly Active Users (MAU)',
    value: '15,230',
    target: '20,000',
    trend: 'up',
    change: '+12%',
    icon: UserGroupIcon,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    progress: 76.15, // 15230 / 20000 * 100
  },
  {
    name: 'Customer Churn Rate',
    value: '2.5%',
    target: '< 2%',
    trend: 'down',
    change: '-0.3%',
    icon: ArrowTrendingUpIcon, // Using trending up for reduction goal (good trend)
    iconTransform: 'transform rotate-180', // Visually show downward trend for churn
    color: 'text-green-400', // Green as lower churn is good
    bgColor: 'bg-green-500/10',
    progress: 80, // (1 - (2.5 / 2)) * 100, assuming 2% is 100% target achievement
  },
  {
    name: 'Average Revenue Per User (ARPU)',
    value: '$45.50',
    target: '$50.00',
    trend: 'up',
    change: '+5%',
    icon: CurrencyDollarIcon,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    progress: 91, // 45.50 / 50.00 * 100
  },
  {
    name: 'Net Promoter Score (NPS)',
    value: '55',
    target: '60',
    trend: 'up',
    change: '+3 pts',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    progress: 91.67, // 55 / 60 * 100
  },
  {
    name: 'Feature Adoption Rate',
    value: '65%',
    target: '75%',
    trend: 'up',
    change: '+8%',
    icon: LightBulbIcon,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    progress: 86.67, // 65 / 75 * 100
  },
  {
    name: 'System Uptime',
    value: '99.98%',
    target: '99.99%',
    trend: 'up',
    change: '+0.01%',
    icon: ShieldCheckIcon,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    progress: 99.89, // 99.98 / 99.99 * 100 (approx)
  },
];

// Data for the KPI comparison table
const kpiTableData: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Monthly Active Users (MAU)',
    target: '20,000',
    actual: '15,230',
    variance: '-4,770',
    status: 'negative',
    numericValue: 15230
  },
  {
    id: 'kpi-2',
    name: 'Customer Churn Rate',
    target: '2.0%',
    actual: '2.5%',
    variance: '+0.5%',
    status: 'negative',
    numericValue: 2.5
  },
  {
    id: 'kpi-3',
    name: 'Average Revenue Per User (ARPU)',
    target: '$50.00',
    actual: '$45.50',
    variance: '-$4.50',
    status: 'negative',
    numericValue: 45.5
  },
  {
    id: 'kpi-4',
    name: 'Net Promoter Score (NPS)',
    target: '60',
    actual: '55',
    variance: '-5',
    status: 'neutral',
    numericValue: 55
  },
  {
    id: 'kpi-5',
    name: 'Feature Adoption Rate',
    target: '75%',
    actual: '65%',
    variance: '-10%',
    status: 'negative',
    numericValue: 65
  },
  {
    id: 'kpi-6',
    name: 'System Uptime',
    target: '99.99%',
    actual: '99.98%',
    variance: '-0.01%',
    status: 'neutral',
    numericValue: 99.98
  },
  {
    id: 'kpi-7',
    name: 'Customer Satisfaction Score',
    target: '4.5/5',
    actual: '4.7/5',
    variance: '+0.2',
    status: 'positive',
    numericValue: 4.7
  },
  {
    id: 'kpi-8',
    name: 'Conversion Rate',
    target: '3.5%',
    actual: '4.2%',
    variance: '+0.7%',
    status: 'positive',
    numericValue: 4.2
  },
  {
    id: 'kpi-9',
    name: 'Average Resolution Time',
    target: '< 24 hours',
    actual: '18 hours',
    variance: '-6 hours',
    status: 'positive',
    numericValue: 18
  }
];

// Historical data for trend analysis
const historicalKPIData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  mau: Math.floor(12000 + (Math.random() * 5000)),
  churn: (1.5 + (Math.random() * 2)).toFixed(1),
  arpu: (40 + (Math.random() * 15)).toFixed(2),
  nps: Math.floor(45 + (Math.random() * 20))
}));

const KPIsPage = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPIName | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const overallHealth = {
    performance: 85, // Example percentage
    improvement: '+12%',
    trend: 'up'
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
            Key Performance Indicators
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Monitor and analyze critical business metrics to drive informed decision-making.
          </p>
        </motion.header>

        {/* Overall Health Card */}
        <motion.div
          className="mb-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Overall KPI Health</h2>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{overallHealth.performance}%</span>
                <span className={`text-sm font-medium ${overallHealth.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {overallHealth.improvement}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all
                    ${selectedPeriod === period 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={index}
              className={`bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 
                cursor-pointer ${selectedKPI === kpi.name ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'}`}
              onClick={() => setSelectedKPI(selectedKPI === kpi.name ? null : kpi.name as KPIName)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{kpi.name}</h3>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
                <div className="text-sm text-gray-600">Target: {kpi.target}</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{kpi.progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      kpi.progress >= 90 ? 'bg-green-500' :
                      kpi.progress >= 70 ? 'bg-blue-500' :
                      kpi.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${kpi.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className={`text-sm flex items-center gap-1 
                  ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change} vs last period
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          className="mb-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Historical Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalKPIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mau" 
                  name="Monthly Active Users"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="arpu" 
                  name="ARPU"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="nps" 
                  name="NPS"
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* KPI Table */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <KPIComparisonTable 
            kpis={kpiTableData} 
            title="Detailed KPI Analysis" 
          />
        </motion.div>
      </div>
    </RouteTransition>
  );
};

export default KPIsPage;