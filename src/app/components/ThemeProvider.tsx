'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, themes, applyTheme, getStoredTheme } from './ThemeSystem';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: Record<string, ThemeConfig>;
  createCustomTheme: (name: string, customizations: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>('intelliconnect');
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes.intelliconnect);

  useEffect(() => {
    // Load stored theme on mount
    const storedTheme = getStoredTheme();
    if (storedTheme && themes[storedTheme]) {
      setThemeId(storedTheme);
      setCurrentTheme(themes[storedTheme]);
      applyTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const setTheme = (newThemeId: string) => {
    if (themes[newThemeId]) {
      setThemeId(newThemeId);
      setCurrentTheme(themes[newThemeId]);
      applyTheme(newThemeId);
    }
  };

  const createCustomTheme = (name: string, customizations: Partial<ThemeConfig>) => {
    const customTheme: ThemeConfig = {
      ...currentTheme,
      ...customizations,
      id: name,
      name: name,
      displayName: customizations.displayName || name,
    };
    
    // Add to available themes
    themes[name] = customTheme;
    setTheme(name);
  };

  const value: ThemeContextType = {
    currentTheme,
    themeId,
    setTheme,
    availableThemes: themes,
    createCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
