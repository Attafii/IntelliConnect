'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RouteTransitionProps {
  children: ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}