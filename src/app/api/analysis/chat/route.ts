import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

// Language-specific responses for the chatbot
const getLanguageResponses = (language: string) => {
  const responses = {
    en: {
      projectAnalysis: "Based on the project data, I can see current progress, milestones, and resource allocation. The project appears to be on track with some areas requiring attention for optimal performance.",
      financialInsights: "The financial analysis shows budget utilization, revenue trends, and cost patterns. I can provide detailed breakdowns of expenses and suggest optimization strategies.",
      resourceReview: "Resource utilization indicates team capacity, skill distribution, and workload balance. There are opportunities for better resource allocation and efficiency improvements.",
      generalAssistance: "I'm here to help with your business intelligence needs. I can analyze data, generate reports, and provide insights for better decision-making.",
      suggestions: ['Project status updates', 'Financial overview', 'Resource allocation', 'Risk analysis', 'Performance metrics']
    },
    fr: {
      projectAnalysis: "Basé sur les données du projet, je peux voir le progrès actuel, les jalons, et l'allocation des ressources. Le projet semble être sur la bonne voie avec quelques domaines nécessitant attention pour une performance optimale.",
      financialInsights: "L'analyse financière montre l'utilisation du budget, les tendances de revenus, et les patterns de coûts. Je peux fournir des ventilations détaillées des dépenses et suggérer des stratégies d'optimisation.",
      resourceReview: "L'utilisation des ressources indique la capacité d'équipe, la distribution des compétences, et l'équilibre de la charge de travail. Il y a des opportunités pour une meilleure allocation des ressources et des améliorations d'efficacité.",
      generalAssistance: "Je suis là pour aider avec vos besoins en intelligence d'affaires. Je peux analyser des données, générer des rapports, et fournir des insights pour une meilleure prise de décision.",
      suggestions: ['Mises à jour du statut du projet', 'Aperçu financier', 'Allocation des ressources', 'Analyse des risques', 'Métriques de performance']
    },
    tn: {
      projectAnalysis: "بناءً على بيانات المشروع، يمكنني رؤية التقدم الحالي والمعالم وتوزيع الموارد. يبدو أن المشروع يسير على الطريق الصحيح مع بعض المجالات التي تتطلب الاهتمام للحصول على الأداء الأمثل.",
      financialInsights: "يُظهر التحليل المالي استخدام الميزانية واتجاهات الإيرادات وأنماط التكاليف. يمكنني تقديم تفصيلات مفصلة للمصروفات واقتراح استراتيجيات التحسين.",
      resourceReview: "يشير استخدام الموارد إلى سعة الفريق وتوزيع المهارات وتوازن عبء العمل. هناك فرص لتوزيع أفضل للموارد وتحسينات في الكفاءة.",
      generalAssistance: "أنا هنا للمساعدة في احتياجات ذكاء الأعمال. يمكنني تحليل البيانات وإنتاج التقارير وتقديم الرؤى لاتخاذ قرارات أفضل.",
      suggestions: ['تحديثات حالة المشروع', 'نظرة عامة مالية', 'توزيع الموارد', 'تحليل المخاطر', 'مقاييس الأداء']
    }
  };
  
  return responses[language as keyof typeof responses] || responses.en;
};

const detectLanguage = (message: string): string => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const frenchWords = ['bonjour', 'merci', 'comment', 'projet', 'rapport', 'analyse', 'financier'];
  
  if (arabicRegex.test(message)) {
    return 'tn';
  }
  
  const lowerMessage = message.toLowerCase();
  if (frenchWords.some(word => lowerMessage.includes(word))) {
    return 'fr';
  }
  
  return 'en';
};

