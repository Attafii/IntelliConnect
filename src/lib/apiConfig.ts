import OpenAI from 'openai';

export const API_CONFIG = {
  API_KEY: process.env.GENERATIVE_API_KEY?.trim() || "",
  BASE_URL: process.env.GENERATIVE_API_BASE_URL || "https://api.generative.engine.capgemini.com/v1"
};

// Validate API key is available
if (!API_CONFIG.API_KEY) {
  console.warn('⚠️ GENERATIVE_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.BASE_URL,
  defaultHeaders: {
    'x-api-key': API_CONFIG.API_KEY
  }
});
