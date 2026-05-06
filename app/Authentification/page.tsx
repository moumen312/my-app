"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import Dashboard from '../components/Dashboard';
import { Loader2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Restoring secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <nav className=" border-b border-transparent py-4 px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Session Active
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Protected Mode
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-12 pb-24">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <AuthForm />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Built with React 19 + Supabase Auth + Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
