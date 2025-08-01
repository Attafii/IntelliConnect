'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentArrowUpIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import * as pdfjs from 'pdfjs-dist';
import Papa from 'papaparse';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface ParsedData {
  type: 'pdf' | 'csv';
  content: string;
  fileName: string;
  summary?: string;
}

export default function EnhancedDocumentAnalyzer() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Extract text from PDF
  const extractPdfText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  // Parse CSV file
  const parseCSV = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          try {
            // Convert parsed data to readable format
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1) as string[][];
            
            let content = `CSV Data Summary:\n`;
            content += `Headers: ${headers.join(', ')}\n`;
            content += `Total Rows: ${rows.length}\n\n`;
            content += `Sample Data:\n`;
            
            // Add first 5 rows as sample
            rows.slice(0, 5).forEach((row, index) => {
              content += `Row ${index + 1}:\n`;
              headers.forEach((header, headerIndex) => {
                content += `  ${header}: ${row[headerIndex] || 'N/A'}\n`;
              });
              content += '\n';
            });
            
            if (rows.length > 5) {
              content += `... and ${rows.length - 5} more rows\n`;
            }
            
            resolve(content);
          } catch (error) {
            reject(error);
          }
        },
        header: false,
        skipEmptyLines: true,
        error: (error) => {
          reject(error);
        }
      });
    });
  };

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
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file || (!file.name.endsWith('.pdf') && !file.name.endsWith('.csv'))) {
      alert('Please upload a PDF or CSV file');
      return;
    }

    setIsProcessing(true);
    setParsedData(null);
    setAnalysis('');

    try {
      let content = '';
      let type: 'pdf' | 'csv';

      if (file.name.endsWith('.pdf')) {
        content = await extractPdfText(file);
        type = 'pdf';
      } else {
        content = await parseCSV(file);
        type = 'csv';
      }

      const summary = `File: ${file.name}\nType: ${type.toUpperCase()}\nSize: ${(file.size / 1024).toFixed(2)} KB\nContent Preview: ${content.substring(0, 200)}...`;

      setParsedData({
        type,
        content,
        fileName: file.name,
        summary
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeDocument = async () => {
    if (!parsedData || !question.trim()) {
      alert('Please upload a document and enter a question');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analysis/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedText: parsedData.content,
          question: question.trim(),
          fileType: parsedData.type,
          fileName: parsedData.fileName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }      const result = await response.json();
      console.log('API Response:', result); // Debug log
      setAnalysis(result.reply || result.analysis || 'No analysis available');
    } catch (error) {
      console.error('Error analyzing document:', error);
      setAnalysis(`Error analyzing document: ${error.message}. Please check your network connection and try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* File Upload Area - Modern Design */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 transform ${
          dragActive 
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 scale-[1.02] shadow-xl' 
            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''} 
        bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl"></div>
        </div>        <input
          type="file"
          accept=".pdf,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        
        <label
          htmlFor="file-upload"
          className="relative z-10 flex flex-col items-center gap-6 cursor-pointer group"
        >
          {isProcessing ? (
            <>
              <div className="relative">
                <ArrowPathIcon className="h-16 w-16 text-purple-500 animate-spin" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700 mb-2">Processing your document...</p>
                <p className="text-sm text-gray-500">Extracting and analyzing content</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <DocumentArrowUpIcon className="relative h-16 w-16 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                  Upload PDF or CSV Document
                </p>
                <p className="text-sm text-gray-500 max-w-md">
                  Drag and drop your files here, or click to browse • Supports up to 10MB
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                    <DocumentTextIcon className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-700">PDF</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <TableCellsIcon className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">CSV</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </label>
      </div>      {/* File Info - Enhanced Design */}
      <AnimatePresence>
        {parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-2xl p-8 border border-emerald-200/50 shadow-xl"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${
                  parsedData.type === 'pdf' 
                    ? 'bg-red-500/10 text-red-600' 
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {parsedData.type === 'pdf' ? (
                    <DocumentTextIcon className="h-8 w-8" />
                  ) : (
                    <TableCellsIcon className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    File Processed Successfully
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-gray-600">Ready for AI-powered analysis</p>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">File Name</p>
                    <p className="font-semibold text-gray-800 truncate">{parsedData.fileName}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                    <p className="font-semibold text-gray-800">{parsedData.type.toUpperCase()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                    <p className="font-semibold text-emerald-600">Ready</p>
                  </div>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded-lg">
                    {parsedData.summary}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Question Input - Modern Design */}
      {parsedData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl text-white shadow-lg">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Ask Questions About Your Document
                </h3>
                <p className="text-gray-600">Get AI-powered insights and analysis</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What insights can you provide about this document?"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && analyzeDocument()}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <SparklesIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={analyzeDocument}
                  disabled={isAnalyzing || !question.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <ArrowPathIcon className="h-6 w-6 animate-spin" />
                      <span className="font-semibold">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-6 w-6" />
                      <span className="font-semibold">Analyze</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset Questions - Enhanced */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>Quick questions:</span>
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { text: "Summarize the key findings", icon: "📊" },
                    { text: "What are the main trends?", icon: "📈" },
                    { text: "Identify risks and opportunities", icon: "⚡" },
                    { text: "Extract financial metrics", icon: "💰" },
                    { text: "Provide actionable recommendations", icon: "🎯" }
                  ].map((preset) => (
                    <button
                      key={preset.text}
                      onClick={() => setQuestion(preset.text)}
                      className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        {preset.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                        {preset.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}      {/* Analysis Results - Ultra Modern Design */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-8 shadow-2xl border border-purple-200/50"
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-300/20 to-transparent rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30"></div>
                    <div className="relative p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white shadow-xl">
                      <SparklesIcon className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    AI Analysis Results
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-pink-500 rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </h3>
                  <p className="text-gray-600 text-lg">Powered by Generative Engine API</p>
                </div>
              </div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
                {/* Content Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Live Analysis</span>
                  <div className="ml-auto text-xs text-gray-500 font-mono">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {analysis}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                    </button>
                  </div>
                  <button 
                    onClick={() => setQuestion('')}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    Ask Another Question
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
