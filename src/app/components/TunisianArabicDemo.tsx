// Demo component to test Tunisian Arabic chatbot functionality
import React from 'react';

export default function TunisianArabicChatbotDemo() {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        IntelliConnect Multilingual Chatbot Demo
      </h1>
      
      <div className="space-y-4">
        {/* English Example */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">English 🇺🇸</h3>
          <p className="text-sm text-gray-700 mt-2">
            User: "Tell me about project status"
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Bot: "Based on the project data, I can see current progress, milestones, and resource allocation. The project appears to be on track with some areas requiring attention for optimal performance."
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-blue-200 px-2 py-1 rounded">Project status updates</span>
            <span className="text-xs bg-blue-200 px-2 py-1 rounded">Financial overview</span>
          </div>
        </div>

        {/* French Example */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800">Français 🇫🇷</h3>
          <p className="text-sm text-gray-700 mt-2">
            User: "Bonjour, comment va le projet?"
          </p>
          <p className="text-sm text-green-600 mt-1">
            Bot: "Basé sur les données du projet, je peux voir le progrès actuel, les jalons, et l'allocation des ressources. Le projet semble être sur la bonne voie avec quelques domaines nécessitant attention pour une performance optimale."
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-green-200 px-2 py-1 rounded">Mises à jour du statut</span>
            <span className="text-xs bg-green-200 px-2 py-1 rounded">Aperçu financier</span>
          </div>
        </div>

        {/* Tunisian Arabic Example */}
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-800">العربية التونسية 🇹🇳</h3>
          <p className="text-sm text-gray-700 mt-2" dir="rtl">
            المستخدم: "أهلاً، كيف حالة المشروع؟"
          </p>
          <p className="text-sm text-red-600 mt-1 text-right" dir="rtl">
            المساعد: "بناءً على بيانات المشروع، يمكنني رؤية التقدم الحالي والمعالم وتوزيع الموارد. يبدو أن المشروع يسير على الطريق الصحيح مع بعض المجالات التي تتطلب الاهتمام للحصول على الأداء الأمثل."
          </p>
          <div className="flex gap-2 mt-2 justify-end" dir="rtl">
            <span className="text-xs bg-red-200 px-2 py-1 rounded">تحديثات حالة المشروع</span>
            <span className="text-xs bg-red-200 px-2 py-1 rounded">نظرة عامة مالية</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Features Implemented:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✅ Language detection based on user input</li>
          <li>✅ Automatic language switching (English, French, Tunisian Arabic)</li>
          <li>✅ RTL (Right-to-Left) text support for Arabic</li>
          <li>✅ Text-to-speech functionality with language-specific voice settings</li>
          <li>✅ Contextual responses based on message content</li>
          <li>✅ Language-specific UI translations</li>
          <li>✅ Dynamic suggestion buttons in the detected language</li>
          <li>✅ Voice control with volume adjustment</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">How to Use:</h3>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Click the chat icon in the navbar to open the chatbot</li>
          <li>2. Use the language switcher (globe icon) to change interface language</li>
          <li>3. Type messages in any supported language - the bot will auto-detect</li>
          <li>4. Click the volume icon next to bot messages to hear them spoken</li>
          <li>5. Use the volume slider to adjust speech playback speed</li>
        </ol>
      </div>
    </div>
  );
}
