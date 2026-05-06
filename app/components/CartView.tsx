"use client";
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';


export default function CartView() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-sans mb-4">Your cart is empty</h2>
        <p className="text-gray-500 font-sans mb-10 max-w-sm mx-auto">
          Add some amazing items to your basket and make your first purchase today.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto"
        >
          Explore Marketplace
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans">Shopping Bag</h1>
            <span className="text-gray-400 font-sans">{totalItems} Items</span>
          </div>

          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 relative group"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate font-sans">{item.title}</h3>
                  <p className="text-blue-600 font-bold mb-2 font-sans">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 mb-2 font-sans">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-semibold font-sans">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold font-sans">FREE</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span className="text-gray-900 font-semibold font-sans">$0.00</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-blue-600 font-sans">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-lg"
            >
              Checkout Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 font-sans uppercase tracking-widest">
              Secured with Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
