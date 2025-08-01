// Personalized AI Models - Learn from user preferences and behavior
export interface UserPreference {
  id: string;
  userId: string;
  category: 'communication' | 'analysis' | 'reporting' | 'workflow' | 'ui';
  key: string;
  value: any;
  weight: number; // 0-1, importance of this preference
  timestamp: number;
  context?: string; // Additional context about when/why this preference was set
}

export interface UserBehavior {
  id: string;
  userId: string;
  action: string;
  context: any;
  timestamp: number;
  outcome?: 'positive' | 'negative' | 'neutral';
  metadata?: Record<string, any>;
}

export interface AIPersonality {
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  responseLength: 'brief' | 'detailed' | 'comprehensive';
  focusAreas: string[]; // Areas of expertise to emphasize
  languagePreference: string;
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface PersonalizedModel {
  id: string;
  userId: string;
  name: string;
  description: string;
  personality: AIPersonality;
  preferences: UserPreference[];
  behavior: UserBehavior[];
  learningMetrics: {
    totalInteractions: number;
    satisfactionScore: number;
    accuracyRate: number;
    responseTime: number;
    lastUpdated: number;
  };
  isActive: boolean;
  version: string;
}

class PersonalizedAIService {
  private models: Map<string, PersonalizedModel> = new Map();
  private preferences: Map<string, UserPreference[]> = new Map();
  private behaviors: Map<string, UserBehavior[]> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  // Create or update a personalized model for a user
  async createPersonalizedModel(userId: string, initialPreferences?: Partial<AIPersonality>): Promise<PersonalizedModel> {
    const existingModel = this.models.get(userId);
    
    if (existingModel) {
      return existingModel;
    }    const defaultPersonality: AIPersonality = {
      communicationStyle: 'formal',
      responseLength: 'detailed',
      focusAreas: ['general'],
      languagePreference: 'en',
      technicalLevel: 'intermediate',
      ...initialPreferences
    };

    const model: PersonalizedModel = {
      id: `model_${userId}_${Date.now()}`,
      userId,
      name: `Personal AI Assistant`,
      description: 'Personalized AI model tailored to your preferences',
      personality: defaultPersonality,
      preferences: [],
      behavior: [],
      learningMetrics: {
        totalInteractions: 0,
        satisfactionScore: 0.5,
        accuracyRate: 0.5,
        responseTime: 0,
        lastUpdated: Date.now()
      },
      isActive: true,
      version: '1.0.0'
    };

    this.models.set(userId, model);
    this.saveToStorage();
    return model;
  }

  // Learn from user interaction
  async learnFromInteraction(
    userId: string, 
    interaction: {
      prompt: string;
      response: string;
      userFeedback?: 'positive' | 'negative' | 'neutral';
      context?: any;
    }
  ): Promise<void> {
    const model = await this.getOrCreateModel(userId);
    
    // Record behavior
    const behavior: UserBehavior = {
      id: `behavior_${Date.now()}`,
      userId,
      action: 'chat_interaction',
      context: {
        prompt: interaction.prompt,
        response: interaction.response,
        promptLength: interaction.prompt.length,
        responseLength: interaction.response.length,
        ...interaction.context
      },
      timestamp: Date.now(),
      outcome: interaction.userFeedback || 'neutral'
    };

    this.addBehavior(userId, behavior);

    // Extract preferences from interaction
    await this.extractPreferencesFromInteraction(userId, interaction);
    
    // Update learning metrics
    this.updateLearningMetrics(userId, interaction);
  }

  // Extract preferences from user interaction patterns
  private async extractPreferencesFromInteraction(
    userId: string, 
    interaction: any
  ): Promise<void> {
    const prompt = interaction.prompt.toLowerCase();
    
    // Detect communication style preference
    if (prompt.includes('please') || prompt.includes('thank you') || prompt.includes('could you')) {
      await this.updatePreference(userId, 'communication', 'style', 'formal', 0.1);
    } else if (prompt.includes('hey') || prompt.includes('what\'s up') || prompt.includes('gimme')) {
      await this.updatePreference(userId, 'communication', 'style', 'casual', 0.1);
    }

    // Detect response length preference based on user feedback
    if (interaction.userFeedback === 'positive') {
      const responseLength = interaction.response.length;
      if (responseLength < 200) {
        await this.updatePreference(userId, 'communication', 'responseLength', 'brief', 0.1);
      } else if (responseLength > 500) {
        await this.updatePreference(userId, 'communication', 'responseLength', 'comprehensive', 0.1);
      } else {
        await this.updatePreference(userId, 'communication', 'responseLength', 'detailed', 0.1);
      }
    }

    // Detect focus areas
    const focusKeywords = {
      'financial': ['budget', 'cost', 'revenue', 'profit', 'financial', 'money'],
      'project': ['project', 'timeline', 'milestone', 'deadline', 'task'],
      'technical': ['code', 'api', 'database', 'technical', 'development'],
      'analytics': ['analysis', 'data', 'metrics', 'report', 'insights']
    };

    Object.entries(focusKeywords).forEach(async ([area, keywords]) => {
      if (keywords.some(keyword => prompt.includes(keyword))) {
        await this.updatePreference(userId, 'analysis', 'focusArea', area, 0.05);
      }
    });

    // Detect language preference
    const arabicRegex = /[\u0600-\u06FF]/;
    const frenchWords = ['bonjour', 'merci', 'comment', 'projet'];
    
    if (arabicRegex.test(interaction.prompt)) {
      await this.updatePreference(userId, 'communication', 'language', 'ar', 0.2);
    } else if (frenchWords.some(word => prompt.includes(word))) {
      await this.updatePreference(userId, 'communication', 'language', 'fr', 0.2);
    } else {
      await this.updatePreference(userId, 'communication', 'language', 'en', 0.1);
    }
  }

  // Update user preference with weighted learning
  async updatePreference(
    userId: string, 
    category: UserPreference['category'], 
    key: string, 
    value: any, 
    weight: number
  ): Promise<void> {
    const userPreferences = this.preferences.get(userId) || [];
    const existingPref = userPreferences.find(p => p.category === category && p.key === key);

    if (existingPref) {
      // Update existing preference with weighted average
      const totalWeight = existingPref.weight + weight;
      existingPref.value = this.mergePreferenceValues(existingPref.value, value, existingPref.weight, weight);
      existingPref.weight = Math.min(totalWeight, 1.0);
      existingPref.timestamp = Date.now();
    } else {
      // Create new preference
      const newPreference: UserPreference = {
        id: `pref_${Date.now()}_${Math.random()}`,
        userId,
        category,
        key,
        value,
        weight,
        timestamp: Date.now()
      };
      userPreferences.push(newPreference);
    }

    this.preferences.set(userId, userPreferences);
    this.saveToStorage();
  }

  // Merge preference values with weights
  private mergePreferenceValues(existing: any, newValue: any, existingWeight: number, newWeight: number): any {
    if (typeof existing === 'string' && typeof newValue === 'string') {
      // For string values, choose the one with higher weight
      return newWeight > existingWeight ? newValue : existing;
    }
    
    if (typeof existing === 'number' && typeof newValue === 'number') {
      // For numeric values, use weighted average
      const totalWeight = existingWeight + newWeight;
      return (existing * existingWeight + newValue * newWeight) / totalWeight;
    }
    
    // For other types, default to new value if weight is higher
    return newWeight > existingWeight ? newValue : existing;
  }

  // Add user behavior record
  addBehavior(userId: string, behavior: UserBehavior): void {
    const userBehaviors = this.behaviors.get(userId) || [];
    userBehaviors.push(behavior);
    
    // Keep only last 1000 behaviors to prevent memory issues
    if (userBehaviors.length > 1000) {
      userBehaviors.splice(0, userBehaviors.length - 1000);
    }
    
    this.behaviors.set(userId, userBehaviors);
    this.saveToStorage();
  }

  // Update learning metrics
  private updateLearningMetrics(userId: string, interaction: any): void {
    const model = this.models.get(userId);
    if (!model) return;

    model.learningMetrics.totalInteractions++;
    
    if (interaction.userFeedback === 'positive') {
      model.learningMetrics.satisfactionScore = Math.min(
        model.learningMetrics.satisfactionScore + 0.01, 
        1.0
      );
    } else if (interaction.userFeedback === 'negative') {
      model.learningMetrics.satisfactionScore = Math.max(
        model.learningMetrics.satisfactionScore - 0.02, 
        0.0
      );
    }
    
    model.learningMetrics.lastUpdated = Date.now();
    this.saveToStorage();
  }

  // Get personalized response parameters
  async getPersonalizedParameters(userId: string): Promise<{
    personality: AIPersonality;
    contextualPrompts: string[];
    responseFormat: any;
  }> {
    const model = await this.getOrCreateModel(userId);
    const preferences = this.preferences.get(userId) || [];

    // Build personality from preferences
    const personality = { ...model.personality };
    
    preferences.forEach(pref => {
      if (pref.category === 'communication') {
        if (pref.key === 'style') personality.communicationStyle = pref.value;
        if (pref.key === 'responseLength') personality.responseLength = pref.value;
        if (pref.key === 'language') personality.languagePreference = pref.value;
      }
    });

    // Generate contextual prompts based on behavior
    const contextualPrompts = this.generateContextualPrompts(userId);
    
    // Determine response format
    const responseFormat = this.getResponseFormat(personality);

    return {
      personality,
      contextualPrompts,
      responseFormat
    };
  }

  // Generate contextual prompts based on user behavior
  private generateContextualPrompts(userId: string): string[] {
    const behaviors = this.behaviors.get(userId) || [];
    const preferences = this.preferences.get(userId) || [];
    const prompts: string[] = [];

    // Add style prompts
    const stylePrefs = preferences.filter(p => p.category === 'communication' && p.key === 'style');
    const dominantStyle = stylePrefs.sort((a, b) => b.weight - a.weight)[0];
    
    if (dominantStyle) {
      switch (dominantStyle.value) {
        case 'formal':
          prompts.push('Respond in a professional and formal tone.');
          break;
        case 'casual':
          prompts.push('Respond in a friendly and casual tone.');
          break;
        case 'technical':
          prompts.push('Provide technical details and use industry terminology.');
          break;
      }
    }

    // Add length prompts
    const lengthPrefs = preferences.filter(p => p.category === 'communication' && p.key === 'responseLength');
    const dominantLength = lengthPrefs.sort((a, b) => b.weight - a.weight)[0];
    
    if (dominantLength) {
      switch (dominantLength.value) {
        case 'brief':
          prompts.push('Keep responses concise and to the point.');
          break;
        case 'comprehensive':
          prompts.push('Provide detailed explanations with examples.');
          break;
      }
    }

    // Add focus area prompts
    const focusPrefs = preferences.filter(p => p.category === 'analysis' && p.key === 'focusArea');
    const topFocusAreas = focusPrefs
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(p => p.value);
    
    if (topFocusAreas.length > 0) {
      prompts.push(`Focus particularly on ${topFocusAreas.join(', ')} aspects.`);
    }

    return prompts;
  }

  // Get response format based on personality
  private getResponseFormat(personality: AIPersonality): any {
    return {
      maxLength: personality.responseLength === 'brief' ? 200 : 
                 personality.responseLength === 'detailed' ? 500 : 1000,
      includeExamples: personality.responseLength === 'comprehensive',
      technicalDetail: personality.technicalLevel,
      language: personality.languagePreference
    };
  }

  // Get or create model
  async getOrCreateModel(userId: string): Promise<PersonalizedModel> {
    const existing = this.models.get(userId);
    if (existing) return existing;
    
    return await this.createPersonalizedModel(userId);
  }

  // Get user's learning progress
  getLearningProgress(userId: string): any {
    const model = this.models.get(userId);
    const preferences = this.preferences.get(userId) || [];
    const behaviors = this.behaviors.get(userId) || [];

    if (!model) return null;

    return {
      model,
      preferencesCount: preferences.length,
      behaviorsCount: behaviors.length,
      learningMetrics: model.learningMetrics,
      topPreferences: preferences
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5),
      recentBehaviors: behaviors
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
    };
  }

  // Storage methods
  private saveToStorage(): void {
    try {
      const data = {
        models: Array.from(this.models.entries()),
        preferences: Array.from(this.preferences.entries()),
        behaviors: Array.from(this.behaviors.entries())
      };
      localStorage.setItem('personalizedAI', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save personalized AI data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('personalizedAI');
      if (data) {
        const parsed = JSON.parse(data);
        this.models = new Map(parsed.models || []);
        this.preferences = new Map(parsed.preferences || []);
        this.behaviors = new Map(parsed.behaviors || []);
      }
    } catch (error) {
      console.error('Failed to load personalized AI data:', error);
    }
  }

  // Export user data
  exportUserData(userId: string): any {
    return {
      model: this.models.get(userId),
      preferences: this.preferences.get(userId) || [],
      behaviors: this.behaviors.get(userId) || []
    };
  }
  // Import user data
  importUserData(userId: string, data: any): void {
    if (data.model) this.models.set(userId, data.model);
    if (data.preferences) this.preferences.set(userId, data.preferences);
    if (data.behaviors) this.behaviors.set(userId, data.behaviors);
    this.saveToStorage();
  }

  // Initialize the service
  initialize(): void {
    this.loadFromStorage();
    console.log('Personalized AI Service initialized');
  }

  // Track user interaction
  trackInteraction(interaction: {
    type: 'navigation' | 'action' | 'analysis' | 'chat';
    details: any;
    timestamp: Date;
  }): void {
    const userId = 'default_user'; // In a real app, this would come from authentication
    
    const behavior: UserBehavior = {
      id: `behavior_${Date.now()}_${Math.random()}`,
      userId,
      action: interaction.type,
      context: interaction.details,
      timestamp: interaction.timestamp.getTime(),
      outcome: 'neutral'
    };

    this.addBehavior(userId, behavior);
  }

  // Get user preferences in a structured format
  getUserPreferences(): {
    communication: {
      style: string;
      responseLength: string;
      language: string;
    };
    analysis: {
      focusAreas: string[];
    };
    reporting: {
      format: string;
      includeVisualDescriptions: boolean;
    };
  } {
    const userId = 'default_user';
    const preferences = this.preferences.get(userId) || [];
    
    const result = {
      communication: {
        style: 'professional',
        responseLength: 'detailed',
        language: 'en'
      },
      analysis: {
        focusAreas: ['general']
      },
      reporting: {
        format: 'detailed',
        includeVisualDescriptions: true
      }
    };

    // Extract preferences
    preferences.forEach(pref => {
      if (pref.category === 'communication') {
        if (pref.key === 'style') result.communication.style = pref.value;
        if (pref.key === 'responseLength') result.communication.responseLength = pref.value;
        if (pref.key === 'language') result.communication.language = pref.value;
      }
      if (pref.category === 'analysis' && pref.key === 'focusArea') {
        if (!result.analysis.focusAreas.includes(pref.value)) {
          result.analysis.focusAreas.push(pref.value);
        }
      }
    });

    return result;
  }
}

// Singleton instance
export const personalizedAI = new PersonalizedAIService();
