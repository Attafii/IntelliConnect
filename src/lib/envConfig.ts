// Environment Configuration Validator
export interface EnvironmentConfig {
  generativeApiKey: string;
  generativeApiUrl: string;
  generativeBaseUrl: string;
  claudeSonnetModel: string;
  novaLiteModel: string;
  openaiGpt4Model: string;
  openaiGpt35Model: string;
  apiTimeout: number;
  maxTokens: number;
  temperature: number;
  topP: number;
  appName: string;
  appVersion: string;
  nodeEnv: string;
}

export function validateEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    generativeApiKey: process.env.GENERATIVE_API_KEY || '',
    generativeApiUrl: process.env.GENERATIVE_API_URL || 'https://api.generative.engine.capgemini.com/v2/llm/invoke',
    generativeBaseUrl: process.env.GENERATIVE_BASE_URL || 'https://api.generative.engine.capgemini.com/v1',
    claudeSonnetModel: process.env.CLAUDE_SONNET_MODEL || 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
    novaLiteModel: process.env.NOVA_LITE_MODEL || 'amazon.nova-lite-v1:0',
    openaiGpt4Model: process.env.OPENAI_GPT4_MODEL || 'openai.gpt-4',
    openaiGpt35Model: process.env.OPENAI_GPT35_MODEL || 'openai.gpt-3.5-turbo',
    apiTimeout: Number(process.env.API_TIMEOUT) || 25000,
    maxTokens: Number(process.env.MAX_TOKENS) || 1500,
    temperature: Number(process.env.TEMPERATURE) || 0.7,
    topP: Number(process.env.TOP_P) || 0.9,
    appName: process.env.APP_NAME || 'IntelliConnect',
    appVersion: process.env.APP_VERSION || '1.0',
    nodeEnv: process.env.NODE_ENV || 'development'
  };

  // Validate required configurations
  const errors: string[] = [];

  if (!config.generativeApiKey) {
    errors.push('GENERATIVE_API_KEY is required');
  }

  if (config.apiTimeout < 1000 || config.apiTimeout > 60000) {
    errors.push('API_TIMEOUT must be between 1000 and 60000 milliseconds');
  }

  if (config.maxTokens < 100 || config.maxTokens > 4000) {
    errors.push('MAX_TOKENS must be between 100 and 4000');
  }

  if (config.temperature < 0 || config.temperature > 2) {
    errors.push('TEMPERATURE must be between 0 and 2');
  }

  if (config.topP < 0 || config.topP > 1) {
    errors.push('TOP_P must be between 0 and 1');
  }

  if (errors.length > 0) {
    console.warn('⚠️ Environment configuration warnings:', errors.join(', '));
    console.warn('⚠️ Using default values for invalid configurations');
  }

  return config;
}

export const envConfig = validateEnvironmentConfig();

// Helper function to check if API is configured
export function isApiConfigured(): boolean {
  return !!envConfig.generativeApiKey && envConfig.generativeApiKey !== '';
}

// Helper function to get API status
export function getApiStatus(): { configured: boolean; message: string } {
  const configured = isApiConfigured();
  return {
    configured,
    message: configured 
      ? 'API is properly configured'
      : 'API key is missing. Please set GENERATIVE_API_KEY in your .env file'
  };
}
