/**
 * Shortcuts Help Modal - Displays keyboard shortcuts help
 */

'use client';

import React, { useState, useEffect } from 'react';
import { smartShortcuts, ShortcutCategory } from './SmartShortcuts';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<ShortcutCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('navigation');

  useEffect(() => {
    if (isOpen) {
      const shortcutCategories = smartShortcuts.getShortcutsByCategory();
      setCategories(shortcutCategories);
      if (shortcutCategories.length > 0) {
        setSelectedCategory(shortcutCategories[0].name.toLowerCase());
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedCategoryData = categories.find(cat => 
    cat.name.toLowerCase() === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Use these shortcuts to navigate and interact with IntelliConnect efficiently
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Categories Sidebar */}
          <div className="w-48 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name.toLowerCase())}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.name.toLowerCase()
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {category.shortcuts.length} shortcuts
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shortcuts Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedCategoryData && (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedCategoryData.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedCategoryData.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedCategoryData.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {shortcut.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {shortcut.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {shortcut.keys.map((key, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && (
                              <span className="text-gray-400 text-sm">+</span>
                            )}
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow">
                              {key === 'ctrl' ? '⌃' : 
                               key === 'shift' ? '⇧' : 
                               key === 'alt' ? '⌥' : 
                               key === 'meta' ? '⌘' : 
                               key.toUpperCase()}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow mr-2">
                Esc
              </kbd>
              to close
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              IntelliConnect Smart Shortcuts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsHelpModal;
