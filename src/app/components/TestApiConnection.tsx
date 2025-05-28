'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TestApiConnection() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setResult('Testing connection...');
      
      const response = await fetch('/api/test');
      const data = await response.json();
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button 
        onClick={testConnection}
        disabled={isLoading}
      >
        Test API Connection
      </Button>
      {result && (
        <pre className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
          {result}
        </pre>
      )}
    </div>
  );
}
