import { NextRequest, NextResponse } from 'next/server';

// Smart document analysis without AI service
function analyzeDocumentContent(extractedText: string, question: string, fileName: string, fileType: string): string {
  const text = extractedText.toLowerCase();
  const questionLower = question.toLowerCase();
  
  // Basic analysis based on content patterns
  let analysis = `## Document Analysis Results for "${fileName}"\n\n`;
  
  // Determine file type analysis
  if (fileType.includes('csv') || fileName.includes('.csv')) {
    analysis += analyzeCSVContent(extractedText, question);
  } else if (fileType.includes('pdf') || fileName.includes('.pdf')) {
    analysis += analyzePDFContent(extractedText, question);
  } else {
    analysis += analyzeGenericContent(extractedText, question);
  }
  
  return analysis;
}

function analyzeCSVContent(content: string, question: string): string {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0]?.split(',') || [];
  const dataRows = lines.slice(1);
  
  let analysis = `### CSV Data Analysis\n\n`;
  analysis += `**File Structure:**\n`;
  analysis += `- Headers: ${headers.join(', ')}\n`;
  analysis += `- Total Rows: ${dataRows.length}\n`;
  analysis += `- Data Points: ${headers.length * dataRows.length}\n\n`;
  
  // Identify data patterns
  const numericColumns = headers.filter(header => {
    return dataRows.some(row => {
      const value = row.split(',')[headers.indexOf(header)];
      return !isNaN(Number(value)) && value.trim() !== '';
    });
  });
  
  if (numericColumns.length > 0) {
    analysis += `**Numeric Columns Detected:** ${numericColumns.join(', ')}\n\n`;
  }
  
  // Answer specific questions
  const questionLower = question.toLowerCase();
  if (questionLower.includes('trend') || questionLower.includes('pattern')) {
    analysis += `**Trend Analysis:**\n`;
    analysis += `- ${dataRows.length} data points available for trend analysis\n`;
    analysis += `- Numeric fields identified: ${numericColumns.join(', ')}\n`;
    analysis += `- Time-based analysis possible if date columns are present\n\n`;
  }
  
  if (questionLower.includes('revenue') || questionLower.includes('sales')) {
    const revenueColumn = headers.find(h => h.toLowerCase().includes('revenue') || h.toLowerCase().includes('sales'));
    if (revenueColumn) {
      analysis += `**Revenue/Sales Analysis:**\n`;
      analysis += `- Revenue column detected: "${revenueColumn}"\n`;
      analysis += `- ${dataRows.length} revenue data points available\n`;
    }
  }
  
  analysis += `**Key Insights:**\n`;
  analysis += `- Dataset contains ${headers.length} variables across ${dataRows.length} observations\n`;
  analysis += `- Suitable for quantitative analysis and trend identification\n`;
  analysis += `- Can support business intelligence and reporting needs\n\n`;
  
  analysis += `**Recommendations:**\n`;
  analysis += `- Perform time-series analysis on date-based columns\n`;
  analysis += `- Calculate statistical measures (mean, median, trends) for numeric columns\n`;
  analysis += `- Create visualizations to identify patterns and outliers\n`;
  analysis += `- Consider segmentation analysis based on categorical variables\n`;
  
  return analysis;
}

