"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { Loader2 } from 'lucide-react';
import { Search, Tag, ExternalLink,ShoppingCart } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import { motion, AnimatePresence } from "framer-motion";
// Import from next/navigation, NOT react-router-dom
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  seller_id: string;
  created_at: string;
  sales_count?: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']); // Added missing state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added missing state
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Next.js way to get params
  const currentSort = searchParams.get('sort') || 'newest';
  const currentCategory = searchParams.get('category') || 'All';

  // 1. Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from('products').select('category');
        if (error) throw error;

        const unique = Array.from(new Set(data?.map(p => p.category) || []))
          .filter(Boolean)
          .sort();
        
        setCategories(['All', ...unique]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // 2. Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const supabase = getSupabaseClient();
        if (currentSort === 'popular') {
          const { data, error } = await supabase
            .from('products')
            .select('*, order_items(count)');

          if (error) throw error;

          let productsWithSales = (data || []).map(p => ({
            ...p,
            sales_count: Array.isArray(p.order_items) ? p.order_items[0]?.count || 0 : 0
          })).sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));

          if (currentCategory !== 'All') {
            productsWithSales = productsWithSales.filter(p => p.category === currentCategory);
          }
          setProducts(productsWithSales);
        } else {
          let query = supabase.from('products').select('*');

          if (currentCategory !== 'All') {
            query = query.eq('category', currentCategory);
          }

          const sortOrder = currentSort === 'oldest' ? { ascending: true } : { ascending: false };
          query = query.order('created_at', sortOrder);

          const { data, error } = await query;
          if (error) throw error;
          setProducts(data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentSort, currentCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (loading) return <Loader2 className="animate-spin" />;
  return (
    <div className="space-y-8">
       <div className='relative flex items-center w-full'>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Welcome to Techy.com</h1>
            
        </div>
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center  bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-[80px] z-20 backdrop-blur-md bg-white/80">
       
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className= 'w-[100] bg-black mx-10'>
            < FilterDropdown categories={categories} />
            </div >
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-gray-100 space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                <div className="h-6 bg-gray-100 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-full mt-4" />
              </div>
            ))}
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 font-sans">No products found</h3>
            <p className="text-gray-500 mt-2 font-sans">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative"
              >
                <div 
                  className="aspect-square relative overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm font-sans">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white text-gray-900 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div 
                    className="flex justify-between items-start mb-2 cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <h3 className="font-bold text-gray-900 line-clamp-1 font-sans">{product.title}</h3>
                    <span className="text-lg font-bold text-blue-600 font-sans">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10 font-sans">{product.description}</p>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

