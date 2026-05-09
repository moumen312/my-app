"use client";

import AuthForm from "../components/AuthForm";
import ProductNavbar from "../components/ProductNavbar";
import SellerDashboard from "../components/SellerDashboard";
import { useAuth } from "../contexts/AuthContext";

import { AlertCircle } from "lucide-react";

export default function Page() {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <main>
            <ProductNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                {!user ? (
                    <AuthForm />
                ) : profile?.role === 'seller' ? (
                    <SellerDashboard />
                ) : (
                    <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md w-full mx-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">You need a seller account to access the Seller Hub.</p>
                    </div>
                )}
            </div>
        </main>
    )
}