"use client";
import { BarChart3, LayoutDashboard, Menu, Package, PlusCircle, ShoppingBag, Store, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useRouter, usePathname } from 'next/navigation';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

const navigation = [
    { name: 'Marketplace', icon: Store, path: '/product' },
    { name: 'Sell Item', icon: PlusCircle, path: '/sell' },
    { name: 'Seller Hub', icon: BarChart3, path: '/seller-hub' },
    { name: 'Orders', icon: Package, path: '/orders' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
];

export default function ProductNavbar() {
    const { user, profile } = useAuth();
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();


    const isActive = (path: string) => pathname === path;
    const isSeller = profile?.role === 'seller';

    const filteredNavigation = navigation.filter(item => {
        if (!isSeller && (item.path === '/sell' || item.path === '/seller-hub')) {
            return false;
        }
        return true;
    });


    return (
        <nav className="bg-[#0d1828] border-b border-gray-100 py-4 px-8 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => router.push('/product')}
                >
                    <Image src="/logo.svg" alt="logo" width={136} height={39} />
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {filteredNavigation.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive(item.path)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <button
                        onClick={() => router.push('/cart')}
                        className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => router.push('/dashboard')}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                <LayoutDashboard className="w-4 h-4" />
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
                                {profile?.username || user.email?.split('@')[0]}
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 font-sans"
                        >
                            Sign In
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden mt-4 overflow-hidden"
                    >
                        <div className="flex flex-col gap-2 pb-4">
                            {filteredNavigation.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        router.push(item.path);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(item.path)
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}