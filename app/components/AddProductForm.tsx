"use client";
import React, { useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, DollarSign, Tag, ImageIcon, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function AddProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: ''
  });

  const categories = ['All', 'Phones', 'Laptops', 'Wires', 'Accessories', 'Camera', 'Cases'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.warn("AddProductForm: No user found. Cannot submit.");
      return;
    }
    
    setLoading(true);
    setError(null);

    console.log("AddProductForm: Starting submission", { 
      userId: user.id, 
      formData: { ...formData, price: parseFloat(formData.price) } 
    });

    try {
      const supabase = getSupabaseClient();
      console.log("AddProductForm: Supabase client initialized");

      // Adding a timeout using AbortController to prevent indefinite hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort(new Error("Request timed out after 15 seconds"));
      }, 15000);

      try {
        console.log("AddProductForm: Calling supabase.from('products').insert()");
        
        // Use .select() to force a response from Supabase instead of hanging on empty response
        const { data, error: insertError } = await supabase
          .from('products')
          .insert([
            {
              ...formData,
              price: parseFloat(formData.price),
              seller_id: user.id
            }
          ])
          .select()
          .abortSignal(controller.signal);

        console.log("AddProductForm: Supabase response received", { data, insertError });

        if (insertError) {
          console.error("AddProductForm: Insert error from Supabase", insertError);
          throw insertError;
        }

        console.log("AddProductForm: Product added successfully");
        setSuccess(true);
        setFormData({ title: '', description: '', price: '', image_url: '', category: '' });
        if (onSuccess) setTimeout(onSuccess, 2000);

      } finally {
        clearTimeout(timeoutId);
      }

    } catch (err: any) {
      console.error('AddProductForm: Caught error during submission', err);
      // Ensure we extract a readable message even from nested Supabase errors
      let errorMessage = 'An unexpected error occurred while adding the product.';
      if (err.name === 'AbortError' || err.message?.includes('timed out')) {
        errorMessage = 'The request timed out. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.details) {
         errorMessage = err.details;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      console.log("AddProductForm: Resetting loading state");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-emerald-900 font-sans">Product Added!</h3>
        <p className="text-emerald-700 mt-2">Your item is now live in the marketplace.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-emerald-600 font-semibold hover:underline"
        >
          Add another product
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 font-sans">List a New Item</h2>
        <p className="text-gray-500 mt-2 font-sans">Reach thousands of buyers instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4" /> Product Title
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. Vintage Camera"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Category
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Image URL
            </label>
            <input
              required
              type="url"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-sans"
              placeholder="Tell buyers more about your product..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'List Product Now'}
        </button>
      </form>
    </div>
  );
}
