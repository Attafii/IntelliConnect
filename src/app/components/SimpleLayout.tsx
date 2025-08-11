'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleNavbar from './SimpleNavbar';
import Sidebar from './Sidebar';
// import SplineModels from './SplineModels'; // Removed for performance
import ChatbotAssistant from './ChatbotAssistant';
import GlobalSearch from './GlobalSearch';
import { NotificationProvider, ToastContainer } from './NotificationSystem';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const pathname = usePathname();

  // Animation variants for modern transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };  return (
    <NotificationProvider>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Glassmorphism Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/20 via-white/15 to-sky-100/20 backdrop-blur-[1px] pointer-events-none" />
        
        {/* Simplified Light Blue Floating Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-sky-200/15 to-blue-200/15 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Spline 3D Models Background - Commented out for performance */}
        {/* <SplineModels /> */}

        {/* Enhanced Navigation Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <SimpleNavbar 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onOpenSearch={() => setIsGlobalSearchOpen(true)}
          />
        </motion.div>

        <div className="flex">
          {/* Enhanced Sidebar with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ x: isSidebarOpen ? 0 : -300, opacity: isSidebarOpen ? 1 : 0 }}
              animate={{ x: isSidebarOpen ? 0 : -300, opacity: isSidebarOpen ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Sidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Main Content with Page Transitions */}
          <motion.main 
            className={`flex-1 transition-all duration-500 pt-20 ${
              isSidebarOpen ? 'ml-64' : 'ml-0'
            }`}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            key={pathname}
          >
            <motion.div 
              className="p-6 min-h-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="relative">
                {/* Modern Blue Content Glass Container */}
                <motion.div 
                  className="bg-white/20 backdrop-blur-xl rounded-3xl border border-blue-200/30 shadow-2xl p-1"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)'
                  }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-br from-white/50 to-blue-50/30 rounded-[22px] p-6 min-h-[calc(100vh-200px)]">
                    {children}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.main>
        </div>

        {/* Enhanced Chatbot Assistant */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ChatbotAssistant 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Global Search */}
        <AnimatePresence>
          {isGlobalSearchOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <GlobalSearch 
                isOpen={isGlobalSearchOpen}
                onClose={() => setIsGlobalSearchOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Toast Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ToastContainer />
        </motion.div>
      </motion.div>
    </NotificationProvider>
  );
};

export default SimpleLayout;
