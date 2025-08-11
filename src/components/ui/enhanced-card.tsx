'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'strong' | 'subtle';
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function EnhancedCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  glow = false,
  gradient = false,
  onClick
}: EnhancedCardProps) {
  const baseClasses = "rounded-3xl p-6 transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl",
    glass: "glass",
    strong: "glass-strong", 
    subtle: "glass-subtle"
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-3xl hover:bg-white/25" : "";
  const glowClasses = glow ? "animate-glow-pulse" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-white/30 to-white/10" : "";

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        gradientClasses,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -5 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}

interface EnhancedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function EnhancedCardHeader({ children, className }: EnhancedCardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {children}
    </div>
  );
}

interface EnhancedCardTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function EnhancedCardTitle({ children, className, gradient = false }: EnhancedCardTitleProps) {
  return (
    <h3 className={cn(
      "text-xl font-bold",
      gradient ? "text-gradient-blue" : "text-gray-800",
      className
    )}>
      {children}
    </h3>
  );
}

interface EnhancedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function EnhancedCardContent({ children, className }: EnhancedCardContentProps) {
  return (
    <div className={cn("text-gray-600", className)}>
      {children}
    </div>
  );
}
