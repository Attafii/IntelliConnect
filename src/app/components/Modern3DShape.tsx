'use client';

import React, { Suspense } from 'react';

interface Modern3DShapeProps {
  className?: string;
  type?: 'crystal' | 'geometric' | 'abstract';
}

const Modern3DShape: React.FC<Modern3DShapeProps> = ({ className = "", type = 'geometric' }) => {
  const renderShape = () => {
    switch (type) {
      case 'crystal':
        return (
          <div className="relative w-full h-full perspective-1000">
            <div className="absolute inset-0 animate-float-modern">
              <div className="w-full h-full relative transform-style-preserve-3d">
                {/* Crystal facets */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-200/20 backdrop-blur-lg border border-white/30 rounded-lg"
                    style={{
                      transform: `rotateY(${i * 45}deg) translateZ(30px)`,
                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'abstract':
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 animate-float-ethereal">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-purple-200/20 backdrop-blur-xl rounded-2xl border border-white/20 modern-shadow-lg">
                <div className="absolute inset-2 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-300/30 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        );
        
      default: // geometric
        return (
          <div className="relative w-full h-full">
            <div className="geometric-container">
              <div className="modern-dodecahedron">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`geometric-face face-${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`${className} spline-container`}>
      <Suspense fallback={
        <div className="w-full h-full bg-gradient-to-br from-blue-50/50 to-white/50 rounded-xl animate-pulse loading-shimmer" />
      }>
        {renderShape()}
      </Suspense>
    </div>
  );
};

export default Modern3DShape;
