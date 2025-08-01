'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import BackgroundAnimation from "./components/BackgroundAnimation";

export default function Home() {
  return (    <div className="relative">
      <BackgroundAnimation />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20">
        <div className="absolute top-4 left-4 z-20">
          <Link href="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
        </div>
        <motion.main 
          className="max-w-4xl mx-auto text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/intlogo.png"
              alt="IntelliConnect Logo"
              width={180}
              height={180}
              className="mx-auto mb-8"
              priority
            />
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl font-bold mb-6 text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            IntelliConnect
          </motion.h1>

          <motion.p 
            className="text-xl mb-8 text-black max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}          >
            A comprehensive business intelligence and project management platform that integrates financial analytics, resource management, and data insights.
          </motion.p>

          <motion.div 
            className="flex gap-6 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/overview" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
              Get Started
            </Link>
            <Link href="/intelligence" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200">
              View Analytics
            </Link>
          </motion.div>          <motion.div 
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Data Analytics</h3>
              <p className="text-black">Real-time insights and analytics for informed decision-making</p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Project Management</h3>
              <p className="text-black">Optimize resource allocation and track project milestones efficiently</p>
            </div><div className="p-6 rounded-xl bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Resource Management</h3>
              <p className="text-black">Comprehensive resource tracking and allocation tools</p>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
