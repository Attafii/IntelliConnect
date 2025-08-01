// Language translations for the chatbot interface
export interface Translation {
  chatAssistant: string;
  typeMessage: string;
  hello: string;
  howCanIHelp: string;
  projectStatusUpdates: string;
  financialOverview: string;
  resourceAllocation: string;
  error: string;
  tryAgain: string;
  responseSpeed: string;
  analysisAndReports: string;
  budgetTracking: string;
  teamPerformance: string;
  riskManagement: string;
  marketInsights: string;
  documentAnalysis: string;
}

export interface BotResponses {
  greeting: string[];
  projectStatus: string[];
  financial: string[];
  resources: string[];
  general: string[];
  error: string;
}

export const translations: Record<string, Translation> = {
  en: {
    chatAssistant: "Chat Assistant",
    typeMessage: "Type your message...",
    hello: "Hello! How can I help you today?",
    howCanIHelp: "How can I help you today?",
    projectStatusUpdates: "Project status updates",
    financialOverview: "Financial overview", 
    resourceAllocation: "Resource allocation",
    error: "Sorry, I encountered an error",
    tryAgain: "Please try again",
    responseSpeed: "Response Speed",
    analysisAndReports: "Analysis and Reports",
    budgetTracking: "Budget Tracking",
    teamPerformance: "Team Performance",
    riskManagement: "Risk Management",
    marketInsights: "Market Insights",
    documentAnalysis: "Document Analysis"
  },
  
  fr: {
    chatAssistant: "Assistant de Chat",
    typeMessage: "Tapez votre message...",
    hello: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    howCanIHelp: "Comment puis-je vous aider aujourd'hui?",
    projectStatusUpdates: "Mises à jour du statut du projet",
    financialOverview: "Aperçu financier",
    resourceAllocation: "Allocation des ressources",
    error: "Désolé, j'ai rencontré une erreur",
    tryAgain: "Veuillez réessayer",
    responseSpeed: "Vitesse de réponse",
    analysisAndReports: "Analyses et Rapports",
    budgetTracking: "Suivi du Budget",
    teamPerformance: "Performance de l'Équipe",
    riskManagement: "Gestion des Risques",
    marketInsights: "Insights du Marché",
    documentAnalysis: "Analyse de Documents"
  },
  
  tn: {
    chatAssistant: "مساعد المحادثة",
    typeMessage: "اكتب رسالتك...",
    hello: "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟",
    howCanIHelp: "كيف يمكنني مساعدتك اليوم؟",
    projectStatusUpdates: "تحديثات حالة المشروع",
    financialOverview: "نظرة عامة مالية",
    resourceAllocation: "توزيع الموارد",
    error: "معذرة، واجهت خطأ",
    tryAgain: "يرجى المحاولة مرة أخرى",
    responseSpeed: "سرعة الاستجابة",
    analysisAndReports: "التحليلات والتقارير",
    budgetTracking: "تتبع الميزانية",
    teamPerformance: "أداء الفريق",
    riskManagement: "إدارة المخاطر",
    marketInsights: "رؤى السوق",
    documentAnalysis: "تحليل المستندات"
  }
};

