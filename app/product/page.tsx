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
import ProductNavbar from '../components/ProductNavbar';

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
    { name: 'Marketplace', icon: Store, path: '/product' },
    { name: 'Sell Item', icon: PlusCircle, path: '/sell' },
    { name: 'Seller Hub', icon: BarChart3, path: '/seller-hub' },
    { name: 'Orders', icon: Package, path: '/orders' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProductNavbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <ProductList />
      </main>
    </div>
  );
}

  
