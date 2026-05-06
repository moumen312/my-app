"use client";

import AuthForm from "../components/AuthForm";

import Checkout from "../components/Checkout";
import ProductNavbar from "../components/ProductNavbar";

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

                {user ? <Checkout /> : <AuthForm />}
            </div>
        </main>
    )
}