"use client";
import React from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductList from '../components/ProductList';
import { Loader2, Store, PlusCircle, LayoutDashboard, Menu, X, ShoppingBag, BarChart3, Package } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

export default function ProductPage() {
  const { user, loading } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 font-medium font-sans">Restoring secure session...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Marketplace', icon: Store, path: '/Product' },
    { name: 'Sell Item', icon: PlusCircle, path: '/sell' },
    { name: 'Seller Hub', icon: BarChart3, path: '/seller-hub' },
    { name: 'Orders', icon: Package, path: '/orders' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Navigation */}
      <nav className="bg-[#0d1828] border-b border-gray-100 py-4 px-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            href="/Product"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div>
              <Image src="/logo.svg" alt="logo" width={136} height={39} />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  false
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Trigger */}
            <Link 
              href="/cart"
              className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </Link>
            ) : (
              <Link 
                href="/Authentification"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 font-sans"
              >
                Sign In
              </Link>
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

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2 pb-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      false
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-12">
        <ProductList />
      </main>
    </div>
  );
}


