// Theme system for brand-specific interface customization
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: string;
      medium: string;
      slow: string;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// Predefined themes
export const themes: Record<string, ThemeConfig> = {
  intelliconnect: {
    id: 'intelliconnect',
    name: 'intelliconnect',
    displayName: 'IntelliConnect',
    description: 'Default IntelliConnect theme with professional blue accents',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#94a3b8'
      },
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    animations: {
      duration: {
        fast: '150ms',
        medium: '300ms',
        slow: '500ms'
      },
      easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  corporate: {
    id: 'corporate',
    name: 'corporate',
    displayName: 'Corporate Elite',
    description: 'Professional corporate theme with dark accents',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#374151',
      background: '#ffffff',
      surface: '#f9fafb',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6b7280'
      },
      border: '#d1d5db',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb'
    },
    typography: {
      fontFamily: 'Roboto, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.15)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.15)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.15)'
    },
    animations: {
      duration: {
        fast: '100ms',
        medium: '200ms',
        slow: '400ms'
      },
      easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  vibrant: {
    id: 'vibrant',
    name: 'vibrant',
    displayName: 'Vibrant Energy',
    description: 'Colorful and energetic theme for creative teams',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#18181b',
        secondary: '#52525b',
        muted: '#a1a1aa'
      },
      border: '#e4e4e7',
      success: '#22c55e',
      warning: '#eab308',
      error: '#f43f5e',
      info: '#06b6d4'
    },
    typography: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    animations: {
      duration: {
        fast: '200ms',
        medium: '400ms',
        slow: '600ms'
      },
      easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  minimal: {
    id: 'minimal',
    name: 'minimal',
    displayName: 'Minimal Clean',
    description: 'Clean and minimal design for focused work',
    colors: {
      primary: '#000000',
      secondary: '#525252',
      accent: '#404040',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#171717',
        secondary: '#404040',
        muted: '#737373'
      },
      border: '#e5e5e5',
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#2563eb'
    },
    typography: {
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 2px 4px 0 rgb(0 0 0 / 0.05)',
      lg: '0 4px 8px 0 rgb(0 0 0 / 0.05)',
      xl: '0 8px 16px 0 rgb(0 0 0 / 0.05)'
    },
    animations: {
      duration: {
        fast: '100ms',
        medium: '200ms',
        slow: '300ms'
      },
      easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
};

// Theme utility functions
export const generateCSSVariables = (theme: ThemeConfig): string => {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text-primary: ${theme.colors.text.primary};
      --color-text-secondary: ${theme.colors.text.secondary};
      --color-text-muted: ${theme.colors.text.muted};
      --color-border: ${theme.colors.border};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      --color-info: ${theme.colors.info};
      
      --font-family: ${theme.typography.fontFamily};
      --font-size-xs: ${theme.typography.fontSize.xs};
      --font-size-sm: ${theme.typography.fontSize.sm};
      --font-size-base: ${theme.typography.fontSize.base};
      --font-size-lg: ${theme.typography.fontSize.lg};
      --font-size-xl: ${theme.typography.fontSize.xl};
      --font-size-2xl: ${theme.typography.fontSize['2xl']};
      --font-size-3xl: ${theme.typography.fontSize['3xl']};
      
      --font-weight-normal: ${theme.typography.fontWeight.normal};
      --font-weight-medium: ${theme.typography.fontWeight.medium};
      --font-weight-semibold: ${theme.typography.fontWeight.semibold};
      --font-weight-bold: ${theme.typography.fontWeight.bold};
      
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      
      --border-radius-sm: ${theme.borderRadius.sm};
      --border-radius-md: ${theme.borderRadius.md};
      --border-radius-lg: ${theme.borderRadius.lg};
      --border-radius-xl: ${theme.borderRadius.xl};
      
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
      --shadow-xl: ${theme.shadows.xl};
      
      --duration-fast: ${theme.animations.duration.fast};
      --duration-medium: ${theme.animations.duration.medium};
      --duration-slow: ${theme.animations.duration.slow};
      
      --easing-in: ${theme.animations.easing.easeIn};
      --easing-out: ${theme.animations.easing.easeOut};
      --easing-in-out: ${theme.animations.easing.easeInOut};
    }
  `;
};

export const applyTheme = (themeId: string): void => {
  const theme = themes[themeId];
  if (!theme) return;

  const cssVariables = generateCSSVariables(theme);
  
  // Remove existing theme style if it exists
  const existingStyle = document.getElementById('theme-variables');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create and append new theme style
  const style = document.createElement('style');
  style.id = 'theme-variables';
  style.textContent = cssVariables;
  document.head.appendChild(style);

  // Store theme preference
  localStorage.setItem('selectedTheme', themeId);
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme, themeId } 
  }));
};

export const getStoredTheme = (): string => {
  return localStorage.getItem('selectedTheme') || 'intelliconnect';
};

export const createCustomTheme = (baseTheme: string, customizations: Partial<ThemeConfig>): ThemeConfig => {
  const base = themes[baseTheme] || themes.intelliconnect;
  return {
    ...base,
    ...customizations,
    colors: {
      ...base.colors,
      ...customizations.colors
    },
    typography: {
      ...base.typography,
      ...customizations.typography
    }
  };
};
