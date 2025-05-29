'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Volume2, ArrowUpCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  suggestions?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotAssistant = ({ isOpen, onClose }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(50);
  const [scrollPosition, setScrollPosition] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const initialBotMessage = {
    id: 'initial-bot-message',
    text: 'Hello! How can I help you today?',
    sender: 'bot' as const,
    suggestions: ['Project status updates', 'Financial overview', 'Resource allocation'],
  };
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialBotMessage]);
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;
    setScrollPosition((currentScroll / maxScroll) * 100);
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

    try {
      console.log('Sending message:', messageText);
      const response = await fetch('/api/analysis/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.details || 'Failed to get response from chatbot');
      }

      console.log('Received response:', data);
      
      if (!data.reply) {
        throw new Error('Invalid response format: missing reply');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            height: isMinimized ? 'auto' : undefined
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed z-50 overflow-hidden
            ${isMinimized
              ? 'bottom-4 right-4 w-[350px]'
              : `
                sm:top-20 sm:right-4 sm:w-[450px] sm:h-[calc(100vh-120px)]
                top-[calc(100vh-90vh)] right-0 w-full h-[90vh]
              `}
          `}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl w-full h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 backdrop-blur-sm text-white">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="font-medium">Chat Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2">
                  <Volume2 className="h-4 w-4" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                    title="Response Speed"
                  />
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                >
                  {isMinimized ? (
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: 180 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </motion.svg>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="relative flex-1">
                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="absolute inset-0 overflow-y-auto px-6 py-4 space-y-6"
                  >
                    {/* Scroll to top button */}
                    {scrollPosition > 20 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={scrollToTop}
                        className="fixed top-24 right-8 p-2 bg-gray-900/90 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors z-10"
                      >
                        <ArrowUpCircle className="h-5 w-5" />
                      </motion.button>
                    )}

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            max-w-[80%] rounded-lg p-4 shadow-md
                            ${message.sender === 'user'
                              ? 'bg-gray-900/90 backdrop-blur-sm text-white'
                              : 'bg-white/80 backdrop-blur-sm text-gray-900'
                            }
                          `}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs px-3 py-1.5 rounded-full bg-gray-800/90 text-white hover:bg-gray-700 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="flex space-x-2"
                          >
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll position indicator */}
                  <motion.div
                    className="absolute right-1 top-0 bottom-0 w-1 bg-gray-200/30"
                    style={{
                      scaleY: messages.length > 0 ? 1 : 0,
                      transformOrigin: 'top'
                    }}
                  >
                    <motion.div
                      className="absolute top-0 right-0 w-full bg-gray-400/50 rounded-full"
                      style={{
                        height: `${100 - scrollPosition}%`,
                        opacity: messages.length > 0 ? 0.5 : 0
                      }}
                    />
                  </motion.div>
                </div>

                {/* Input */}
                <div className="border-t border-gray-200/30 p-4 bg-white/80 backdrop-blur-sm">
<<<<<<< HEAD
                  <div className="flex items-center space-x-2">                    <input
=======
                  <div className="flex items-center space-x-2">
                    <input
>>>>>>> 21c5801628fea5d2514e6c70695173ad684f56e1
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
<<<<<<< HEAD
                      className="flex-1 px-4 py-2 border bg-white/90 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
=======
                      className="flex-1 px-4 py-2 border bg-white/90 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
>>>>>>> 21c5801628fea5d2514e6c70695173ad684f56e1
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !inputValue.trim()}
                      className="p-2 bg-gray-900/90 backdrop-blur-sm text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotAssistant;