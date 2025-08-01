/**
 * Smart Shortcuts System - Keyboard shortcuts for power users
 * Provides comprehensive keyboard navigation and quick actions
 */

export interface ShortcutAction {
  id: string;
  name: string;
  description: string;
  keys: string[];
  category: 'navigation' | 'actions' | 'analysis' | 'chat' | 'themes' | 'global';
  action: () => void;
  context?: string; // Specific page/component context
}

export interface ShortcutCategory {
  name: string;
  description: string;
  shortcuts: ShortcutAction[];
}

export class SmartShortcutsService {
  private shortcuts: Map<string, ShortcutAction> = new Map();
  private listeners: Map<string, (event: KeyboardEvent) => void> = new Map();
  private isEnabled: boolean = true;
  private helpModalCallback?: () => void;

  constructor() {
    this.initializeDefaultShortcuts();
    this.bindGlobalListeners();
  }

  private initializeDefaultShortcuts() {
    const defaultShortcuts: ShortcutAction[] = [
      // Global Navigation
      {
        id: 'goto-overview',
        name: 'Go to Overview',
        description: 'Navigate to project overview page',
        keys: ['ctrl', 'shift', 'o'],
        category: 'navigation',
        action: () => this.navigateTo('/overview')
      },
      {
        id: 'goto-projects',
        name: 'Go to Projects',
        description: 'Navigate to projects page',
        keys: ['ctrl', 'shift', 'p'],
        category: 'navigation',
        action: () => this.navigateTo('/projects')
      },
      {
        id: 'goto-financials',
        name: 'Go to Financials',
        description: 'Navigate to financials page',
        keys: ['ctrl', 'shift', 'f'],
        category: 'navigation',
        action: () => this.navigateTo('/financials')
      },
      {
        id: 'goto-kpis',
        name: 'Go to KPIs',
        description: 'Navigate to KPIs dashboard',
        keys: ['ctrl', 'shift', 'k'],
        category: 'navigation',
        action: () => this.navigateTo('/kpis')
      },
      {
        id: 'goto-resources',
        name: 'Go to Resources',
        description: 'Navigate to resources page',
        keys: ['ctrl', 'shift', 'r'],
        category: 'navigation',
        action: () => this.navigateTo('/resources')
      },
      {
        id: 'goto-milestones',
        name: 'Go to Milestones',
        description: 'Navigate to milestones page',
        keys: ['ctrl', 'shift', 'm'],
        category: 'navigation',
        action: () => this.navigateTo('/milestones')
      },
      {
        id: 'goto-risks',
        name: 'Go to Risks',
        description: 'Navigate to risks page',
        keys: ['ctrl', 'shift', 'x'],
        category: 'navigation',
        action: () => this.navigateTo('/risks')
      },
      {
        id: 'goto-intelligence',
        name: 'Go to Intelligence',
        description: 'Navigate to AI intelligence page',
        keys: ['ctrl', 'shift', 'i'],
        category: 'navigation',
        action: () => this.navigateTo('/intelligence')
      },

      // Chat Actions
      {
        id: 'toggle-chat',
        name: 'Toggle Chat',
        description: 'Open or close the AI chatbot',
        keys: ['ctrl', 'shift', 'c'],
        category: 'chat',
        action: () => this.triggerChatToggle()
      },
      {
        id: 'focus-chat',
        name: 'Focus Chat Input',
        description: 'Focus on chat input field',
        keys: ['ctrl', '/'],
        category: 'chat',
        action: () => this.focusChatInput()
      },
      {
        id: 'clear-chat',
        name: 'Clear Chat History',
        description: 'Clear current chat conversation',
        keys: ['ctrl', 'shift', 'delete'],
        category: 'chat',
        action: () => this.clearChatHistory()
      },
      {
        id: 'toggle-tts',
        name: 'Toggle Text-to-Speech',
        description: 'Enable/disable text-to-speech for chat',
        keys: ['ctrl', 'shift', 't'],
        category: 'chat',
        action: () => this.toggleTextToSpeech()
      },
      {
        id: 'switch-language',
        name: 'Cycle Language',
        description: 'Cycle through available languages',
        keys: ['ctrl', 'shift', 'l'],
        category: 'chat',
        action: () => this.cycleLanguage()
      },

      // Analysis Actions
      {
        id: 'refresh-data',
        name: 'Refresh Data',
        description: 'Refresh current page data',
        keys: ['f5'],
        category: 'actions',
        action: () => this.refreshCurrentData()
      },
      {
        id: 'export-data',
        name: 'Export Data',
        description: 'Export current view data',
        keys: ['ctrl', 'e'],
        category: 'actions',
        action: () => this.exportCurrentData()
      },
      {
        id: 'quick-analysis',
        name: 'Quick Analysis',
        description: 'Run quick AI analysis on current data',
        keys: ['ctrl', 'q'],
        category: 'analysis',
        action: () => this.runQuickAnalysis()
      },
      {
        id: 'generate-report',
        name: 'Generate Report',
        description: 'Generate AI report for current view',
        keys: ['ctrl', 'shift', 'g'],
        category: 'analysis',
        action: () => this.generateReport()
      },

      // Theme Actions
      {
        id: 'cycle-theme',
        name: 'Cycle Theme',
        description: 'Cycle through available themes',
        keys: ['ctrl', 'shift', 'y'],
        category: 'themes',
        action: () => this.cycleTheme()
      },
      {
        id: 'toggle-dark-mode',
        name: 'Toggle Dark Mode',
        description: 'Switch between light and dark mode',
        keys: ['ctrl', 'shift', 'd'],
        category: 'themes',
        action: () => this.toggleDarkMode()
      },

      // Global Actions
      {
        id: 'show-shortcuts',
        name: 'Show Shortcuts Help',
        description: 'Display keyboard shortcuts help',
        keys: ['ctrl', 'shift', '?'],
        category: 'global',
        action: () => this.showShortcutsHelp()
      },
      {
        id: 'search-global',
        name: 'Global Search',
        description: 'Open global search dialog',
        keys: ['ctrl', 'k'],
        category: 'global',
        action: () => this.openGlobalSearch()
      },
      {
        id: 'toggle-sidebar',
        name: 'Toggle Sidebar',
        description: 'Show or hide the navigation sidebar',
        keys: ['ctrl', 'b'],
        category: 'global',
        action: () => this.toggleSidebar()
      }
    ];

    defaultShortcuts.forEach(shortcut => {
      this.registerShortcut(shortcut);
    });
  }

  registerShortcut(shortcut: ShortcutAction) {
    const keyCombo = this.generateKeyCombo(shortcut.keys);
    this.shortcuts.set(keyCombo, shortcut);
  }

  unregisterShortcut(keys: string[]) {
    const keyCombo = this.generateKeyCombo(keys);
    this.shortcuts.delete(keyCombo);
  }

  private generateKeyCombo(keys: string[]): string {
    return keys.map(key => key.toLowerCase()).sort().join('+');
  }

  private bindGlobalListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Exception for global shortcuts like help
      if (!(event.ctrlKey && event.shiftKey && event.key === '?')) {
        return;
      }
    }

    const pressedKeys = [];
    if (event.ctrlKey) pressedKeys.push('ctrl');
    if (event.shiftKey) pressedKeys.push('shift');
    if (event.altKey) pressedKeys.push('alt');
    if (event.metaKey) pressedKeys.push('meta');
    
    // Add the main key
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
      pressedKeys.push(event.key.toLowerCase());
    }

    const keyCombo = this.generateKeyCombo(pressedKeys);
    const shortcut = this.shortcuts.get(keyCombo);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  getShortcutsByCategory(): ShortcutCategory[] {
    const categories: { [key: string]: ShortcutCategory } = {
      navigation: { name: 'Navigation', description: 'Navigate between pages', shortcuts: [] },
      chat: { name: 'Chat & AI', description: 'Chat and AI interactions', shortcuts: [] },
      actions: { name: 'Actions', description: 'Quick actions', shortcuts: [] },
      analysis: { name: 'Analysis', description: 'Data analysis shortcuts', shortcuts: [] },
      themes: { name: 'Themes', description: 'Theme and appearance', shortcuts: [] },
      global: { name: 'Global', description: 'Global application shortcuts', shortcuts: [] }
    };

    this.shortcuts.forEach(shortcut => {
      if (categories[shortcut.category]) {
        categories[shortcut.category].shortcuts.push(shortcut);
      }
    });

    return Object.values(categories).filter(cat => cat.shortcuts.length > 0);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  setHelpModalCallback(callback: () => void) {
    this.helpModalCallback = callback;
  }

  // Action implementations
  private navigateTo(path: string) {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }

  private triggerChatToggle() {
    const event = new CustomEvent('smartshortcut:toggle-chat');
    document.dispatchEvent(event);
  }

  private focusChatInput() {
    const chatInput = document.querySelector('[data-chat-input]') as HTMLElement;
    if (chatInput) {
      chatInput.focus();
    }
  }

  private clearChatHistory() {
    const event = new CustomEvent('smartshortcut:clear-chat');
    document.dispatchEvent(event);
  }

  private toggleTextToSpeech() {
    const event = new CustomEvent('smartshortcut:toggle-tts');
    document.dispatchEvent(event);
  }

  private cycleLanguage() {
    const event = new CustomEvent('smartshortcut:cycle-language');
    document.dispatchEvent(event);
  }

  private refreshCurrentData() {
    window.location.reload();
  }

  private exportCurrentData() {
    const event = new CustomEvent('smartshortcut:export-data');
    document.dispatchEvent(event);
  }

  private runQuickAnalysis() {
    const event = new CustomEvent('smartshortcut:quick-analysis');
    document.dispatchEvent(event);
  }

  private generateReport() {
    const event = new CustomEvent('smartshortcut:generate-report');
    document.dispatchEvent(event);
  }

  private cycleTheme() {
    const event = new CustomEvent('smartshortcut:cycle-theme');
    document.dispatchEvent(event);
  }

  private toggleDarkMode() {
    const event = new CustomEvent('smartshortcut:toggle-dark-mode');
    document.dispatchEvent(event);
  }

  private showShortcutsHelp() {
    if (this.helpModalCallback) {
      this.helpModalCallback();
    } else {
      const event = new CustomEvent('smartshortcut:show-help');
      document.dispatchEvent(event);
    }
  }

  private openGlobalSearch() {
    const event = new CustomEvent('smartshortcut:global-search');
    document.dispatchEvent(event);
  }

  private toggleSidebar() {
    const event = new CustomEvent('smartshortcut:toggle-sidebar');
    document.dispatchEvent(event);
  }

  formatKeyCombo(keys: string[]): string {
    return keys
      .map(key => {
        switch (key.toLowerCase()) {
          case 'ctrl': return '⌃';
          case 'shift': return '⇧';
          case 'alt': return '⌥';
          case 'meta': return '⌘';
          default: return key.toUpperCase();
        }
      })
      .join(' + ');
  }
}

// Global instance
export const smartShortcuts = new SmartShortcutsService();
