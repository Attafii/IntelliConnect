import { NextResponse } from 'next/server';

import { API_CONFIG } from '@/lib/apiConfig';
import { aiService } from '@/lib/aiService';
import type { ChatMessage } from '@/lib/aiService';

// Helper to determine if a response is an error
const isErrorResponse = (data: any) => {
  return data.error || !data.choices || !data.choices[0]?.message?.content;
};

export async function POST(req: Request) {
  try {
    let messages;
    try {
      const body = await req.json();
      messages = body.messages;
      if (!Array.isArray(messages)) {
        throw new Error('Messages must be an array');
      }
    } catch (e) {
      console.error('Error parsing request:', e);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Add system message if not present
    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'You are a helpful project assistant that provides information about projects and their progress.'
    };

    const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    if (!formattedMessages.some(msg => msg.role === 'system')) {
      formattedMessages.unshift(systemMessage);
    }

    console.log('Processing chat request with messages:', messages);

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text || ''
      })).filter((msg: any) => msg.content.trim()),
      max_tokens: 1000,
      temperature: 0.7,
    };    if (!requestBody.messages.length) {
      return NextResponse.json(
        { error: 'No valid messages to process' },
        { status: 400 }
      );
    }    console.log('Processing chat request with formatted messages:', {
      messageCount: formattedMessages.length,
      hasSystemMessage: formattedMessages[0]?.role === 'system'
    });

    const response = await aiService.getChatCompletion(formattedMessages);
    const aiMessage = response.choices[0].message.content;
    const suggestions = extractSuggestionsFromResponse(aiMessage);

    return NextResponse.json({
      message: aiMessage,
      suggestions
    });let data;
    try {
      data = await response.json();
      console.log('OpenAI response structure:', {
        status: response.status,
        hasError: !!data.error,
        hasChoices: !!data.choices,
        firstChoice: data.choices?.[0] ? 'present' : 'missing'
      });
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    if (!response.ok || isErrorResponse(data)) {
      const errorMessage = data.error?.message || 'Failed to get response from OpenAI';
      console.error('OpenAI API error:', errorMessage, data.error);
      return NextResponse.json(
        { error: `AI service error: ${errorMessage}` },
        { status: response.status || 500 }
      );
    }

    const result = {
      message: data.choices[0].message.content,
      suggestions: extractSuggestions(data.choices[0].message.content)
    };

    console.log('Processed response:', result);
    return NextResponse.json(result);  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

function extractSuggestionsFromResponse(text: string): string[] {
  const lines = text.split('\n');
  const suggestions: string[] = [];

  lines.forEach(line => {
    // Look for bullet points or numbered items
    if (line.match(/^[-•*]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/)) {
      const suggestion = line.replace(/^[-•*\d.]\s+/, '').trim();
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
  });

  // If no bullet points found, try to extract key phrases
  if (suggestions.length === 0) {
    const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
    return sentences.slice(0, 3);
  }

  return suggestions.slice(0, 5); // Return up to 5 suggestions
}

function extractSuggestions(text: string): string[] {
  // Extract suggestions from the response text
  // Look for bullet points, numbered lists, or specifically marked suggestions
  const suggestionPatterns = [
    /(?:^|\n)[-•*]\s*([^\n]+)/g,  // Matches bullet points
    /(?:^|\n)\d+\.\s*([^\n]+)/g,  // Matches numbered lists
    /\[suggestion:\s*([^\]]+)\]/g  // Matches [suggestion: text]
  ];

  const suggestions: string[] = [];
  for (const pattern of suggestionPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        suggestions.push(match[1].trim());
      }
    }
  }

  // If no structured suggestions found, split by sentences and take up to 3
  if (suggestions.length === 0) {
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}
