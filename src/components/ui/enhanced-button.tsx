'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  gradient?: boolean;
  loading?: boolean;
}

export function EnhancedButton({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  glow = false,
  gradient = false,
  loading = false,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-white/20 backdrop-blur-xl border border-white/30 text-gray-700 hover:bg-white/30 hover:text-gray-900",
    glass: "btn-glass",
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border border-white/20",
    secondary: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-white/20"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const glowClasses = glow ? "animate-glow-pulse" : "";
  const gradientClasses = gradient ? "animate-gradient-shift" : "";

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        gradientClasses,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}
