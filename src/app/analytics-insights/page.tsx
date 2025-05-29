'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DocumentAnalyzer from '../components/DocumentAnalyzer';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  CpuChipIcon,
  LightBulbIcon,
  ArrowUpTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsInsightsPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'pdf-analysis',
      title: 'PDF Document Analysis',
      description: 'Upload PDF documents and get intelligent insights using AI-powered analysis',
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-purple-600',
      capabilities: [
        'Extract and analyze text content',
        'Answer specific questions about documents',
        'Generate summaries and key insights',
        'Identify important topics and themes'
      ]
    },
    {
      id: 'csv-analytics',
      title: 'CSV Data Analytics',
      description: 'Upload CSV files and get comprehensive data analysis and visualizations',
      icon: ChartBarIcon,
      color: 'from-green-500 to-blue-600',
      capabilities: [
        'Parse and analyze data structures',
        'Generate statistical insights',
        'Identify trends and patterns',
        'Answer questions about your data'
      ]
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      description: 'Leverage advanced AI to generate actionable business intelligence',
      icon: CpuChipIcon,
      color: 'from-purple-500 to-pink-600',
      capabilities: [
        'Context-aware analysis',
        'Multi-format document support',
        'Interactive Q&A capabilities',
        'Automated insight generation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <LightBulbIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your documents into actionable insights with AI-powered analysis. 
            Upload PDFs or CSV files and get intelligent answers to your questions.
          </p>
        </motion.div>

        {selectedFeature ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <button
              onClick={() => setSelectedFeature(null)}
              className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2 rotate-180" />
              Back to Features
            </button>
            <DocumentAnalyzer />
          </motion.div>
        ) : (
          <>
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedFeature(feature.id)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className="p-8">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-3">
                        {feature.capabilities.map((capability, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <SparklesIcon className="h-4 w-4 mr-3 text-blue-500" />
                            {capability}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                          <span>Try it now</span>
                          <ArrowUpTrayIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Start Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <LightBulbIcon className="h-6 w-6 mr-3 text-yellow-500" />
                How It Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <ArrowUpTrayIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Upload Your Document</h3>
                  <p className="text-gray-600 text-sm">
                    Simply drag and drop your PDF or CSV file, or click to browse and select
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <CpuChipIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Ask Questions</h3>
                  <p className="text-gray-600 text-sm">
                    Type your questions about the document content or request specific analysis
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                    <SparklesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Get AI Insights</h3>
                  <p className="text-gray-600 text-sm">
                    Receive intelligent analysis, summaries, and answers powered by advanced AI
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
