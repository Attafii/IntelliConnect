import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { extractedText, message, question, fileName, fileType } = body;
    
    console.log('🔍 AI Document analysis request received:', { 
      fileName, 
      fileType, 
      contentLength: extractedText?.length || 0,
      question: message || question 
    });
    
    if (!extractedText || !fileName) {
      return NextResponse.json({ 
        error: 'Missing required fields: extractedText and fileName' 
      }, { status: 400 });
    }
    
    const userQuestion = message || question || 'Please analyze this document and provide insights';
    
    // Create enhanced context for AI analysis
    let analysisPrompt = '';
    
    if (fileType === 'text/csv' || fileName.includes('.csv')) {
      analysisPrompt = `You are an expert data analyst. Analyze this CSV data and provide detailed insights.

Document: ${fileName}
Type: CSV Data File

Data Content:
${extractedText}

User Question: ${userQuestion}

Please provide a comprehensive analysis including:
1. **Data Overview**: Structure, columns, and data quality
2. **Key Insights**: Patterns, trends, and notable findings
3. **Statistical Analysis**: Relevant metrics and calculations
4. **Recommendations**: Actionable suggestions based on the data
5. **Follow-up Questions**: Suggested areas for deeper analysis

Format your response with clear headings and bullet points for easy reading.`;

    } else if (fileType === 'application/pdf' || fileName.includes('.pdf')) {
      analysisPrompt = `You are an expert document analyst. Analyze this PDF document and provide detailed insights.

Document: ${fileName}
Type: PDF Document

Content:
${extractedText}

User Question: ${userQuestion}

Please provide a comprehensive analysis including:
1. **Document Summary**: Main themes and key points
2. **Key Findings**: Important information and insights
3. **Strategic Recommendations**: Actionable advice based on content
4. **Risk Assessment**: Potential concerns or opportunities
5. **Next Steps**: Suggested follow-up actions

Format your response with clear headings and bullet points for professional presentation.`;

    } else {
      analysisPrompt = `You are an expert document analyst. Analyze this document and provide detailed insights.

Document: ${fileName}
Content:
${extractedText}

User Question: ${userQuestion}

Please provide a comprehensive analysis with key insights, findings, and recommendations based on the document content.`;
    }
    
    try {
      console.log('🤖 Sending request to AI service...');
      
      // Use the AI service to get real AI analysis
      const aiResponse = await aiService.sendChatMessage(analysisPrompt);
      
      console.log('✅ AI analysis completed successfully');
      
      // Generate smart suggestions based on file type
      let suggestions = [];
      if (fileType === 'text/csv' || fileName.includes('.csv')) {
        suggestions = [
          'What are the key trends in this dataset?',
          'Can you identify any outliers or anomalies?',
          'What correlations exist between variables?',
          'What predictions can you make from this data?'
        ];
      } else if (fileType === 'application/pdf' || fileName.includes('.pdf')) {
        suggestions = [
          'What are the main conclusions?',
          'Identify key performance indicators',
          'What risks should be considered?',
          'What are the strategic implications?'
        ];
      } else {
        suggestions = [
          'What are the key takeaways?',
          'Can you provide more specific insights?',
          'What recommendations do you have?',
          'What should be the next steps?'
        ];
      }
      
      return NextResponse.json({
        reply: aiResponse.reply,
        analysis: aiResponse.reply, // Keep both for compatibility
        suggestions: aiResponse.suggestions || suggestions,
        metadata: {
          fileName,
          fileType,
          contentLength: extractedText.length,
          analysisTimestamp: new Date().toISOString(),
          aiModel: 'gpt-4o'
        }
      });
      
    } catch (aiError) {
      console.error('❌ AI service error:', aiError);
      
      // If AI fails, provide a meaningful error message
      return NextResponse.json({
        error: 'AI analysis temporarily unavailable',
        message: 'The AI service is currently experiencing issues. Please try again in a moment.',
        details: aiError.message,
        fallback: true
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('❌ Document analysis error:', error);
    
    return NextResponse.json({
      error: 'Failed to analyze document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
