'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ChatTestPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages(prev => [...prev, { role: 'user', content: input }]);

      // Send message to API
      const response = await fetch('/api/analysis/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setInput('');
    } catch (error) {
      console.error('Chat error:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Failed to send message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Chat Test</h1>
      
      {/* Messages */}
      <Card className="mb-4 p-4 h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-100 ml-auto max-w-[80%]' 
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 p-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          )}
        </div>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
