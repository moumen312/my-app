"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { getSupabaseClient } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";


export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();


  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const supabase = getSupabaseClient();
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-sans">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <button 
          onClick={() => router.push('/')}
          className="text-blue-600 font-semibold hover:underline flex items-center gap-2 mx-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium font-sans"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 aspect-square"
        >
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full font-sans uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-sans tracking-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 py-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm text-gray-500 font-sans">(12 customer reviews)</span>
            </div>

            <p className="text-3xl font-bold text-blue-600 font-sans">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 leading-relaxed text-lg font-sans py-4">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">30 Day Returns</p>
                  <p className="text-xs text-gray-500">Easy returns policy</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure Checkout Guaranteed
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
