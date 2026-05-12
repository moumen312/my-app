"use client";

import ProductNavbar from "../../components/ProductNavbar";
import SellerOrderList from "../../components/SellerOrderList";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

export default function SellerOrdersPage() {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <ProductNavbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <AuthForm />
                    </div>
                ) : profile?.role === 'seller' ? (
                    <SellerOrderList />
                ) : (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center p-10 bg-white rounded-[32px] shadow-sm border border-red-100 max-w-md w-full mx-4">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-3 font-sans tracking-tight">Access Denied</h2>
                            <p className="text-gray-500 font-sans leading-relaxed">
                                This dashboard is reserved for verified sellers. If you are a seller, please ensure you are logged into the correct account.
                            </p>
                            <button
                                onClick={() => window.location.href = '/product'}
                                className="mt-8 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
                            >
                                Back to Marketplace
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
