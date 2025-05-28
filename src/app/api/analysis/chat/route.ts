import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
    }

    // In a real application, you would use the 'message' and 'context' (uploaded file data summary)
    // to query a GenAI model or a knowledge base.
    console.log('Chat API received message:', message);
    console.log('Chat API received context:', context ? 'Context provided' : 'No context provided');

    // For now, return a mock response based on the message
    let replyText = "I'm a placeholder AI. I received your message.";
    if (typeof message === 'string') {
        if (message.toLowerCase().includes('risk')) {
            replyText = "Based on the (mock) data, potential risks include integration delays and budget overruns.";
        } else if (message.toLowerCase().includes('timeline')) {
            replyText = "The project timeline is (mocked as) Q1 2025 - Q4 2025, with key milestones like Phase 1 Delivery.";
        } else if (message.toLowerCase().includes('budget')) {
            replyText = "Budget details are currently N/A in this mock response, pending full analysis.";
        } else {
            replyText = `I received your question: "${message}". I am still under development to provide detailed answers.`;
        }
    }


    return NextResponse.json({ reply: replyText }, { status: 200 });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process chat message.', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}