const generateContextualResponse = (message: string, language: string): { reply: string; suggestions: string[] } => {
  const responses = getLanguageResponses(language);
  const lowerMessage = message.toLowerCase();
  
  // Project-related keywords
  if (lowerMessage.includes('project') || lowerMessage.includes('مشروع') || lowerMessage.includes('projet')) {
    return {
      reply: responses.projectAnalysis,
      suggestions: responses.suggestions.filter(s => 
        s.toLowerCase().includes('project') || s.includes('مشروع') || s.toLowerCase().includes('projet')
      )
    };
  }
  
  // Financial keywords
  if (lowerMessage.includes('financial') || lowerMessage.includes('budget') || lowerMessage.includes('مالي') || lowerMessage.includes('ميزانية') || lowerMessage.includes('financier')) {
    return {
      reply: responses.financialInsights,
      suggestions: responses.suggestions.filter(s => 
        s.toLowerCase().includes('financial') || s.includes('مالي') || s.toLowerCase().includes('financier')
      )
    };
  }
  
  // Resource keywords
  if (lowerMessage.includes('resource') || lowerMessage.includes('team') || lowerMessage.includes('موارد') || lowerMessage.includes('فريق') || lowerMessage.includes('ressource') || lowerMessage.includes('équipe')) {
    return {
      reply: responses.resourceReview,
      suggestions: responses.suggestions.filter(s => 
        s.toLowerCase().includes('resource') || s.includes('موارد') || s.toLowerCase().includes('ressource')
      )
    };
  }
  
  // Default response
  return {
    reply: responses.generalAssistance,
    suggestions: responses.suggestions.slice(0, 3)
  };
};

export async function POST(request: NextRequest) {
  let requestMessage = '';
  let requestContext = undefined;
  let extractedText = '';
  let fileName = '';
  let language = 'en';

  try {
    const body = await request.json();
    const { message, context, extractedText: docText, question, fileType, fileName: docFileName, language: requestLanguage } = body;
    
    // Handle both chat messages and document analysis
    requestMessage = message || question || '';
    requestContext = context;
    extractedText = docText || '';
    fileName = docFileName || '';
    language = requestLanguage || detectLanguage(requestMessage);
    
    console.log('Received request:', { 
      message: requestMessage, 
      context: requestContext, 
      hasDocumentText: !!extractedText,
      language: language 
    });

    if (!requestMessage) {
      return NextResponse.json({ error: 'No message or question provided.' }, { status: 400 });
    }try {
      console.log('🚀 Calling AI service for document analysis...');
      
      // Create enhanced context for document analysis
      let enhancedContext = requestContext || '';
      if (extractedText) {
        enhancedContext = `DOCUMENT ANALYSIS REQUEST
        
File: ${fileName}
Type: ${body.fileType?.toUpperCase() || 'Unknown'}
Content Length: ${extractedText.length} characters

DOCUMENT CONTENT:
${extractedText}

USER QUESTION: ${requestMessage}

Please provide a comprehensive analysis including:
1. Key insights and findings
2. Data patterns or document highlights  
3. Actionable recommendations
4. Potential risks or opportunities

Format your response clearly with headings and bullet points for easy reading.`;

        requestMessage = `Analyze the document "${fileName}" and answer: ${requestMessage}`;
      }
      
      const response = await aiService.sendChatMessage(requestMessage, enhancedContext);
      console.log('✅ AI service responded successfully');
      
      if (!response.reply) {
        throw new Error('No reply received from AI service');
      }      // For document analysis, return consistent format
      if (extractedText) {
        return NextResponse.json({ 
          reply: response.reply,
          analysis: response.reply, // Keep both for compatibility
          suggestions: response.suggestions || [
            'Ask about specific metrics',
            'Request trend analysis', 
            'Get detailed recommendations',
            'Identify potential risks'
          ]
        }, { status: 200 });
      }

      return NextResponse.json(response, { status: 200 });    } catch (aiError) {
      console.error('AI service error:', aiError);
      
      // Generate contextual response based on language and message content
      const contextualResponse = generateContextualResponse(requestMessage, language);
      
      // Return a more relevant test response for document analysis
      if (extractedText) {
        const responses = getLanguageResponses(language);
        return NextResponse.json({
          analysis: contextualResponse.reply,
          reply: contextualResponse.reply,
          suggestions: contextualResponse.suggestions
        }, { status: 200 });
      }
      
      // Return a contextual response for regular chat
      return NextResponse.json({
        reply: contextualResponse.reply,
        suggestions: contextualResponse.suggestions
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