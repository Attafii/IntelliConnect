'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileBarChart, Send, Loader2, CheckCircle, AlertCircle, Download, BarChart3, FileSearch, TrendingUp, Target } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useNotifications } from './NotificationSystem';
import jsPDF from 'jspdf';

interface AnalysisResult {
  reply: string;
  suggestions?: string[];
  extractedText?: string;
  metadata?: {
    fileName: string;
    fileType: string;
    contentLength: number;
    analysisTimestamp: string;
    aiModel: string;
  };
}

interface DocumentAnalyzerProps {
  restrictFileType?: 'pdf' | 'csv' | 'excel' | 'powerpoint' | 'all';
}

type AnalysisType = 'summary' | 'keyPoints' | 'sentiment' | 'comprehensive' | 'trends' | 'recommendations';

export default function DocumentAnalyzer({ restrictFileType = 'all' }: DocumentAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('comprehensive');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification, showToast } = useNotifications();
  // Enhanced file handling with react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      
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
  }, [addNotification, showToast]);  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: restrictFileType === 'pdf' 
      ? { 'application/pdf': ['.pdf'] }
      : restrictFileType === 'csv'
      ? { 'text/csv': ['.csv'] }
      : restrictFileType === 'excel'
      ? { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }
      : restrictFileType === 'powerpoint'
      ? { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'], 'application/vnd.ms-powerpoint': ['.ppt'] }
      : {
          'application/pdf': ['.pdf'],
          'text/csv': ['.csv'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
          'application/vnd.ms-powerpoint': ['.ppt']
        },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      showToast({
        type: 'error',
        title: 'File Upload Error',
        message: error?.message || 'Invalid file format or size',
        duration: 5000
      });
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  };  const validateFile = (file: File): boolean => {
    let allowedTypes: string[] = [];
    let errorMessage = '';
    
    if (restrictFileType === 'pdf') {
      allowedTypes = ['application/pdf'];
      errorMessage = 'Please upload a PDF file only.';
    } else if (restrictFileType === 'csv') {
      allowedTypes = ['text/csv'];
      errorMessage = 'Please upload a CSV file only.';
    } else if (restrictFileType === 'excel') {
      allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      errorMessage = 'Please upload an Excel file (.xlsx or .xls) only.';
    } else if (restrictFileType === 'powerpoint') {
      allowedTypes = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'];
      errorMessage = 'Please upload a PowerPoint file (.pptx or .ppt) only.';
    } else {
      allowedTypes = [
        'application/pdf', 
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint'
      ];
      errorMessage = 'Please upload a PDF, CSV, Excel, or PowerPoint file only.';
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
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
  };const extractTextFromPDF = async (file: File): Promise<string> => {
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    try {
      console.log('🔍 Attempting PDF text extraction...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analysis/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📄 PDF processing response:', data);
        
        if (data.success && data.text && data.text.trim()) {
          // Check if we got actual extracted content
          if (data.metadata?.extractedContent) {
            console.log('✅ PDF text extraction successful!');
            console.log(`📊 Extraction method: ${data.info?.extractionMethod}`);
            console.log(`📝 Characters extracted: ${data.info?.charactersExtracted}`);
            
            showToast({
              type: 'success',
              title: 'PDF Text Extracted',
              message: `Successfully extracted ${data.info?.charactersExtracted || 'text'} characters`,
              duration: 4000
            });
            
            return data.text;
          } else if (data.fallback) {
            console.log('⚠️ PDF extraction fell back to manual input mode');
            
            showToast({
              type: 'warning',
              title: 'Manual Input Required',
              message: 'PDF text extraction was unsuccessful. Please provide content manually.',
              duration: 6000
            });
            
            return data.text;
          } else {
            console.log('✅ PDF processing successful with guidance');
            return data.text;
          }
        }
      } else {
        console.warn('⚠️ Server-side PDF processing failed:', response.status, response.statusText);
      }
      
      // If we reach here, create a basic fallback
      console.log('📋 Using client-side fallback PDF description');
      return createFallbackPDFText(file.name, fileSizeMB);
      
    } catch (error) {
      console.error('❌ PDF extraction error:', error);
      console.log('📋 Using error fallback PDF description');
      
      showToast({
        type: 'error',
        title: 'PDF Processing Error',
        message: 'Unable to process PDF file. Please try again or provide content manually.',
        duration: 5000
      });
      
      return createFallbackPDFText(file.name, fileSizeMB, error);
    }
  };
  const createFallbackPDFText = (fileName: string, fileSizeMB: string, error?: any): string => {
    const errorInfo = error ? `\nError: ${error.message || 'Unknown error occurred'}` : '';
    
    return `PDF Document Analysis Request

Document: ${fileName}
Size: ${fileSizeMB} MB
Upload Date: ${new Date().toLocaleString()}${errorInfo}

Note: This PDF document has been uploaded for analysis. Since automatic text extraction encountered an issue, please provide specific questions about the document content, or describe what type of analysis you need.

For example:
- "Summarize the key findings in this report"
- "Extract the main financial data from this document"
- "What are the recommendations mentioned in this PDF?"
- "Analyze the trends discussed in this document"

The AI will use document analysis capabilities to help answer your questions about the PDF content.`;
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
  };  const extractTextFromExcel = async (file: File): Promise<string> => {
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    try {
      console.log('📊 Attempting Excel text extraction...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analysis/extract-excel', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📈 Excel processing response:', data);
        
        if (data.success && data.text && data.text.trim()) {
          console.log('✅ Excel text extraction successful!');
          console.log(`📊 Sheets processed: ${data.info?.sheetsCount || 'unknown'}`);
          console.log(`📝 Characters extracted: ${data.info?.charactersExtracted || 'unknown'}`);
          
          showToast({
            type: 'success',
            title: 'Excel Data Extracted',
            message: `Successfully processed ${data.info?.sheetsCount || 'Excel'} sheets`,
            duration: 4000
          });
          
          return data.text;
        }
      } else {
        console.warn('⚠️ Server-side Excel processing failed:', response.status, response.statusText);
      }
      
      // Fallback for Excel
      console.log('📋 Using client-side fallback Excel description');
      return createFallbackExcelText(file.name, fileSizeMB);
      
    } catch (error) {
      console.error('❌ Excel extraction error:', error);
      console.log('📋 Using error fallback Excel description');
      
      showToast({
        type: 'error',
        title: 'Excel Processing Error',
        message: 'Unable to process Excel file. Please try again or provide content manually.',
        duration: 5000
      });
      
      return createFallbackExcelText(file.name, fileSizeMB, error);
    }
  };
  const extractTextFromPowerPoint = async (file: File): Promise<string> => {
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    try {
      console.log('📽️ Attempting PowerPoint text extraction...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analysis/extract-powerpoint', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 PowerPoint processing response:', data);
        
        if (data.success && data.text && data.text.trim()) {
          console.log('✅ PowerPoint text extraction successful!');
          console.log(`📊 Slides processed: ${data.info?.slidesCount || 'unknown'}`);
          console.log(`📝 Characters extracted: ${data.info?.charactersExtracted || 'unknown'}`);
          
          showToast({
            type: 'success',
            title: 'PowerPoint Content Extracted',
            message: `Successfully processed ${data.info?.slidesCount || 'PowerPoint'} slides`,
            duration: 4000
          });
          
          return data.text;
        }
      } else {
        console.warn('⚠️ Server-side PowerPoint processing failed:', response.status, response.statusText);
      }
      
      // Fallback for PowerPoint
      console.log('📋 Using client-side fallback PowerPoint description');
      return createFallbackPowerPointText(file.name, fileSizeMB);
      
    } catch (error) {
      console.error('❌ PowerPoint extraction error:', error);
      console.log('📋 Using error fallback PowerPoint description');
      
      showToast({
        type: 'error',
        title: 'PowerPoint Processing Error',
        message: 'Unable to process PowerPoint file. Please try again or provide content manually.',
        duration: 5000
      });
      
      return createFallbackPowerPointText(file.name, fileSizeMB, error);
    }
  };
  const createFallbackExcelText = (fileName: string, fileSizeMB: string, error?: any): string => {
    const errorInfo = error ? `\nError: ${error.message || 'Unknown error occurred'}` : '';
    
    return `Excel Spreadsheet Analysis Request

Document: ${fileName}
Size: ${fileSizeMB} MB
Upload Date: ${new Date().toLocaleString()}${errorInfo}

Note: This Excel spreadsheet has been uploaded for analysis. Since automatic data extraction encountered an issue, please provide specific questions about the spreadsheet content, or describe what type of analysis you need.

For example:
- "Summarize the data trends in this spreadsheet"
- "What are the key metrics shown in this Excel file?"
- "Analyze the financial data and provide insights"
- "Extract the main findings from this data"
- "What patterns can you identify in this dataset?"

The AI will use spreadsheet analysis capabilities to help answer your questions about the Excel content.`;
  };
  const createFallbackPowerPointText = (fileName: string, fileSizeMB: string, error?: any): string => {
    const errorInfo = error ? `\nError: ${error.message || 'Unknown error occurred'}` : '';
    
    return `PowerPoint Presentation Analysis Request

Document: ${fileName}
Size: ${fileSizeMB} MB
Upload Date: ${new Date().toLocaleString()}${errorInfo}

Note: This PowerPoint presentation has been uploaded for analysis. Since automatic content extraction encountered an issue, please provide specific questions about the presentation content, or describe what type of analysis you need.

For example:
- "Summarize the key points from this presentation"
- "What are the main themes discussed in these slides?"
- "Extract the conclusions and recommendations"
- "Analyze the presentation structure and flow"
- "What insights can you provide about this presentation?"

The AI will use presentation analysis capabilities to help answer your questions about the PowerPoint content.`;
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
    setProgress(0);

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
      message: `Processing "${file.name}" with ${analysisType} analysis`
    });

    try {
      let extractedText = '';
      setProgress(20);

      // Extract text based on file type
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === 'text/csv') {
        extractedText = await parseCSV(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        extractedText = await extractTextFromExcel(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file.type === 'application/vnd.ms-powerpoint') {
        extractedText = await extractTextFromPowerPoint(file);
      }

      setProgress(50);
      setExtracting(false);

      // Create enhanced prompt based on analysis type
      let enhancedQuestion = question.trim();
      
      switch (analysisType) {
        case 'summary':
          enhancedQuestion = `Please provide a comprehensive summary of this document. Focus on main points, key findings, and overall conclusions. ${question.trim()}`;
          break;
        case 'keyPoints':
          enhancedQuestion = `Extract and list the key points, important metrics, and critical information from this document. ${question.trim()}`;
          break;
        case 'sentiment':
          enhancedQuestion = `Analyze the sentiment, tone, and emotional aspects of this document. Identify positive, negative, and neutral elements. ${question.trim()}`;
          break;
        case 'trends':
          enhancedQuestion = `Identify trends, patterns, and data insights from this document. Focus on temporal changes, correlations, and forecasting opportunities. ${question.trim()}`;
          break;
        case 'recommendations':
          enhancedQuestion = `Provide specific, actionable recommendations based on this document's content. Include strategic advice, next steps, and implementation suggestions. ${question.trim()}`;
          break;
        case 'comprehensive':
        default:
          enhancedQuestion = `Provide a comprehensive analysis including summary, key insights, trends, risks, opportunities, and recommendations. ${question.trim()}`;
      }

      setProgress(70);

      // Send to AI analysis API
      const response = await fetch('/api/analysis/document-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          extractedText, 
          message: enhancedQuestion,
          question: enhancedQuestion,
          fileName: file.name,
          fileType: file.type,
          analysisType
        })
      });

      setProgress(90);

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const data = await response.json();
      setProgress(100);
      
      setAnalysis({
        reply: data.reply || 'No analysis available',
        suggestions: data.suggestions || [],
        extractedText: extractedText.substring(0, 500) + '...',
        metadata: data.metadata
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
        message: `${analysisType} analysis results are ready for "${file.name}"`
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
  // Save/Export functionality - Generate PDF Report
  const saveAnalysisResults = () => {
    if (!analysis || !file) return;
    
    try {
      // Create new PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = 30;
      
      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 6) => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * lineHeight);
      };
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Analysis Report', margin, yPos);
      yPos += 15;
      
      // Document Information Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Information', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos = addWrappedText(`File Name: ${file.name}`, margin, yPos, maxWidth);
      yPos = addWrappedText(`Analysis Type: ${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}`, margin, yPos, maxWidth);
      yPos = addWrappedText(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yPos, maxWidth);
      
      if (analysis.metadata?.aiModel) {
        yPos = addWrappedText(`AI Model: ${analysis.metadata.aiModel}`, margin, yPos, maxWidth);
      }
      
      if (question.trim()) {
        yPos += 5;
        yPos = addWrappedText(`Question: ${question}`, margin, yPos, maxWidth);
      }
      
      yPos += 15;
      
      // Analysis Results Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analysis Results', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Split analysis text into paragraphs and handle page breaks
      const paragraphs = analysis.reply.split('\n\n');
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          // Check if we need a new page
          if (yPos > 250) {
            pdf.addPage();
            yPos = 30;
          }
          
          yPos = addWrappedText(paragraph.trim(), margin, yPos, maxWidth, 5);
          yPos += 8; // Space between paragraphs
        }
      }
      
      // Suggestions Section (if available)
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        yPos += 10;
        
        // Check if we need a new page
        if (yPos > 230) {
          pdf.addPage();
          yPos = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Suggested Follow-up Questions', margin, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        analysis.suggestions.forEach((suggestion, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 30;
          }
          yPos = addWrappedText(`${index + 1}. ${suggestion}`, margin, yPos, maxWidth);
          yPos += 3;
        });
      }
      
      // Metadata Section (if available)
      if (analysis.metadata) {
        yPos += 15;
        
        // Check if we need a new page
        if (yPos > 220) {
          pdf.addPage();
          yPos = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Analysis Metadata', margin, yPos);
        yPos += 10;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        if (analysis.metadata.contentLength) {
          yPos = addWrappedText(`Content Length: ${analysis.metadata.contentLength} characters`, margin, yPos, maxWidth);
        }
        if (analysis.metadata.analysisTimestamp) {
          yPos = addWrappedText(`Analysis Timestamp: ${analysis.metadata.analysisTimestamp}`, margin, yPos, maxWidth);
        }
      }
        // Footer with page numbers
      const pageCount = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, (pdf as any).internal.pageSize.getHeight() - 10);
        pdf.text('Generated by IntelliConnect Document Analyzer', margin, (pdf as any).internal.pageSize.getHeight() - 10);
      }
      
      // Generate filename and save
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `analysis-${file.name.replace(/\.[^/.]+$/, '')}-${timestamp}.pdf`;
      
      pdf.save(filename);
      
      showToast({
        type: 'success',
        title: 'PDF Report Generated',
        message: `Analysis report saved as ${filename}`,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast({
        type: 'error',
        title: 'PDF Generation Failed',
        message: 'Failed to generate PDF report. Please try again.',
        duration: 4000
      });
    }
  };

  const getAnalysisTypeIcon = (type: AnalysisType) => {
    switch (type) {
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'keyPoints':
        return <FileSearch className="h-4 w-4" />;
      case 'sentiment':
        return <BarChart3 className="h-4 w-4" />;
      case 'trends':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommendations':
        return <Target className="h-4 w-4" />;
      case 'comprehensive':
      default:
        return <FileBarChart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">      {/* File Upload Area */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">
          {restrictFileType === 'pdf' ? 'Upload PDF Document' : 
           restrictFileType === 'csv' ? 'Upload CSV Data' : 
           'Upload Document'}
        </h4>
          <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >          <input {...getInputProps()} />
          
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
          ) : (            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive 
                  ? 'Drop your file here' 
                  : restrictFileType === 'pdf'
                  ? 'Upload PDF file'
                  : restrictFileType === 'csv'
                  ? 'Upload CSV file'
                  : 'Upload PDF or CSV file'
                }
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select • Max 10MB
                {restrictFileType === 'pdf' && ' • PDF documents only'}
                {restrictFileType === 'csv' && ' • CSV data files only'}
              </p>
            </div>
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
      </div>      {/* Analysis Type Selection */}
      {file && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Choose Analysis Type</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { type: 'comprehensive' as const, label: 'Comprehensive', desc: 'Complete analysis with all insights' },
              { type: 'summary' as const, label: 'Summary', desc: 'Main points and conclusions' },
              { type: 'keyPoints' as const, label: 'Key Points', desc: 'Important information and metrics' },
              { type: 'sentiment' as const, label: 'Sentiment', desc: 'Tone and emotional analysis' },
              { type: 'trends' as const, label: 'Trends', desc: 'Patterns and data insights' },
              { type: 'recommendations' as const, label: 'Recommendations', desc: 'Actionable suggestions' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setAnalysisType(option.type)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  analysisType === option.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {getAnalysisTypeIcon(option.type)}
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}      {/* Question Input */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Ask Your Question
        </h4>
        
        <div className="space-y-3">          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={
              restrictFileType === 'pdf' 
                ? "What would you like to know about this PDF? e.g., 'Summarize the key findings' or 'What are the main recommendations?'"
                : restrictFileType === 'csv'
                ? "What insights do you need from this data? e.g., 'Analyze revenue trends' or 'Identify top performing categories'"
                : "What would you like to know about this document? e.g., 'Summarize the key findings' or 'What are the main revenue trends?'"
            }
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

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {extracting ? 'Extracting content...' : 
                   progress < 70 ? 'Processing with AI...' : 
                   progress < 100 ? 'Finalizing results...' : 'Complete!'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
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
          >            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">
                Analysis Results
              </h4>
                <button
                onClick={saveAnalysisResults}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Save as PDF</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getAnalysisTypeIcon(analysisType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis
                      </h4>
                      {analysis.metadata && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {analysis.metadata.aiModel}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {analysis.reply}
                    </div>
                  </div>
                </div>

                {/* Metadata section */}
                {analysis.metadata && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Analysis Details</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">File:</span>
                        <p className="font-medium">{analysis.metadata.fileName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">{analysis.metadata.fileType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Content Length:</span>
                        <p className="font-medium">{analysis.metadata.contentLength.toLocaleString()} chars</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Analyzed:</span>
                        <p className="font-medium">
                          {new Date(analysis.metadata.analysisTimestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
              </div>            </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Sample Questions */}
      {!analysis && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Sample Questions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(restrictFileType === 'pdf' ? [
              "Summarize the main points",
              "What are the key insights?",
              "Identify risks and opportunities", 
              "What recommendations are made?",
              "Extract important metrics",
              "Highlight potential concerns"
            ] : restrictFileType === 'csv' ? [
              "Analyze data trends and patterns",
              "What are the performance metrics?",
              "Identify top and bottom performers",
              "Calculate key statistics",
              "Find data anomalies",
              "What insights can be derived?"
            ] : [
              "Summarize the main points",
              "What are the key insights?",
              "Identify trends and patterns",
              "What recommendations can you make?",
              "Extract important metrics",
              "Highlight potential risks"
            ]).map((sample, index) => (
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
