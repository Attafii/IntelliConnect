import axios from 'axios';
import { envConfig, isApiConfigured } from './envConfig';

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
}

// Generative Engine API Configuration using environment variables
const GENERATIVE_API_CONFIG = {
  API_URL: envConfig.generativeApiUrl,
  API_KEY: envConfig.generativeApiKey,
  TIMEOUT: envConfig.apiTimeout,
  // Available models based on your documentation
  MODELS: {
    CLAUDE_SONNET: envConfig.claudeSonnetModel,
    NOVA_LITE: envConfig.novaLiteModel,
    OPENAI_GPT4: envConfig.openaiGpt4Model,
    OPENAI_GPT35: envConfig.openaiGpt35Model
  }
};

async function invokeLLM(prompt: string, modelName: string = GENERATIVE_API_CONFIG.MODELS.NOVA_LITE) {
  // Check if API key is available
  if (!GENERATIVE_API_CONFIG.API_KEY) {
    throw new Error('GENERATIVE_API_KEY environment variable is not set');
  }

  // Ensure prompt doesn't exceed reasonable limits (leave room for response)
  const maxPromptLength = 8000;
  const truncatedPrompt = prompt.length > maxPromptLength ? 
    prompt.substring(0, maxPromptLength) + "\n\n[Content truncated for API limits]" : 
    prompt;

  const payload = {
    action: "run",
    modelInterface: "langchain",
    data: {
      mode: "chain",
      text: truncatedPrompt,
      files: [],
      modelName: modelName,
      provider: modelName.includes("anthropic") ? "bedrock" : 
               modelName.includes("amazon") ? "bedrock" : "azure",
      sessionId: `intelliconnect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modelKwargs: {
        maxTokens: envConfig.maxTokens,
        temperature: envConfig.temperature,
        streaming: false,
        topP: envConfig.topP
      }
    }
  };

  try {    console.log('🚀 Sending request to Generative Engine API v2...');
    console.log('🤖 Using model:', modelName);
    console.log('📏 Prompt length:', truncatedPrompt.length);
    
    const response = await axios.post(GENERATIVE_API_CONFIG.API_URL, payload, {
      headers: {
        'x-api-key': GENERATIVE_API_CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `${envConfig.appName}/${envConfig.appVersion}`
      },
      timeout: GENERATIVE_API_CONFIG.TIMEOUT
    });

    if (response.status === 200) {
      const data = response.data;
      console.log('✅ API Response received successfully');
      console.log('📋 Response structure:', {
        hasData: !!data,
        hasContent: !!(data && data.content),
        hasDataContent: !!(data && data.data && data.data.content),
        dataKeys: data ? Object.keys(data) : []
      });
      
      // Handle different response formats from Generative Engine API
      if (data && data.content) {
        // Direct content in response root
        return data.content;
      } else if (data && data.data && data.data.content) {
        // Content nested in data.data.content
        return data.data.content;
      } else if (typeof data === 'string') {
        // Response is a direct string
        return data;
      } else {
        console.warn('⚠️ Unexpected response format:', JSON.stringify(data, null, 2));
        return "Unable to parse AI response. The API returned an unexpected format.";
      }
    } else {
      throw new Error(`API returned status ${response.status}: ${response.data}`);
    }
  } catch (error) {
    console.error('❌ Generative Engine API error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data || error.message}`);
    }
    throw error;
  }
}

export const aiService = {
  async sendChatMessage(message: string, context?: string): Promise<ChatResponse> {
    try {
      // Check if API is properly configured
      if (!isApiConfigured()) {
        console.warn('⚠️ API not configured properly, using fallback');
        return generateMockAnalysis(message, context);
      }

      console.log('🤖 AI Service: Starting document analysis...');
      console.log('📊 Context length:', context?.length || 0);
      console.log('❓ Question:', message);
      
      const systemMessage = `You are an expert AI document analyst powered by the Generative Engine API. Your role is to provide comprehensive, actionable insights from uploaded documents.

For PDF documents: Extract key information, summarize main points, identify trends, and provide strategic recommendations.
For CSV data: Analyze patterns, calculate statistics, identify anomalies, and suggest data-driven actions.

Always provide:
1. Clear, structured analysis
2. Key insights and findings
3. Actionable recommendations
4. Potential risks or opportunities

Be specific, professional, and focus on business value.`;

      // Create comprehensive prompt
      let fullPrompt = systemMessage;
      if (context) {
        fullPrompt += `\n\nDocument Context:\n${context}`;
      }
      fullPrompt += `\n\nUser Question: ${message}`;      // Improved model selection and fallback strategy
      let responseText: string;
      try {
        // Start with Nova Lite (more reliable for standard applications)
        responseText = await invokeLLM(fullPrompt, GENERATIVE_API_CONFIG.MODELS.NOVA_LITE);
      } catch (novaError) {
        console.warn('⚠️ Nova Lite failed, trying Claude Sonnet:', novaError);
        try {
          responseText = await invokeLLM(fullPrompt, GENERATIVE_API_CONFIG.MODELS.CLAUDE_SONNET);
        } catch (claudeError) {
          console.warn('⚠️ Claude failed, trying OpenAI GPT-4:', claudeError);
          try {
            responseText = await invokeLLM(fullPrompt, GENERATIVE_API_CONFIG.MODELS.OPENAI_GPT4);
          } catch (openaiError) {
            console.error('❌ All AI models failed, using intelligent fallback');
            // Intelligent fallback analysis
            responseText = generateIntelligentFallback(message, context);
          }
        }
      }

      console.log('📝 Response length:', responseText?.length || 0);

      // Enhanced suggestion extraction based on document type and content
      let suggestions = ['Ask for more details', 'Request specific metrics', 'Get recommendations'];
      
      try {
        // Extract suggestions if the AI provided them in a specific format
        const suggestionsMatch = responseText.match(/(?:Suggested questions?|Follow-up|Next steps?):\s*\n?(.*?)(?:\n\n|\n$|$)/i);
        if (suggestionsMatch && suggestionsMatch[1]) {
          const extractedSuggestions = suggestionsMatch[1]
            .split(/\n|,|\|/)
            .map((s: string) => s.replace(/^[-*•]\s*/, '').trim())
            .filter((s: string) => s.length > 0 && s.length < 100)
            .slice(0, 4);
          
          if (extractedSuggestions.length > 0) {
            suggestions = extractedSuggestions;
          }
        }
      } catch (e) {
        console.warn('⚠️ Failed to extract suggestions:', e);
      }

      console.log('🎯 Generated suggestions:', suggestions);

      return {
        reply: responseText?.trim() || 'No response from AI',
        suggestions
      };    } catch (error) {
      console.error('❌ AI Service error:', error);
      console.log('🔄 Falling back to mock AI service...');
      
      // Enhanced error handling with intelligent fallback
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack?.slice(0, 500)
        });
      }
      
      // Use mock AI service as fallback
      try {
        return generateMockAnalysis(message, context);
      } catch (fallbackError) {
        console.error('❌ Fallback AI service also failed:', fallbackError);
        return {
          reply: "I apologize, but both the primary AI service and fallback analysis are currently unavailable. Please try again later or contact support.",
          suggestions: ["Try again in a few minutes", "Check your internet connection", "Contact technical support"]
        };
      }
    }
  }
};

// Mock AI service fallback for when external API is unavailable
function generateMockAnalysis(message: string, context?: string): ChatResponse {
  console.log('🔄 Using mock AI service as fallback');
  
  if (!context) {
    return {
      reply: "I apologize, but the AI analysis service is temporarily unavailable and no document content was provided for analysis.",
      suggestions: ["Try uploading the document again", "Check your internet connection", "Contact support if the issue persists"]
    };
  }

  // Analyze the extracted content to provide relevant insights
  const content = context.toLowerCase();
  const contentLength = context.length;
  
  // Extract key information from content
  const hasFinancialData = /(\$|revenue|profit|budget|cost|expense|income|roi|margin)/i.test(content);
  const hasProjectData = /project|milestone|deadline|progress|completion|status|phase/i.test(content);
  const hasRiskData = /risk|threat|vulnerability|compliance|security|audit/i.test(content);
  const hasPerformanceData = /performance|metric|kpi|target|goal|achievement|success/i.test(content);
  
  // Extract numbers and percentages for analysis
  const numbers = context.match(/\d+(?:\.\d+)?(?:%|\$|M|K|million|thousand|billion)/gi) || [];
  const percentages = context.match(/\d+(?:\.\d+)?%/g) || [];
  
  // Generate contextual analysis
  let analysis = "## Document Analysis Summary\n\n";
  
  // Document overview
  analysis += `**Document Overview:**\n`;
  analysis += `- Content length: ${contentLength.toLocaleString()} characters\n`;
  analysis += `- Document type: ${hasFinancialData ? 'Financial Report' : hasProjectData ? 'Project Report' : hasRiskData ? 'Risk Assessment' : 'Business Document'}\n`;
  analysis += `- Key metrics identified: ${numbers.length} numerical values\n\n`;
  
  // Content-specific insights
  if (hasFinancialData) {
    analysis += `**Financial Insights:**\n`;
    if (numbers.length > 0) {
      analysis += `- Key financial figures: ${numbers.slice(0, 3).join(', ')}\n`;
    }
    if (content.includes('revenue') || content.includes('profit')) {
      analysis += `- Revenue/profit analysis indicates business performance trends\n`;
    }
    analysis += `- Financial data suggests ${percentages.length > 0 ? 'measurable performance metrics' : 'operational financial information'}\n\n`;
  }
  
  if (hasProjectData) {
    analysis += `**Project Analysis:**\n`;
    if (content.includes('completion') || content.includes('progress')) {
      analysis += `- Project progress indicators identified\n`;
    }
    if (percentages.length > 0) {
      analysis += `- Completion metrics: ${percentages.slice(0, 2).join(', ')}\n`;
    }
    analysis += `- Project status documentation suggests active project management\n\n`;
  }
  
  if (hasRiskData) {
    analysis += `**Risk Assessment:**\n`;
    analysis += `- Risk factors and mitigation strategies documented\n`;
    if (content.includes('high') || content.includes('medium') || content.includes('low')) {
      analysis += `- Risk levels categorized and assessed\n`;
    }
    analysis += `- Compliance and security considerations addressed\n\n`;
  }
  
  // Key findings
  analysis += `**Key Findings:**\n`;
  const keyWords = context.match(/\b(increase|decrease|improve|growth|decline|success|challenge|opportunity|threat)\b/gi) || [];
  if (keyWords.length > 0) {
    analysis += `- Document contains ${keyWords.length} performance indicators\n`;
  }
  
  // Extract potential actions or recommendations from content
  const actionWords = context.match(/\b(recommend|suggest|should|must|need|implement|develop|create|establish)\b/gi) || [];
  if (actionWords.length > 0) {
    analysis += `- ${actionWords.length} actionable recommendations identified\n`;
  }
  
  analysis += `- Content analysis indicates ${contentLength > 1000 ? 'comprehensive' : 'summary-level'} documentation\n\n`;
  
  // Recommendations
  analysis += `**Strategic Recommendations:**\n`;
  analysis += `1. **Data Validation**: Verify the accuracy of key metrics and figures mentioned\n`;
  analysis += `2. **Trend Analysis**: Compare current data with historical performance for context\n`;
  analysis += `3. **Action Planning**: Develop specific action items based on identified insights\n`;
  if (hasRiskData) {
    analysis += `4. **Risk Mitigation**: Implement recommended risk management strategies\n`;
  }
  if (hasProjectData) {
    analysis += `4. **Project Monitoring**: Establish regular progress review cycles\n`;
  }
  
  analysis += `\n**Note**: This analysis is generated by a fallback system. For more detailed insights, please ensure the AI analysis service is available.`;
  
  // Generate relevant suggestions based on content type
  let suggestions = ["Request detailed breakdown of key metrics", "Ask for trend analysis over time", "Get specific action recommendations"];
  
  if (hasFinancialData) {
    suggestions = [
      "What are the key financial performance drivers?",
      "How do these results compare to industry benchmarks?",
      "What are the financial risks and opportunities?"
    ];
  } else if (hasProjectData) {
    suggestions = [
      "What are the critical milestones and deadlines?",
      "What risks could impact project delivery?",
      "What resources are needed to ensure success?"
    ];
  } else if (hasRiskData) {
    suggestions = [
      "What are the highest priority risks to address?",
      "What mitigation strategies are most effective?",
      "How should we monitor and measure risk levels?"
    ];
  }
  
  return {
    reply: analysis,
    suggestions
  };
}

