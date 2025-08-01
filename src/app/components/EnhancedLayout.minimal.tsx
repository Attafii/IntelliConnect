'use client';

import React from 'react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

function EnhancedLayout({ children }: EnhancedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">IntelliConnect</h1>
        </div>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

export default EnhancedLayout;