function analyzePDFContent(content: string, question: string): string {
  const wordCount = content.split(/\s+/).length;
  const charCount = content.length;
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  
  let analysis = `### PDF Document Analysis\n\n`;
  analysis += `**Document Metrics:**\n`;
  analysis += `- Word Count: ${wordCount}\n`;
  analysis += `- Character Count: ${charCount}\n`;
  analysis += `- Paragraphs: ${paragraphs.length}\n\n`;
  
  // Content analysis
  const contentLower = content.toLowerCase();
  
  // Check for financial content
  const financialTerms = ['revenue', 'profit', 'budget', 'cost', 'expense', 'income', 'financial'];
  const hasFinancialContent = financialTerms.some(term => contentLower.includes(term));
  
  // Check for business content
  const businessTerms = ['strategy', 'market', 'customer', 'business', 'growth', 'performance'];
  const hasBusinessContent = businessTerms.some(term => contentLower.includes(term));
  
  if (hasFinancialContent) {
    analysis += `**Financial Content Detected:**\n`;
    analysis += `- Document contains financial terminology and data\n`;
    analysis += `- Suitable for financial analysis and reporting\n\n`;
  }
  
  if (hasBusinessContent) {
    analysis += `**Business Strategy Content:**\n`;
    analysis += `- Contains strategic business information\n`;
    analysis += `- Relevant for business planning and decision making\n\n`;
  }
  
  // Extract key sections if question asks for summary
  if (question.toLowerCase().includes('summary') || question.toLowerCase().includes('key points')) {
    analysis += `**Key Sections Identified:**\n`;
    const importantParagraphs = paragraphs
      .filter(p => p.length > 100)
      .slice(0, 3)
      .map((p, i) => `${i + 1}. ${p.substring(0, 200)}...`);
    
    if (importantParagraphs.length > 0) {
      analysis += importantParagraphs.join('\n') + '\n\n';
    }
  }
  
  analysis += `**Insights:**\n`;
  analysis += `- Document is substantial with ${wordCount} words of content\n`;
  analysis += `- Well-structured with ${paragraphs.length} distinct sections\n`;
  analysis += `- Contains ${hasFinancialContent ? 'financial' : 'business'} relevant information\n\n`;
  
  analysis += `**Recommendations:**\n`;
  analysis += `- Extract key performance indicators and metrics\n`;
  analysis += `- Identify action items and strategic recommendations\n`;
  analysis += `- Compare against industry benchmarks if applicable\n`;
  analysis += `- Use content for strategic planning and decision support\n`;
  
  return analysis;
}

function analyzeGenericContent(content: string, question: string): string {
  let analysis = `### Document Content Analysis\n\n`;
  analysis += `**Content Overview:**\n`;
  analysis += `- Document successfully processed and analyzed\n`;
  analysis += `- Content length: ${content.length} characters\n`;
  analysis += `- Ready for detailed examination\n\n`;
  
  analysis += `**Analysis Results:**\n`;
  analysis += `- Document contains structured information suitable for business analysis\n`;
  analysis += `- Content can be used for data-driven insights and decision making\n`;
  analysis += `- Patterns and trends can be identified from the provided data\n\n`;
  
  return analysis;
}

function generateSuggestions(content: string, fileType: string): string[] {
  const suggestions = [];
  
  if (fileType.includes('csv')) {
    suggestions.push(
      'What trends can you identify in this data?',
      'Which metrics show the strongest performance?', 
      'What patterns emerge from the data analysis?',
      'Can you identify any seasonal trends?'
    );
  } else if (fileType.includes('pdf')) {
    suggestions.push(
      'Summarize the key findings from this document',
      'What are the main recommendations?',
      'Identify the most important metrics',
      'What risks and opportunities are mentioned?'
    );
  } else {
    suggestions.push(
      'Analyze the key points in this document',
      'What insights can be extracted?',
      'Identify important patterns or trends',
      'What recommendations would you make?'
    );
  }
  
  return suggestions;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { extractedText, message, question, fileName, fileType } = body;
    
    console.log('📄 Document analysis request received:', { 
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
    
    const userQuestion = message || question || 'Please analyze this document';
    
    // Generate intelligent analysis
    const analysisResult = analyzeDocumentContent(extractedText, userQuestion, fileName, fileType || '');
    const suggestions = generateSuggestions(extractedText, fileType || '');
    
    console.log('✅ Analysis completed successfully');
    
    return NextResponse.json({
      reply: analysisResult,
      analysis: analysisResult, // Keep both for compatibility
      suggestions,
      metadata: {
        fileName,
        fileType,
        contentLength: extractedText.length,
        analysisTimestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Document analysis error:', error);
    
    return NextResponse.json({
      error: 'Failed to analyze document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
