import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/apiConfig';

export async function GET() {
  try {
    const response = await fetch(API_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: "openai.gpt-4",
        prompt: "Hello, this is a test message. Please respond with: Test successful.",
        temperature: 0.7,
        max_tokens: 50,
        stream: false
      })
    });

    const data = await response.json();
    console.log('API Test Response:', data);

    return NextResponse.json({
      success: true,
      apiResponse: data,
      config: {
        url: API_CONFIG.API_URL,
        hasKey: !!API_CONFIG.API_KEY
      }
    });
  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        url: API_CONFIG.API_URL,
        hasKey: !!API_CONFIG.API_KEY
      }
    }, { status: 500 });
  }
}
