'use client';

import { useState, useCallback } from 'react';
import RouteTransition from '../components/RouteTransition';
import FileTypeModal from '../components/FileTypeModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, CursorArrowRaysIcon,
  BoltIcon, SparklesIcon, PresentationChartLineIcon, RocketLaunchIcon,
  DocumentArrowUpIcon, ArrowPathIcon, DocumentTextIcon, TableCellsIcon,
  DocumentChartBarIcon, PresentationChartBarIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for insights
const performanceData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  revenue: Math.floor(75000 + Math.random() * 25000),
  customers: Math.floor(1200 + Math.random() * 300),
  satisfaction: 85 + Math.random() * 10,
}));

const insightCards = [
  {
    title: 'Revenue Trend',
    metric: '+12.5%',
    description: 'Monthly revenue growth compared to last quarter',
    trend: 'up',
    icon: ChartBarIcon,
    color: 'text-blue-600',
    detail: 'Driven by new product launches and increased customer retention'
  },
  {
    title: 'Customer Engagement',
    metric: '89.3%',
    description: 'Active user engagement rate this month',
    trend: 'up',
    icon: CursorArrowRaysIcon,
    color: 'text-green-600',
    detail: 'Improved by enhanced user experience and new features'
  },
  {
    title: 'Operational Efficiency',
    metric: '95.8%',
    description: 'System performance and resource utilization',
    trend: 'up',
    icon: BoltIcon,
    color: 'text-purple-600',
    detail: 'Optimized through AI-driven resource allocation'
  },
  {
    title: 'Innovation Index',
    metric: '78.5',
    description: 'Innovation score based on new features and improvements',
    trend: 'up',
    icon: SparklesIcon,
    color: 'text-amber-600',
    detail: 'Leading the industry in technological advancement'
  }
];

const marketSegmentation = [
  { name: 'Enterprise', value: 45 },
  { name: 'SMB', value: 30 },
  { name: 'Startup', value: 15 },
  { name: 'Individual', value: 10 }
];

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

interface AnalysisResults {
  summary?: {
    projectName?: string;
    timeline?: string;
    milestones?: string[];
  };
  insights?: Array<{
    title: string;
    description: string;
    type: string;
  }>;
}

const AnalyticsInsightsPage = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('month');
  const [activeModal, setActiveModal] = useState<'pdf' | 'csv' | 'excel' | 'powerpoint' | null>(null);

  const openModal = (fileType: 'pdf' | 'csv' | 'excel' | 'powerpoint') => {
    setActiveModal(fileType);
  };

  const closeModal = () => {
    setActiveModal(null);
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
          <div className="flex items-center gap-3 mb-4">
            <PresentationChartLineIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-800">
              Analytics & Insights
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
            Advanced analytics and AI-powered insights to drive informed business decisions.
          </p>
        </motion.header>        {/* Document Analytics Hub */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/10 via-blue-400/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-transparent rounded-full translate-y-40 -translate-x-40 animate-pulse-slower"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white shadow-xl">
                      <DocumentArrowUpIcon className="h-12 w-12" />
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Document Analytics Hub
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Choose your document type and unlock powerful AI-driven insights. 
                  Extract trends, patterns, and actionable recommendations from your data.
                </p>
              </div>
              
              {/* Clickable Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* PDF Analytics Card */}
                <motion.button
                  className="group relative overflow-hidden bg-gradient-to-br from-red-50/90 to-orange-50/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-100/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  onClick={() => openModal('pdf')}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                        <DocumentTextIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">PDF Analysis</h3>
                        <p className="text-sm text-gray-600">Extract insights from documents</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Advanced text extraction</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Content summarization</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        <span>Q&A capabilities</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-red-600 font-medium group-hover:text-red-700">
                      Click to analyze PDF →
                    </div>
                  </div>
                </motion.button>

                {/* CSV Analytics Card */}
                <motion.button
                  className="group relative overflow-hidden bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  onClick={() => openModal('csv')}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                        <TableCellsIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">CSV Analysis</h3>
                        <p className="text-sm text-gray-600">Parse structured data</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>Data pattern recognition</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>Statistical analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>Trend identification</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-green-600 font-medium group-hover:text-green-700">
                      Click to analyze CSV →
                    </div>
                  </div>
                </motion.button>

                {/* Excel Analytics Card */}
                <motion.button
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-50/90 to-cyan-50/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  onClick={() => openModal('excel')}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Excel Analysis</h3>
                        <p className="text-sm text-gray-600">Process spreadsheets</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Multi-sheet processing</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Formula analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>Financial calculations</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-blue-600 font-medium group-hover:text-blue-700">
                      Click to analyze Excel →
                    </div>
                  </div>
                </motion.button>

                {/* PowerPoint Analytics Card */}
                <motion.button
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-50/90 to-indigo-50/90 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  onClick={() => openModal('powerpoint')}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                        <PresentationChartBarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">PowerPoint Analysis</h3>
                        <p className="text-sm text-gray-600">Extract from presentations</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span>Slide content extraction</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span>Key message identification</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span>Speaker notes processing</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-purple-600 font-medium group-hover:text-purple-700">
                      Click to analyze PowerPoint →
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* AI Features Banner */}
              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-purple-100/60 to-blue-100/60 backdrop-blur-sm rounded-2xl border border-purple-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center justify-center gap-4 text-center">
                  <SparklesIcon className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Powered by AI</h4>
                    <p className="text-sm text-gray-600">
                      Advanced language models provide intelligent analysis and actionable insights for all document types
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          className="mb-8 flex justify-end"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-1 flex gap-1">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${timeframe === period 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Insight Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {insightCards.map((insight, index) => (
            <motion.div
              key={index}
              className={`bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 
                cursor-pointer ${selectedInsight === insight.title ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'}`}
              onClick={() => setSelectedInsight(selectedInsight === insight.title ? null : insight.title)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
                <insight.icon className={`h-6 w-6 ${insight.color}`} />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">{insight.metric}</div>
                <div className="text-sm text-gray-600">{insight.description}</div>
              </div>
              {selectedInsight === insight.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-gray-600 pt-3 border-t border-gray-200"
                >
                  {insight.detail}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Revenue Analytics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#revenueGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Segmentation Chart */}
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Market Segmentation</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketSegmentation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketSegmentation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Performance Metrics</h3>
            <RocketLaunchIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#3b82f6" name="Customer Growth" />
                <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>        </motion.div>
      </div>      {/* File Type Modal */}
      {activeModal && (
        <FileTypeModal
          isOpen={!!activeModal}
          onCloseAction={closeModal}
          fileType={activeModal}
        />
      )}
    </RouteTransition>
  );
};

export default AnalyticsInsightsPage;
