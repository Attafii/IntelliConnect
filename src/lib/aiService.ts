import { openai } from './apiConfig';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
}

export const aiService = {
  async sendChatMessage(message: string, context?: string): Promise<ChatResponse> {
    try {
      const systemMessage = 'You are an AI assistant helping with project management and analysis.';
      
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemMessage }
      ];

      if (context) {
        messages.push({ role: 'system', content: `Context: ${context}` });
      }

      messages.push({ role: 'user', content: message });

      console.log('Sending request with messages:', messages);

      const response = await openai.chat.completions.create({
        model: 'openai.gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 500
      });

      console.log('API Response:', response);

      const responseText = response.choices[0]?.message?.content || 'No response from AI';

      // Try to extract suggestions from the response
      let suggestions = ['Tell me more', 'What else?', 'Can you explain?'];
      try {
        const lastParagraph = responseText.split('\n').filter(Boolean).pop() || '';
        if (lastParagraph.includes('[') && lastParagraph.includes(']')) {
          const suggestionsMatch = lastParagraph.match(/\[(.*?)\]/);
          if (suggestionsMatch && suggestionsMatch[1]) {
            const extracted = suggestionsMatch[1]
              .split(',')
              .map((suggestion: string) => suggestion.trim());
            if (extracted.length > 0) {
              suggestions = extracted;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to extract suggestions:', e);
      }

      return {
        reply: responseText.trim(),
        suggestions
      };
    } catch (error) {
      console.error('AI Service error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to communicate with AI service');
    }
  }
};
