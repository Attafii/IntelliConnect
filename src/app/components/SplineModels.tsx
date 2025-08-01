'use client';

import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import Modern3DShape from './Modern3DShape';

interface SplineModelsProps {
  className?: string;
}

// Individual Spline Model Component with Error Handling
const SplineModel: React.FC<{ 
  scene?: string; 
  className?: string; 
  fallback?: React.ReactNode;
  type?: 'crystal' | 'geometric' | 'abstract';
}> = ({ scene, className = "", fallback, type = 'geometric' }) => {
  const [hasError, setHasError] = React.useState(!scene); // Start with error if no scene URL

  const handleError = () => {
    setHasError(true);
  };

  // Always use fallback since we don't have reliable Spline URLs
  if (hasError || !scene) {
    return fallback || <Modern3DShape className={className} type={type} />;
  }

  return (
    <div className={className}>
      <Suspense fallback={<Modern3DShape className="w-full h-full" type={type} />}>
        <Spline 
          scene={scene}
          onError={handleError}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
};

const SplineModels: React.FC<SplineModelsProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main Modern 3D Shape - Enhanced Crystal */}
      <div className="absolute top-20 right-10 w-40 h-40">
        <SplineModel 
          className="w-full h-full"
          type="crystal"
        />
      </div>

      {/* Secondary Shape - Abstract Floating Element */}
      <div className="absolute top-1/2 left-16 w-28 h-28">
        <SplineModel 
          className="w-full h-full"
          type="abstract"
        />
      </div>

      {/* Third Shape - Modern Geometric */}
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32">
        <SplineModel 
          className="w-full h-full"
          type="geometric"
        />
      </div>{/* Additional Modern CSS 3D Elements for Enhanced Visual Appeal */}
      <div className="absolute top-1/3 right-1/4 w-20 h-20 animate-float" style={{ animationDelay: '3s' }}>
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-white/30 to-blue-300/30 backdrop-blur-md border border-white/20 rounded-xl transform rotate-45 shadow-lg modern-diamond"></div>
        </div>
      </div>

      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 animate-float-delayed" style={{ animationDelay: '5s' }}>
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-white/25 to-cyan-300/25 backdrop-blur-md border border-white/15 modern-triangle" style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}></div>
        </div>
      </div>

      {/* Hexagonal Floating Element */}
      <div className="absolute top-2/3 right-12 w-18 h-18 animate-float" style={{ animationDelay: '7s' }}>
        <div className="w-full h-full bg-gradient-to-br from-white/20 to-indigo-300/20 backdrop-blur-md border border-white/10 shadow-lg modern-hexagon" style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}></div>
      </div>

      {/* Animated Ring */}
      <div className="absolute top-40 left-1/2 w-14 h-14 animate-float-slow" style={{ animationDelay: '2s' }}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-emerald-200/15 rounded-full backdrop-blur-sm border border-white/8"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default SplineModels;
