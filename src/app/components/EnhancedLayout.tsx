'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ThemeProvider from './ThemeProvider';
import { smartShortcuts } from './SmartShortcuts';
import { personalizedAI } from './PersonalizedAI';
import ShortcutsHelpModal from './ShortcutsHelpModal';
import GlobalSearch from './GlobalSearch';
import ChatbotAssistant from './ChatbotAssistant';
import ThemeSelector from './ThemeSelector';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Smart Shortcuts
    smartShortcuts.setHelpModalCallback(() => setIsShortcutsHelpOpen(true));

    // Initialize Personalized AI
    personalizedAI.initialize();

    // Set up event listeners for shortcuts
    const handleShortcutEvents = (e: CustomEvent) => {
      switch (e.type) {
        case 'smartshortcut:toggle-chat':
          setIsChatOpen(prev => !prev);
          break;
        case 'smartshortcut:show-help':
          setIsShortcutsHelpOpen(true);
          break;
        case 'smartshortcut:global-search':
          setIsGlobalSearchOpen(true);
          break;
        case 'smartshortcut:toggle-sidebar':
          setIsSidebarOpen(prev => !prev);
          break;
        case 'smartshortcut:clear-chat':
          // This will be handled by the ChatbotAssistant
          break;
        case 'smartshortcut:toggle-tts':
          // This will be handled by the ChatbotAssistant
          break;
        case 'smartshortcut:cycle-language':
          // This will be handled by the ChatbotAssistant
          break;
        case 'smartshortcut:cycle-theme':
          // Cycle through themes
          document.dispatchEvent(new CustomEvent('theme:cycle'));
          break;
        case 'smartshortcut:toggle-dark-mode':
          // Toggle dark mode
          document.dispatchEvent(new CustomEvent('theme:toggle-dark'));
          break;
        case 'smartshortcut:export-data':
          handleExportData();
          break;
        case 'smartshortcut:quick-analysis':
          handleQuickAnalysis();
          break;
        case 'smartshortcut:generate-report':
          handleGenerateReport();
          break;
      }
    };

    // Add event listeners
    const events = [
      'smartshortcut:toggle-chat',
      'smartshortcut:show-help',
      'smartshortcut:global-search',
      'smartshortcut:toggle-sidebar',
      'smartshortcut:clear-chat',
      'smartshortcut:toggle-tts',
      'smartshortcut:cycle-language',
      'smartshortcut:cycle-theme',
      'smartshortcut:toggle-dark-mode',
      'smartshortcut:export-data',
      'smartshortcut:quick-analysis',
      'smartshortcut:generate-report'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleShortcutEvents as EventListener);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleShortcutEvents as EventListener);
      });
    };
  }, []);

  // Track page navigation for personalized AI
  useEffect(() => {
    if (pathname) {
      personalizedAI.trackInteraction({
        type: 'navigation',
        details: { page: pathname },
        timestamp: new Date()
      });
    }
  }, [pathname]);

  const handleExportData = () => {
    // Export current page data
    const pageData = {
      page: pathname,
      timestamp: new Date().toISOString(),
      userPreferences: personalizedAI.getUserPreferences()
    };

    const blob = new Blob([JSON.stringify(pageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelliconnect-data-${pathname.replace('/', '')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Track the export action
    personalizedAI.trackInteraction({
      type: 'action',
      details: { action: 'export_data', page: pathname },
      timestamp: new Date()
    });
  };

  const handleQuickAnalysis = () => {
    // Open chat and ask for quick analysis
    setIsChatOpen(true);
    
    // Send a quick analysis request based on current page
    const analysisPrompt = getQuickAnalysisPrompt(pathname);
    
    // Dispatch event to chat component
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('chat:send-message', {
        detail: { message: analysisPrompt }
      }));
    }, 500);

    // Track the analysis request
    personalizedAI.trackInteraction({
      type: 'analysis',
      details: { type: 'quick_analysis', page: pathname },
      timestamp: new Date()
    });
  };

  const handleGenerateReport = () => {
    // Open chat and request a comprehensive report
    setIsChatOpen(true);
    
    const reportPrompt = getReportGenerationPrompt(pathname);
    
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('chat:send-message', {
        detail: { message: reportPrompt }
      }));
    }, 500);

    // Track the report generation
    personalizedAI.trackInteraction({
      type: 'analysis',
      details: { type: 'report_generation', page: pathname },
      timestamp: new Date()
    });
  };

  const getQuickAnalysisPrompt = (path: string): string => {
    const userPrefs = personalizedAI.getUserPreferences();
    const basePrompts = {
      '/overview': 'Provide a quick analysis of the current project overview and highlight any areas that need attention.',
      '/financials': 'Analyze the current financial data and provide insights on budget performance and projections.',
      '/kpis': 'Review the KPI dashboard and identify trends, outliers, or areas for improvement.',
      '/resources': 'Assess resource utilization and team allocation efficiency.',
      '/milestones': 'Evaluate milestone progress and timeline adherence.',
      '/risks': 'Analyze current risks and suggest mitigation strategies.',
      '/intelligence': 'Provide AI-powered insights based on current data patterns.',
      '/': 'Analyze the overall project portfolio and provide strategic insights.'
    };

    let prompt = basePrompts[path as keyof typeof basePrompts] || 'Provide a quick analysis of the current data.';
    
    // Personalize based on user preferences
    if (userPrefs.communication.responseLength === 'brief') {
      prompt += ' Keep the analysis concise and focus on key points.';
    } else if (userPrefs.communication.responseLength === 'detailed') {
      prompt += ' Provide a comprehensive analysis with detailed explanations.';
    }

    if (userPrefs.analysis.focusAreas.includes('financial')) {
      prompt += ' Pay special attention to financial implications.';
    }

    return prompt;
  };

  const getReportGenerationPrompt = (path: string): string => {
    const userPrefs = personalizedAI.getUserPreferences();
    let prompt = `Generate a comprehensive report for the current ${path.replace('/', '')} data. Include key metrics, trends, insights, and recommendations.`;
    
    // Personalize based on user preferences
    if (userPrefs.reporting.format === 'executive') {
      prompt += ' Format this as an executive summary with high-level insights.';
    } else if (userPrefs.reporting.format === 'detailed') {
      prompt += ' Provide a detailed technical report with comprehensive analysis.';
    }

    if (userPrefs.reporting.includeVisualDescriptions) {
      prompt += ' Include descriptions of any charts or visual data.';
    }

    return prompt;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Navigation Header */}
        <Navbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Floating Theme Selector Button */}
        <button
          onClick={() => setIsThemeSelectorOpen(true)}
          className="fixed bottom-4 left-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all z-40"
          title="Theme Settings (Ctrl+Shift+Y)"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </button>

        {/* Floating Shortcuts Help Button */}
        <button
          onClick={() => setIsShortcutsHelpOpen(true)}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          title="Keyboard Shortcuts (Ctrl+Shift+?)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Chatbot Assistant */}
        <ChatbotAssistant 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Modals and Overlays */}
        <ShortcutsHelpModal
          isOpen={isShortcutsHelpOpen}
          onClose={() => setIsShortcutsHelpOpen(false)}
        />

        <GlobalSearch
          isOpen={isGlobalSearchOpen}
          onClose={() => setIsGlobalSearchOpen(false)}
        />

        <ThemeSelector
          isOpen={isThemeSelectorOpen}
          onClose={() => setIsThemeSelectorOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
};

export default EnhancedLayout;
