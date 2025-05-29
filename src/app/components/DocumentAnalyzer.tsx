'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileBarChart, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from './NotificationSystem';

interface AnalysisResult {
  reply: string;
  suggestions?: string[];
  extractedText?: string;
}

export default function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification, showToast } = useNotifications();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        
        // Show success notification
        showToast({
          type: 'success',
          title: 'File Uploaded',
          message: `"${selectedFile.name}" uploaded successfully`,
          duration: 3000
        });
        addNotification({
          type: 'success',
          title: 'Document Uploaded',
          message: `${selectedFile.name} is ready for analysis`
        });
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        
        // Show success notification for file input change
        showToast({
          type: 'success',
          title: 'File Selected',
          message: `"${selectedFile.name}" selected for analysis`,
          duration: 3000
        });
        addNotification({
          type: 'success',
          title: 'Document Selected',
          message: `${selectedFile.name} is ready for analysis`
        });
      }
    }
  };
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'text/csv'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      const errorMessage = 'Please upload a PDF or CSV file only.';
      showToast({
        type: 'error',
        title: 'Invalid File Type',
        message: errorMessage,
        duration: 5000
      });
      return false;
    }

    if (file.size > maxSize) {
      const errorMessage = 'File size must be less than 10MB.';
      showToast({
        type: 'error',
        title: 'File Too Large',
        message: errorMessage,
        duration: 5000
      });
      return false;
    }

    return true;
  };
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // For client-side PDF parsing, we'll use a simple approach
      // In a production environment, you might want to send the file to the server for processing
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analysis/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract PDF text');
      }
      
      const data = await response.json();
      return data.text || 'Could not extract text from PDF';
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      // Fallback: return a message indicating PDF content
      return `PDF Document: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\nNote: Text extraction is being processed. Please describe what you'd like to know about this PDF document.`;
    }
  };
  const parseCSV = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Import papaparse dynamically
      import('papaparse').then((Papa) => {
        Papa.default.parse(file, {
          complete: (results) => {
            try {
              const data = results.data as any[];
              const headers = data[0] || [];
              const rows = data.slice(1, 21); // Show first 20 rows
              
              const formattedText = `CSV Data Analysis:
File: ${file.name}
Headers: ${Array.isArray(headers) ? headers.join(', ') : 'Unable to parse headers'}
Total Rows: ${data.length - 1}
Sample Data (first 20 rows):

${rows.map((row, index) => {
  if (Array.isArray(row) && Array.isArray(headers)) {
    const rowData = headers.reduce((obj, header, idx) => {
      obj[header] = row[idx] || '';
      return obj;
    }, {} as Record<string, any>);
    return `Row ${index + 1}: ${JSON.stringify(rowData)}`;
  }
  return `Row ${index + 1}: ${JSON.stringify(row)}`;
}).join('\n')}`;
              
              resolve(formattedText);
            } catch (error) {
              reject(new Error('Failed to parse CSV data'));
            }
          },
          error: (error) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          },
          header: false,
          skipEmptyLines: true
        });
      }).catch((error) => {
        reject(new Error('Failed to load CSV parser'));
      });
    });
  };
  const analyzeDocument = async () => {
    if (!file || !question.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please upload a file and ask a question.',
        duration: 4000
      });
      return;
    }

    setLoading(true);
    setExtracting(true);
    setAnalysis(null);

    // Show analysis start notification
    showToast({
      type: 'info',
      title: 'Analysis Started',
      message: `Analyzing ${file.name}...`,
      duration: 3000
    });
    addNotification({
      type: 'info',
      title: 'Document Analysis in Progress',
      message: `Processing "${file.name}" with your question: "${question.trim()}"`
    });

    try {
      let extractedText = '';

      // Extract text based on file type
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === 'text/csv') {
        extractedText = await parseCSV(file);
      }

      setExtracting(false);

      // Send to analysis API
      const response = await fetch('/api/analysis/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          extractedText, 
          question: question.trim(),
          fileName: file.name,
          fileType: file.type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const data = await response.json();
      setAnalysis({
        reply: data.reply || 'No analysis available',
        suggestions: data.suggestions || [],
        extractedText: extractedText.substring(0, 500) + '...' // Show preview
      });

      // Show success notification
      showToast({
        type: 'success',
        title: 'Analysis Complete',
        message: `Successfully analyzed ${file.name}`,
        duration: 4000
      });
      addNotification({
        type: 'success',
        title: 'Document Analysis Complete',
        message: `Analysis results are ready for "${file.name}"`
      });

    } catch (error) {
      console.error('Error analyzing document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setAnalysis({
        reply: `Error analyzing document: ${errorMessage}. Please try again.`,
        suggestions: ['Try a different file', 'Check file format', 'Ask a simpler question']
      });

      // Show error notification
      showToast({
        type: 'error',
        title: 'Analysis Failed',
        message: `Failed to analyze ${file.name}: ${errorMessage}`,
        duration: 6000
      });
      addNotification({
        type: 'error',
        title: 'Document Analysis Error',
        message: `Error analyzing "${file.name}": ${errorMessage}`
      });
      
    } finally {
      setLoading(false);
      setExtracting(false);
    }
  };
  const clearAnalysis = () => {
    setFile(null);
    setQuestion('');
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Show clear notification
    showToast({
      type: 'info',
      title: 'Analysis Cleared',
      message: 'Ready for new document analysis',
      duration: 2000
    });
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">1. Upload Your Document</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          
          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-3"
            >
              {file.type === 'application/pdf' ? (
                <FileText className="h-8 w-8 text-red-500" />
              ) : (
                <FileBarChart className="h-8 w-8 text-green-500" />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </motion.div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {dragActive ? 'Drop your file here' : 'Upload PDF or CSV file'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select • Max 10MB
              </p>
            </label>
          )}
        </div>

        {file && (
          <button
            onClick={clearAnalysis}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Remove file and start over
          </button>
        )}
      </div>

      {/* Question Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">2. Ask Your Question</h3>
        
        <div className="space-y-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="What would you like to know about this document? e.g., 'Summarize the key findings' or 'What are the main revenue trends?'"
            disabled={loading}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {question.length}/500 characters
            </p>
            
            <button
              onClick={analyzeDocument}
              disabled={loading || !file || !question.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>
                {extracting ? 'Extracting...' : loading ? 'Analyzing...' : 'Analyze Document'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">3. Analysis Results</h3>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {analysis.reply}
                    </div>
                  </div>
                </div>

                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Suggested follow-up questions:</h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setQuestion(suggestion)}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.extractedText && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                      View extracted text preview
                    </summary>
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 font-mono">
                      {analysis.extractedText}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Questions */}
      {!analysis && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Sample Questions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Summarize the main points",
              "What are the key insights?",
              "Identify trends and patterns",
              "What recommendations can you make?",
              "Extract important metrics",
              "Highlight potential risks"
            ].map((sample, index) => (
              <button
                key={index}
                onClick={() => setQuestion(sample)}
                className="text-left text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-100 p-2 rounded transition-colors"
              >
                • {sample}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
