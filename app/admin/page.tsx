"use client";

import ProductNavbar from "../components/ProductNavbar";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "../contexts/AuthContext";
import { AlertCircle, ShieldAlert, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Verifying administrator access...</p>
                </div>
            </div>
        );
    }

    const isAdmin = profile?.role === 'admin';

    return (
        <main className="min-h-screen bg-gray-50">
            <ProductNavbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {!user ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto mt-20"
                    >
                        <ShieldAlert className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                        <p className="text-gray-600 mb-8">Please sign in to access the administrator dashboard.</p>
                        <button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                        >
                            Sign In
                        </button>
                    </motion.div>
                ) : isAdmin ? (
                    <AdminDashboard />
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-12 bg-white rounded-3xl shadow-xl border border-red-100 max-w-md mx-auto mt-20"
                    >
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-4">
                            You do not have the required permissions to access this area.
                        </p>
                        <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-500 text-left mb-6">
                            <strong>Note:</strong> Admin privileges must be assigned manually via the database for security reasons.
                        </div>
                        <button 
                            onClick={() => window.location.href = '/product'}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Return to Marketplace
                        </button>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