export const botResponses: Record<string, BotResponses> = {
  en: {
    greeting: [
      "Hello! I'm your IntelliConnect assistant. I can help you with project management, financial analysis, resource planning, and much more. What would you like to know?",
      "Welcome! I'm here to assist you with your business intelligence needs. How can I help you today?",
      "Hi there! I can provide insights on your projects, finances, risks, and opportunities. What information are you looking for?"
    ],
    projectStatus: [
      "I can provide detailed project status updates including milestones, deadlines, team progress, and budget utilization. Which specific project would you like information about?",
      "Let me help you with project status. I can show you current progress, upcoming deadlines, resource allocation, and potential risks. What project details do you need?",
      "I have access to real-time project data. I can analyze completion rates, budget status, team performance, and timeline adherence. Which aspect interests you most?"
    ],
    financial: [
      "I can analyze your financial data including budget vs actual spending, revenue forecasts, cost breakdowns, and profitability metrics. What financial insights do you need?",
      "Let me help with financial analysis. I can provide budget reports, expense tracking, revenue projections, and cost optimization suggestions. What would you like to explore?",
      "I have comprehensive financial data available. I can analyze cash flow, profit margins, investment returns, and spending patterns. Which area should we focus on?"
    ],
    resources: [
      "I can analyze resource utilization including team capacity, skill availability, equipment usage, and allocation efficiency. What resource information do you need?",
      "Let me help with resource planning. I can show team workloads, skill gaps, capacity forecasts, and optimization opportunities. What aspect would you like to explore?",
      "I have detailed resource data available. I can analyze productivity metrics, allocation patterns, and utilization rates. Which resource area interests you?"
    ],
    general: [
      "I'm here to help with any business intelligence questions. I can analyze data, generate reports, provide insights, and assist with decision-making. What can I do for you?",
      "I can assist with various aspects of your business including analytics, reporting, forecasting, and strategic planning. How can I support your needs today?",
      "I'm equipped to handle complex business queries and provide data-driven insights. Whether it's analysis, reporting, or strategic guidance, I'm here to help!"
    ],
    error: "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question."
  },
  
  fr: {
    greeting: [
      "Bonjour! Je suis votre assistant IntelliConnect. Je peux vous aider avec la gestion de projet, l'analyse financière, la planification des ressources, et bien plus. Que souhaitez-vous savoir?",
      "Bienvenue! Je suis là pour vous assister avec vos besoins en intelligence d'affaires. Comment puis-je vous aider aujourd'hui?",
      "Salut! Je peux fournir des insights sur vos projets, finances, risques, et opportunités. Quelle information recherchez-vous?"
    ],
    projectStatus: [
      "Je peux fournir des mises à jour détaillées sur le statut des projets incluant les jalons, échéances, progrès d'équipe, et utilisation du budget. Sur quel projet spécifique voulez-vous des informations?",
      "Laissez-moi vous aider avec le statut des projets. Je peux montrer le progrès actuel, les échéances à venir, l'allocation des ressources, et les risques potentiels. Quels détails de projet avez-vous besoin?",
      "J'ai accès aux données de projet en temps réel. Je peux analyser les taux d'achèvement, le statut du budget, la performance d'équipe, et l'adhérence aux délais. Quel aspect vous intéresse le plus?"
    ],
    financial: [
      "Je peux analyser vos données financières incluant budget vs dépenses réelles, prévisions de revenus, ventilation des coûts, et métriques de rentabilité. Quels insights financiers avez-vous besoin?",
      "Laissez-moi aider avec l'analyse financière. Je peux fournir des rapports de budget, suivi des dépenses, projections de revenus, et suggestions d'optimisation des coûts. Que souhaitez-vous explorer?",
      "J'ai des données financières complètes disponibles. Je peux analyser le flux de trésorerie, les marges de profit, les retours d'investissement, et les patterns de dépenses. Sur quelle zone devrions-nous nous concentrer?"
    ],
    resources: [
      "Je peux analyser l'utilisation des ressources incluant la capacité d'équipe, la disponibilité des compétences, l'usage d'équipement, et l'efficacité d'allocation. Quelle information sur les ressources avez-vous besoin?",
      "Laissez-moi aider avec la planification des ressources. Je peux montrer les charges de travail d'équipe, les lacunes de compétences, les prévisions de capacité, et les opportunités d'optimisation. Quel aspect souhaitez-vous explorer?",
      "J'ai des données détaillées sur les ressources disponibles. Je peux analyser les métriques de productivité, les patterns d'allocation, et les taux d'utilisation. Quelle zone de ressources vous intéresse?"
    ],
    general: [
      "Je suis là pour aider avec toutes questions d'intelligence d'affaires. Je peux analyser des données, générer des rapports, fournir des insights, et assister avec la prise de décision. Que puis-je faire pour vous?",
      "Je peux assister avec divers aspects de votre business incluant l'analytique, le reporting, les prévisions, et la planification stratégique. Comment puis-je supporter vos besoins aujourd'hui?",
      "Je suis équipé pour gérer des requêtes business complexes et fournir des insights basés sur les données. Que ce soit l'analyse, le reporting, ou l'orientation stratégique, je suis là pour aider!"
    ],
    error: "Je m'excuse, mais j'ai rencontré une erreur en traitant votre demande. Veuillez réessayer ou reformuler votre question."
  },
  
  tn: {
    greeting: [
      "أهلاً وسهلاً! أنا مساعدك في IntelliConnect. يمكنني مساعدتك في إدارة المشاريع، التحليل المالي، تخطيط الموارد، وأكثر من ذلك. ماذا تريد أن تعرف؟",
      "مرحباً! أنا هنا لمساعدتك في احتياجات ذكاء الأعمال. كيف يمكنني مساعدتك اليوم؟",
      "أهلاً! يمكنني تقديم رؤى حول مشاريعك، الأمور المالية، المخاطر، والفرص. أي معلومات تبحث عنها؟"
    ],
    projectStatus: [
      "يمكنني تقديم تحديثات مفصلة عن حالة المشاريع تشمل المعالم، المواعيد النهائية، تقدم الفريق، واستخدام الميزانية. عن أي مشروع محدد تريد معلومات؟",
      "دعني أساعدك مع حالة المشاريع. يمكنني إظهار التقدم الحالي، المواعيد النهائية القادمة، توزيع الموارد، والمخاطر المحتملة. أي تفاصيل مشروع تحتاجها؟",
      "لدي إمكانية الوصول لبيانات المشاريع في الوقت الفعلي. يمكنني تحليل معدلات الإنجاز، حالة الميزانية، أداء الفريق، والالتزام بالجدول الزمني. أي جانب يهمك أكثر؟"
    ],
    financial: [
      "يمكنني تحليل بياناتك المالية تشمل الميزانية مقابل الإنفاق الفعلي، توقعات الإيرادات، تفصيل التكاليف، ومقاييس الربحية. أي رؤى مالية تحتاجها؟",
      "دعني أساعد في التحليل المالي. يمكنني تقديم تقارير الميزانية، تتبع المصروفات، توقعات الإيرادات، واقتراحات تحسين التكاليف. ماذا تريد أن تستكشف؟",
      "لدي بيانات مالية شاملة متاحة. يمكنني تحليل التدفق النقدي، هوامش الربح، عوائد الاستثمار، وأنماط الإنفاق. على أي منطقة يجب أن نركز؟"
    ],
    resources: [
      "يمكنني تحليل استخدام الموارد تشمل سعة الفريق، توفر المهارات، استخدام المعدات، وكفاءة التوزيع. أي معلومات موارد تحتاجها؟",
      "دعني أساعد في تخطيط الموارد. يمكنني إظهار أعباء عمل الفريق، فجوات المهارات، توقعات السعة، وفرص التحسين. أي جانب تريد أن تستكشف؟",
      "لدي بيانات مفصلة عن الموارد متاحة. يمكنني تحليل مقاييس الإنتاجية، أنماط التوزيع، ومعدلات الاستخدام. أي منطقة موارد تهمك؟"
    ],
    general: [
      "أنا هنا للمساعدة في أي أسئلة ذكاء الأعمال. يمكنني تحليل البيانات، إنتاج التقارير، تقديم الرؤى، والمساعدة في اتخاذ القرارات. ماذا يمكنني أن أفعل لك؟",
      "يمكنني المساعدة في جوانب مختلفة من عملك تشمل التحليلات، التقارير، التنبؤات، والتخطيط الاستراتيجي. كيف يمكنني دعم احتياجاتك اليوم؟",
      "أنا مجهز للتعامل مع استفسارات الأعمال المعقدة وتقديم رؤى مبنية على البيانات. سواء كان التحليل، التقارير، أو التوجيه الاستراتيجي، أنا هنا للمساعدة!"
    ],
    error: "أعتذر، لكنني واجهت خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو إعادة صياغة سؤالك."
  }
};

export const getSuggestions = (language: string): string[] => {
  const t = translations[language] || translations.en;
  return [
    t.projectStatusUpdates,
    t.financialOverview,
    t.resourceAllocation,
    t.analysisAndReports,
    t.budgetTracking,
    t.teamPerformance,
    t.riskManagement,
    t.marketInsights,
    t.documentAnalysis
  ];
};

export const getRandomResponse = (language: string, category: keyof BotResponses): string => {
  const responses = botResponses[language] || botResponses.en;
  const categoryResponses = responses[category];
  
  if (Array.isArray(categoryResponses)) {
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }
  
  return categoryResponses;
};

export const detectLanguageFromMessage = (message: string): string => {
  // Simple language detection based on Arabic characters
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const frenchWords = ['bonjour', 'merci', 'comment', 'projet', 'rapport', 'analyse'];
  
  if (arabicRegex.test(message)) {
    return 'tn';
  }
  
  const lowerMessage = message.toLowerCase();
  if (frenchWords.some(word => lowerMessage.includes(word))) {
    return 'fr';
  }
  
  return 'en';
};
