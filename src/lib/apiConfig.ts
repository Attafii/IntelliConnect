import OpenAI from 'openai';
import { envConfig } from './envConfig';

export const API_CONFIG = {
  API_KEY: envConfig.generativeApiKey,
  BASE_URL: envConfig.generativeBaseUrl
};

export const openai = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.BASE_URL,
  defaultHeaders: {
    'x-api-key': API_CONFIG.API_KEY
  }
});
