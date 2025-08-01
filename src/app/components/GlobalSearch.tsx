/**
 * Global Search Component - Quick search across all data
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'financial' | 'resource' | 'milestone' | 'risk' | 'kpi' | 'page';
  url: string;
  category: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Sample data for search - in a real app, this would come from APIs
  const searchableData: SearchResult[] = [
    // Pages
    { id: 'page-overview', title: 'Project Overview', description: 'Main dashboard with project insights', type: 'page', url: '/overview', category: 'Navigation' },
    { id: 'page-projects', title: 'Projects', description: 'Manage and view all projects', type: 'page', url: '/', category: 'Navigation' },
    { id: 'page-financials', title: 'Financial Analysis', description: 'Financial reports and analysis', type: 'page', url: '/financials', category: 'Navigation' },
    { id: 'page-kpis', title: 'KPIs Dashboard', description: 'Key performance indicators', type: 'page', url: '/kpis', category: 'Navigation' },
    { id: 'page-resources', title: 'Resource Management', description: 'Team and resource allocation', type: 'page', url: '/resources', category: 'Navigation' },
    { id: 'page-milestones', title: 'Milestones', description: 'Project milestones and timeline', type: 'page', url: '/milestones', category: 'Navigation' },
    { id: 'page-risks', title: 'Risk Assessment', description: 'Identify and manage project risks', type: 'page', url: '/risks', category: 'Navigation' },
    { id: 'page-intelligence', title: 'AI Intelligence', description: 'AI-powered insights and analysis', type: 'page', url: '/intelligence', category: 'Navigation' },
    
    // Sample projects
    { id: 'proj-1', title: 'E-commerce Platform', description: 'Complete online shopping solution', type: 'project', url: '/', category: 'Projects' },
    { id: 'proj-2', title: 'Mobile Banking App', description: 'Secure mobile banking application', type: 'project', url: '/', category: 'Projects' },
    { id: 'proj-3', title: 'Data Analytics Platform', description: 'Business intelligence dashboard', type: 'project', url: '/', category: 'Projects' },
    
    // Sample financials
    { id: 'fin-1', title: 'Q4 Budget Report', description: 'Quarterly financial analysis', type: 'financial', url: '/financials', category: 'Financials' },
    { id: 'fin-2', title: 'Revenue Forecast', description: 'Annual revenue projections', type: 'financial', url: '/financials', category: 'Financials' },
    { id: 'fin-3', title: 'Cost Analysis', description: 'Project cost breakdown', type: 'financial', url: '/financials', category: 'Financials' },
    
    // Sample KPIs
    { id: 'kpi-1', title: 'Customer Satisfaction', description: 'Customer satisfaction metrics', type: 'kpi', url: '/kpis', category: 'KPIs' },
    { id: 'kpi-2', title: 'Team Productivity', description: 'Development team efficiency', type: 'kpi', url: '/kpis', category: 'KPIs' },
    { id: 'kpi-3', title: 'Project Delivery Rate', description: 'On-time delivery statistics', type: 'kpi', url: '/kpis', category: 'KPIs' },
    
    // Sample resources
    { id: 'res-1', title: 'Development Team', description: 'Frontend and backend developers', type: 'resource', url: '/resources', category: 'Resources' },
    { id: 'res-2', title: 'Design Team', description: 'UI/UX designers and researchers', type: 'resource', url: '/resources', category: 'Resources' },
    { id: 'res-3', title: 'QA Team', description: 'Quality assurance specialists', type: 'resource', url: '/resources', category: 'Resources' },
    
    // Sample milestones
    { id: 'mile-1', title: 'MVP Release', description: 'Minimum viable product launch', type: 'milestone', url: '/milestones', category: 'Milestones' },
    { id: 'mile-2', title: 'Beta Testing', description: 'User acceptance testing phase', type: 'milestone', url: '/milestones', category: 'Milestones' },
    { id: 'mile-3', title: 'Production Deploy', description: 'Full production deployment', type: 'milestone', url: '/milestones', category: 'Milestones' },
    
    // Sample risks
    { id: 'risk-1', title: 'Security Vulnerabilities', description: 'Potential security threats', type: 'risk', url: '/risks', category: 'Risks' },
    { id: 'risk-2', title: 'Resource Shortage', description: 'Insufficient team capacity', type: 'risk', url: '/risks', category: 'Risks' },
    { id: 'risk-3', title: 'Technology Dependencies', description: 'Third-party service risks', type: 'risk', url: '/risks', category: 'Risks' }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      // Simulate API delay
      const timeout = setTimeout(() => {
        const filtered = searchableData.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setSelectedIndex(0);
        setIsLoading(false);
      }, 200);

      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setSelectedIndex(0);
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'project':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'financial':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'kpi':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search projects, pages, resources..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-lg"
            />
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className={`p-2 rounded ${
                    result.type === 'page' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
                    result.type === 'project' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
                    result.type === 'financial' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' :
                    result.type === 'kpi' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.description}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {result.category}
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Start typing to search...</p>
              <p className="text-sm mt-1">Find projects, pages, resources, and more</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↓</kbd>
                  <span>navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
                  <span>select</span>
                </div>
              </div>
              <div>{results.length} results</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
