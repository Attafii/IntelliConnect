import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/apiConfig';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { extractedText, question, fileName, fileType } = body;

    console.log('Document analysis request:', { 
      fileName, 
      fileType, 
      question, 
      textLength: extractedText?.length 
    });

    if (!extractedText || !question) {
      return NextResponse.json({ 
        error: 'Missing required fields: extractedText and question' 
      }, { status: 400 });
    }

    // Prepare the system message based on file type
    let systemMessage = 'You are an expert document analyzer. Analyze the provided document content and answer questions about it with detailed insights.';
    
    if (fileType === 'application/pdf') {
      systemMessage += ' This is content extracted from a PDF document. Focus on extracting key information, summaries, and insights.';
    } else if (fileType === 'text/csv') {
      systemMessage += ' This is data from a CSV file. Focus on data analysis, patterns, trends, and statistical insights.';
    }

    // Create the analysis prompt
    const analysisPrompt = `Document: ${fileName}
Type: ${fileType === 'application/pdf' ? 'PDF Document' : 'CSV Data'}

Content:
${extractedText}

Question: ${question}

Please provide a comprehensive analysis answering the question. If analyzing data, include relevant insights about patterns, trends, or anomalies. Be specific and actionable in your response.`;

    console.log('Sending request to OpenAI...');

    const response = await openai.chat.completions.create({
      model: 'openai.gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    console.log('OpenAI response received');

    const reply = response.choices[0]?.message?.content || 'No analysis available';

    // Generate relevant suggestions based on the file type and content
    let suggestions = [];
    if (fileType === 'application/pdf') {
      suggestions = [
        'What are the key takeaways?',
        'Summarize the main conclusions',
        'What action items are mentioned?',
        'Identify any risks or opportunities'
      ];
    } else if (fileType === 'text/csv') {
      suggestions = [
        'What patterns do you see in the data?',
        'Calculate summary statistics',
        'Identify outliers or anomalies',
        'What trends are emerging?'
      ];
    }

    return NextResponse.json({
      reply,
      suggestions,
      fileName,
      fileType
    });

  } catch (error) {
    console.error('Document analysis error:', error);
    
    // Provide a fallback response for testing
    const fallbackResponse = `I've received your document for analysis. While I'm experiencing some technical difficulties with the AI service, I can see that you've uploaded a document and asked: "${request.body?.question || 'a question'}".

This feature is designed to:
- Extract and analyze text from PDF documents
- Parse and analyze CSV data for patterns and insights  
- Provide intelligent answers to your specific questions
- Suggest follow-up analysis opportunities

Please try again, and the full AI analysis should be available once the service connection is restored.`;

    return NextResponse.json({
      reply: fallbackResponse,
      suggestions: [
        'Try asking about specific sections',
        'Request a summary of key points',
        'Ask for data trends or patterns',
        'Request recommendations based on the content'
      ]
    });
  }
}
