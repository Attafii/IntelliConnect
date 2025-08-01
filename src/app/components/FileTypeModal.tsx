'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, FileBarChart, Table, Presentation } from 'lucide-react';
import DocumentAnalyzer from './DocumentAnalyzer';

interface FileTypeModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  fileType: 'pdf' | 'csv' | 'excel' | 'powerpoint';
}

const getModalConfig = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
      return {
        title: 'PDF Document Analysis',
        subtitle: 'Extract insights and analyze PDF documents',
        icon: FileText,
        gradient: 'from-red-500 to-orange-500',
        bgGradient: 'from-red-50/90 to-orange-50/90',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        features: [
          'Advanced text extraction',
          'Content summarization',
          'Key insights detection',
          'Q&A capabilities',
          'Document structure analysis'
        ]
      };    case 'csv':
      return {
        title: 'CSV Data Analysis',
        subtitle: 'Parse and analyze structured data',
        icon: Table,
        gradient: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50/90 to-emerald-50/90',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        features: [
          'Data pattern recognition',
          'Statistical analysis',
          'Trend identification',
          'Performance insights',
          'Data visualization insights'
        ]
      };
    case 'excel':
      return {
        title: 'Excel Spreadsheet Analysis',
        subtitle: 'Comprehensive Excel data processing',
        icon: FileBarChart,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50/90 to-cyan-50/90',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        features: [
          'Multi-sheet processing',
          'Formula analysis',
          'Financial calculations',
          'Data validation',
          'Chart interpretation'
        ]
      };    case 'powerpoint':
      return {
        title: 'PowerPoint Presentation Analysis',
        subtitle: 'Extract content from presentations',
        icon: Presentation,
        gradient: 'from-purple-500 to-indigo-500',
        bgGradient: 'from-purple-50/90 to-indigo-50/90',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        features: [
          'Slide content extraction',
          'Presentation flow analysis',
          'Key message identification',
          'Speaker notes processing',
          'Visual element description'
        ]
      };
    default:
      return {
        title: 'Document Analysis',
        subtitle: 'AI-powered document processing',
        icon: Upload,
        gradient: 'from-gray-500 to-gray-600',
        bgGradient: 'from-gray-50/90 to-gray-100/90',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        features: ['Document processing']
      };
  }
};

export default function FileTypeModal({ isOpen, onCloseAction, fileType }: FileTypeModalProps) {
  const config = getModalConfig(fileType);
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseAction}
        />
        
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <div className={`relative overflow-hidden bg-gradient-to-r ${config.gradient} p-8 text-white`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${config.iconBg} rounded-xl`}>
                  <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{config.title}</h2>
                  <p className="text-white/90 mt-1">{config.subtitle}</p>
                </div>
              </div>
                <button
                onClick={onCloseAction}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-2 h-2 ${config.gradient} bg-gradient-to-r rounded-full`}></div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Document Analyzer */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Upload & Analyze</h3>
                <DocumentAnalyzer restrictFileType={fileType} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
