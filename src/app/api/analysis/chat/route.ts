import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(request: NextRequest) {
  let requestMessage = '';
  let requestContext = undefined;

  try {
    const body = await request.json();
    const { message, context } = body;
    requestMessage = message;
    requestContext = context;
    
    console.log('Received request:', { message, context });

    if (!message) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
    }

    try {
      console.log('Calling AI service...');
      const response = await aiService.sendChatMessage(message, context);
      console.log('AI service response:', response);
      
      if (!response.reply) {
        throw new Error('No reply received from AI service');
      }

      return NextResponse.json(response, { status: 200 });
    } catch (aiError) {
      console.error('AI service error:', aiError);
      
      // Return a test response for now to check if the communication works
      return NextResponse.json({
        reply: `I received your message: "${message}". This is a test response while we debug the AI service connection.`,
        suggestions: ['Tell me about the project', 'Show financial data', 'List resources']
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    
    return NextResponse.json({ 
      error: 'Failed to process chat message.', 
      details: errorMessage,
      requestData: { message: requestMessage, context: requestContext }
    }, { status: 500 });
  }
}