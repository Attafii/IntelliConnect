'use client';

import { useState, useCallback } from 'react';
import RouteTransition from '../components/RouteTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, ChartPieIcon, ArrowTrendingUpIcon, CursorArrowRaysIcon,
  BoltIcon, SparklesIcon, PresentationChartLineIcon, RocketLaunchIcon,
  DocumentArrowUpIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
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

const AnalyticsInsightsPage = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('month');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileAnalysis(files[0]);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileAnalysis(files[0]);
    }
  };

  const handleFileAnalysis = async (file: File) => {
    if (!file || (!file.name.endsWith('.csv') && !file.name.endsWith('.pdf'))) {
      alert('Please upload a CSV or PDF file');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.name.endsWith('.csv') ? 'csv' : 'pdf');

      const response = await fetch('/api/analysis/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const results = await response.json();
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error analyzing file:', error);
      alert('Error analyzing file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
        </motion.header>

        {/* File Analysis Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <DocumentArrowUpIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                File Analysis & Predictions
              </h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                ${isAnalyzing ? 'opacity-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isAnalyzing}
              />
              
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-4 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
                    <p className="text-lg text-gray-600">Analyzing file...</p>
                  </>
                ) : (
                  <>
                    <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drag and drop your file here, or click to select
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Support for CSV and PDF files
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Analysis Results */}
            <AnimatePresence mode="wait">
              {analysisResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Summary */}
                    <div className="bg-white/90 rounded-lg shadow p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        File Summary
                      </h3>
                      <div className="space-y-4">
                        {analysisResults.summary?.projectName && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Project</p>
                            <p className="text-base text-gray-900">{analysisResults.summary.projectName}</p>
                          </div>
                        )}
                        {analysisResults.summary?.timeline && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Timeline</p>
                            <p className="text-base text-gray-900">{analysisResults.summary.timeline}</p>
                          </div>
                        )}
                        {analysisResults.summary?.milestones && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Key Milestones</p>
                            <ul className="list-disc list-inside text-base text-gray-900">
                              {analysisResults.summary.milestones.map((milestone: string, index: number) => (
                                <li key={index}>{milestone}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Predictions & Insights */}
                    <div className="bg-white/90 rounded-lg shadow p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Predictions & Insights
                      </h3>
                      <div className="space-y-4">
                        {analysisResults.insights?.map((insight: any, index: number) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg ${
                              insight.type === 'opportunity' 
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-blue-50 border border-blue-200'
                            }`}
                          >
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          </div>
        </motion.div>
      </div>
    </RouteTransition>
  );
};

export default AnalyticsInsightsPage;