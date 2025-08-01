'use client';

import React from 'react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-2">
          <h1 className="text-xl font-semibold">IntelliConnect</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default EnhancedLayout;
