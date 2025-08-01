'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load Spline for better performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineModelProps {
  sceneUrl: string;
  fallbackContent: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SplineModel: React.FC<SplineModelProps> = ({ 
  sceneUrl, 
  fallbackContent, 
  className = "",
  style = {}
}) => {
  return (
    <div className={`spline-container ${className}`}>
      <Suspense fallback={fallbackContent}>
        <Spline
          scene={sceneUrl}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            ...style
          }}
          onLoad={() => console.log('Spline model loaded')}
          onError={() => console.log('Spline model failed to load')}
        />
      </Suspense>
    </div>
  );
};

export default SplineModel;
