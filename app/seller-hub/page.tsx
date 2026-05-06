"use client";

import AuthForm from "../components/AuthForm";
import ProductNavbar from "../components/ProductNavbar";
import SellerDashboard from "../components/SellerDashboard";
import { useAuth } from "../contexts/AuthContext";

export default function Page() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <main>
            <ProductNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                {user ? <SellerDashboard /> : <AuthForm />}
            </div>
        </main>
    )
}