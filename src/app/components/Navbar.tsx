'use client';

import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <motion.div
      layout
      className="fixed top-0 right-0 left-0 ml-20 lg:ml-64 z-30 h-16 
        bg-white/10 backdrop-blur-md border-b border-white/20
        flex items-center justify-between px-4
        transition-all duration-300 ease-in-out"
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
    >
      <div className="flex-1">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 ease-in-out"
        >
          <BellIcon className="h-6 w-6 text-white" />
        </motion.button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">John Doe</div>
            <div className="text-xs text-gray-300">Administrator</div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold"
          >
            JD
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}