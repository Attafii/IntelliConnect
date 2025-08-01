/**
 * Smart Features Demo - Showcases all the new features
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SmartFeaturesDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shortcuts');

  const features = [
    {
      id: 'shortcuts',
      title: 'Smart Shortcuts',
      description: 'Keyboard shortcuts for power users',
      icon: '⌨️',
      keyFeatures: [
        'Press Ctrl+Shift+? to see all shortcuts',
        'Ctrl+K for global search',
        'Ctrl+Shift+C to toggle chat',
        'Navigate pages with Ctrl+Shift+[O/P/F/K/R/M/X/I]',
        'Quick analysis with Ctrl+Q',
        'Generate reports with Ctrl+Shift+G'
      ]
    },
    {
      id: 'themes',
      title: 'Custom Themes',
      description: 'Brand-specific interface customization',
      icon: '🎨',
      keyFeatures: [
        'Four predefined themes available',
        'Custom theme creation with color picker',
        'Dynamic CSS variable generation',
        'Theme persistence across sessions',
        'Cycle themes with Ctrl+Shift+Y',
        'Toggle dark mode with Ctrl+Shift+D'
      ]
    },
    {
      id: 'ai',
      title: 'Personalized AI',
      description: 'AI models that learn from user preferences',
      icon: '🧠',
      keyFeatures: [
        'Tracks communication preferences',
        'Learns from interaction patterns',
        'Customizable AI personality',
        'Contextual prompt generation',
        'Learning metrics and satisfaction scoring',
        'Export/import user preference data'
      ]
    },
    {
      id: 'multilingual',
      title: 'Multilingual Support',
      description: 'Tunisian Arabic, French, and English support',
      icon: '🌍',
      keyFeatures: [
        'Auto-detection of language from input',
        'RTL text support for Arabic',
        'Text-to-speech in multiple languages',
        'Dynamic UI translations',
        'Language-specific voice settings',
        'Business-relevant translations'
      ]
    }
  ];

  const activeFeature = features.find(f => f.id === activeTab);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Smart Features Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the advanced features that make IntelliConnect a powerful project management platform
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveTab(feature.id)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === feature.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-lg">{feature.icon}</span>
            <span className="font-medium">{feature.title}</span>
          </button>
        ))}
      </div>

      {/* Feature Content */}
      {activeFeature && (
        <motion.div
          key={activeFeature.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <span className="text-2xl mr-2">{activeFeature.icon}</span>
              {activeFeature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {activeFeature.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeFeature.keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            {activeTab === 'shortcuts' && (
              <>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:show-help'))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Shortcuts
                </button>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:global-search'))}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Global Search
                </button>
              </>
            )}
            
            {activeTab === 'themes' && (
              <>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('theme:cycle'))}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cycle Themes
                </button>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('theme:toggle-dark'))}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Toggle Dark Mode
                </button>
              </>
            )}
            
            {activeTab === 'ai' && (
              <>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:toggle-chat'))}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Open AI Assistant
                </button>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:quick-analysis'))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quick Analysis
                </button>
              </>
            )}
            
            {activeTab === 'multilingual' && (
              <>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:toggle-chat'))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Multilingual Chat
                </button>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('smartshortcut:cycle-language'))}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Cycle Languages
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Quick Tips</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Use <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Ctrl+Shift+?</kbd> to see all keyboard shortcuts</li>
          <li>• Click the theme button (bottom-left) to customize your interface</li>
          <li>• The AI learns from your interactions and adapts to your preferences</li>
          <li>• Try typing in different languages - the system auto-detects and responds accordingly</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartFeaturesDemo;
