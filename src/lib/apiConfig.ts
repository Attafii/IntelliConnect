import OpenAI from 'openai';

export const API_CONFIG = {
  API_KEY: "SKVUUlB0g34EyavkST80U7F6uc8iVbEu79XDSViq".trim(),
  BASE_URL: "https://api.generative.engine.capgemini.com/v1"
};

export const openai = new OpenAI({
  apiKey: API_CONFIG.API_KEY,
  baseURL: API_CONFIG.BASE_URL,
  defaultHeaders: {
    'x-api-key': API_CONFIG.API_KEY
  }
});
