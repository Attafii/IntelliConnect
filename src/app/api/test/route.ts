import { NextResponse } from 'next/server';
import { openai, API_CONFIG } from '@/lib/apiConfig';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function GET() {
  try {
    console.log('Testing API connection...');
    console.log('API Key starts with:', API_CONFIG.API_KEY.substring(0, 5) + '...');
    
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, this is a test message. Please respond with: Test successful.' }
    ];

    console.log('Sending request with messages:', messages);

    const response = await openai.chat.completions.create({
      model: 'openai.gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 50
    });

    console.log('API Response:', response);

    return NextResponse.json({
      success: true,
      apiResponse: response,
      config: {
        baseUrl: API_CONFIG.BASE_URL,
        keyPrefix: API_CONFIG.API_KEY.substring(0, 5) + '...'
      }
    });
  } catch (error) {
    console.error('API Test Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        baseUrl: API_CONFIG.BASE_URL,
        keyPrefix: API_CONFIG.API_KEY.substring(0, 5) + '...'
      }
    }, { status: 500 });
  }
}