function generateIntelligentFallback(message: string, context?: string): string {
  console.log('🤖 Generating intelligent fallback analysis...');
  
  if (!context) {
    return `# Document Analysis - Offline Mode

I apologize, but the AI analysis service is temporarily unavailable. However, I can see that you've uploaded a document and asked: "${message}"

## What I can tell you:
- Your document has been successfully processed and text extracted
- The system is ready to provide analysis once the AI service is restored

## Next Steps:
1. Please try again in a few moments
2. Check your internet connection
3. Contact support if the issue persists

## Suggested Questions:
- "What are the key insights from this document?"
- "Summarize the main findings"
- "What recommendations can you provide?"`;
  }

  // Analyze content patterns to provide intelligent insights
  const content = context.toLowerCase();
  const contentLength = context.length;
  
  // Detect document type and key elements
  const isFinancial = content.includes('revenue') || content.includes('profit') || content.includes('budget') || content.includes('financial');
  const isProject = content.includes('project') || content.includes('milestone') || content.includes('timeline') || content.includes('deliverable');
  const isRisk = content.includes('risk') || content.includes('threat') || content.includes('vulnerability') || content.includes('compliance');
  const isReport = content.includes('report') || content.includes('analysis') || content.includes('summary') || content.includes('executive');
  
  // Extract key metrics and numbers
  const numbers = context.match(/\d+(?:\.\d+)?%?/g) || [];
  const currencies = context.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
  const dates = context.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{1,2}-\d{1,2}|Q[1-4]\s\d{4}/g) || [];
  
  // Extract potential key topics (words that appear frequently or are capitalized)
  const words = context.split(/\s+/);
  const capitalizedWords = words.filter(word => /^[A-Z][a-z]+/.test(word) && word.length > 3);
  const keyTopics = [...new Set(capitalizedWords.slice(0, 10))];
  
  let analysis = `# Document Analysis - Intelligent Fallback\n\n`;
  analysis += `*Note: This analysis is generated using content pattern recognition while the AI service is being restored.*\n\n`;
  
  // Document summary
  analysis += `## Document Summary\n`;
  analysis += `- **Content Length**: ${contentLength.toLocaleString()} characters\n`;
  analysis += `- **Document Type**: ${isFinancial ? 'Financial Document' : isProject ? 'Project Document' : isRisk ? 'Risk Assessment' : isReport ? 'Analysis Report' : 'General Document'}\n`;
  
  if (dates.length > 0) {
    analysis += `- **Key Dates**: ${dates.slice(0, 3).join(', ')}\n`;
  }
  
  analysis += `\n`;
  
  // Key findings based on content type
  analysis += `## Key Findings\n`;
  
  if (isFinancial && (numbers.length > 0 || currencies.length > 0)) {
    analysis += `### Financial Highlights\n`;
    if (currencies.length > 0) {
      analysis += `- **Financial Values Detected**: ${currencies.slice(0, 5).join(', ')}\n`;
    }
    if (numbers.length > 0) {
      analysis += `- **Key Metrics**: ${numbers.slice(0, 8).join(', ')}\n`;
    }
  }
  
  if (isProject) {
    analysis += `### Project Information\n`;
    analysis += `- Document contains project-related content\n`;
    if (numbers.length > 0) {
      const percentages = numbers.filter(n => n.includes('%'));
      if (percentages.length > 0) {
        analysis += `- **Progress Indicators**: ${percentages.slice(0, 3).join(', ')}\n`;
      }
    }
  }
  
  if (keyTopics.length > 0) {
    analysis += `### Key Topics Identified\n`;
    analysis += `- ${keyTopics.slice(0, 6).join(', ')}\n`;
  }
  
  analysis += `\n## Intelligent Recommendations\n`;
  
  if (isFinancial) {
    analysis += `- Review financial performance metrics and trends\n`;
    analysis += `- Analyze budget allocation and variance\n`;
    analysis += `- Identify cost optimization opportunities\n`;
  } else if (isProject) {
    analysis += `- Monitor project timeline and milestone completion\n`;
    analysis += `- Assess resource allocation and utilization\n`;
    analysis += `- Review risk factors and mitigation strategies\n`;
  } else if (isRisk) {
    analysis += `- Evaluate risk probability and impact levels\n`;
    analysis += `- Develop comprehensive mitigation plans\n`;
    analysis += `- Establish monitoring and review procedures\n`;
  } else {
    analysis += `- Conduct detailed analysis of key content areas\n`;
    analysis += `- Extract actionable insights from the data\n`;
    analysis += `- Develop strategic recommendations based on findings\n`;
  }
  
  analysis += `\n## Next Steps\n`;
  analysis += `1. **Immediate**: Try the analysis again as the AI service may now be available\n`;
  analysis += `2. **Manual Review**: Use the extracted content above for manual analysis\n`;
  analysis += `3. **Follow-up**: Ask specific questions about particular sections\n`;
  
  analysis += `\n## Content Preview\n`;
  analysis += `\`\`\`\n${context.substring(0, 500)}${context.length > 500 ? '...' : ''}\n\`\`\`\n`;
  
  analysis += `\n*This analysis will be enhanced once the AI service is restored.*`;
  
  return analysis;
}
