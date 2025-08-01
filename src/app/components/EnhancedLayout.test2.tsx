'use client';

import React from 'react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  return (
    <div>
      <h1>Basic Test Layout - No Imports</h1>
      {children}
    </div>
  );
};

export default EnhancedLayout;
