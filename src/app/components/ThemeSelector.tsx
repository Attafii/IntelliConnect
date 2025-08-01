'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Settings, Plus } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { ThemeConfig } from './ThemeSystem';

interface ThemeSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  showLabel = true, 
  compact = false,
  isOpen: externalIsOpen,
  onClose: externalOnClose
}) => {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose ? (open: boolean) => !open && externalOnClose() : setInternalIsOpen;

  const handleThemeSelect = (selectedThemeId: string) => {
    setTheme(selectedThemeId);
    setIsOpen(false);
  };

  const getThemePreviewColors = (theme: ThemeConfig) => (
    <div className="flex space-x-1">
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.primary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.secondary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.accent }}
      />
    </div>
  );

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
          hover:bg-gray-100 dark:hover:bg-gray-800
          ${compact ? 'p-2' : 'px-3 py-2'}
        `}
        style={{
          backgroundColor: `${currentTheme.colors.surface}`,
          color: currentTheme.colors.text.primary,
          border: `1px solid ${currentTheme.colors.border}`
        }}
      >
        <Palette className="h-4 w-4" />
        {!compact && showLabel && (
          <span className="text-sm font-medium">
            {currentTheme.displayName}
          </span>
        )}
        {!compact && getThemePreviewColors(currentTheme)}
      </button>

      {/* Theme Selection Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-72 rounded-lg shadow-xl border z-50"
            style={{
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 
                  className="font-semibold text-sm"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  Choose Theme
                </h3>
                <button
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Customize Theme"
                >
                  <Settings className="h-4 w-4" style={{ color: currentTheme.colors.text.secondary }} />
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(availableThemes).map(([id, theme]) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeSelect(id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                      hover:shadow-md
                      ${themeId === id ? 'ring-2' : ''}
                    `}                    style={{
                      backgroundColor: themeId === id ? theme.colors.primary + '10' : theme.colors.surface,
                      color: theme.colors.text.primary,
                      borderColor: themeId === id ? theme.colors.primary : 'transparent'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {getThemePreviewColors(theme)}
                      <div className="text-left">
                        <div className="font-medium text-sm">{theme.displayName}</div>
                        <div 
                          className="text-xs opacity-75"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          {theme.description}
                        </div>
                      </div>
                    </div>
                    {themeId === id && (
                      <Check 
                        className="h-4 w-4" 
                        style={{ color: theme.colors.primary }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Custom Theme Button */}
              <button
                onClick={() => setShowCustomizer(true)}
                className="w-full mt-3 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text.secondary
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Create Custom Theme</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Customizer Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <ThemeCustomizer
            isOpen={showCustomizer}
            onClose={() => setShowCustomizer(false)}
            baseTheme={currentTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Theme Customizer Component
interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  baseTheme: ThemeConfig;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose, baseTheme }) => {
  const { createCustomTheme } = useTheme();
  const [customName, setCustomName] = useState('');
  const [primaryColor, setPrimaryColor] = useState(baseTheme.colors.primary);
  const [secondaryColor, setSecondaryColor] = useState(baseTheme.colors.secondary);
  const [accentColor, setAccentColor] = useState(baseTheme.colors.accent);

  const handleCreateTheme = () => {
    if (!customName.trim()) return;

    const customizations = {
      displayName: customName,
      description: `Custom theme: ${customName}`,
      colors: {
        ...baseTheme.colors,
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
      }
    };

    createCustomTheme(customName.toLowerCase().replace(/\s+/g, '-'), customizations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-4">Create Custom Theme</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="My Custom Theme"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 rounded border"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-10 rounded border"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded border"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTheme}
            disabled={!customName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Theme
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSelector;
