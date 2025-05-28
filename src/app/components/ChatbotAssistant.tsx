'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  suggestions?: string[];
}

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: 'initial-bot-message',
    text: 'Hello! How can I help you today?',
    sender: 'bot',
    suggestions: ['Project status updates', 'Financial overview', 'Resource allocation'],
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialBotMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    let botResponseText = 'I am still learning. Here are some things I can help with:';
    let suggestions: string[] = ['Latest project risks', 'Upcoming milestones', 'Team utilization'];

    if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
      botResponseText = 'Hi there! What can I do for you?';
    } else if (messageText.toLowerCase().includes('status')) {
      botResponseText = 'Project Alpha is on track. Project Beta is slightly delayed.';
      suggestions = ['Details on Project Alpha', 'Reasons for Project Beta delay'];
    } else if (messageText.toLowerCase().includes('financial')) {
      botResponseText = 'The current overall budget spend is at 65%.';
      suggestions = ['Budget per project', 'Burn rate details'];
    }

    const newBotMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      suggestions: suggestions,
    };
    setMessages((prev) => [...prev, newBotMessage]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-cap-blue hover:bg-cap-dark-blue text-white p-4 rounded-full shadow-xl z-50 focus:outline-none focus:ring-2 focus:ring-cap-secondary-blue focus:ring-opacity-50 transition-colors duration-200"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </motion.button>
      )}

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 h-[80vh] md:h-[calc(100vh-8rem)] md:max-h-[700px] w-full md:w-[400px] bg-white dark:bg-gray-800 shadow-2xl rounded-t-lg md:rounded-lg flex flex-col z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <header className="bg-cap-blue text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Chat Assistant</h3>
              <button onClick={toggleChat} className="hover:bg-cap-dark-blue p-1 rounded-full" aria-label="Close chat">
                <X size={20} />
              </button>
            </header>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow ${msg.sender === 'user'
                        ? 'bg-cap-secondary-blue text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                      }`}
                  >
                    {msg.text.split('\n').map((line, index) => (
                      <motion.p 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {line}
                      </motion.p>
                    ))}
                    {msg.sender === 'bot' && msg.suggestions && (
                      <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                        {msg.suggestions.map((suggestion, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-cap-blue dark:text-sky-300 border border-cap-blue dark:border-sky-400 px-2 py-1 rounded-full mr-1 mb-1 transition-colors duration-150"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-[80%] p-3 rounded-lg shadow bg-gray-200 dark:bg-gray-700 rounded-bl-none flex items-center space-x-2">
                    <motion.div 
                      className="w-2 h-2 bg-cap-blue rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-cap-blue rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-cap-blue rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ask something..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cap-blue dark:focus:ring-cap-secondary-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-shadow duration-150"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-cap-blue hover:bg-cap-dark-blue disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-cap-secondary-blue focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center w-10 h-10"
                  whileTap={{ scale: isLoading || !inputValue.trim() ? 1 : 0.95 }}
                  aria-label="Send message"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <Send size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotAssistant;