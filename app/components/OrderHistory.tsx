"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, Calendar, MapPin, 
  ChevronRight, ShoppingBag, 
  Loader2, BadgeCheck, Clock, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from 'next/navigation';


interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    title: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  wilaya: string;
  city: string;
  address: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              title,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'paid': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <BadgeCheck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-sans">Retreiving your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 font-sans tracking-tight">Your Orders</h1>
        <p className="text-gray-500 font-sans mt-2">History of your purchases in the marketplace</p>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all ${
              expandedId === order.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
          >
            <div 
              className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Order ID</p>
                  <p className="font-mono text-xs text-gray-600 mt-0.5">{order.id}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.wilaya}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
                <p className="text-2xl font-black text-gray-900 font-sans">
                  ${order.total_price.toFixed(2)}
                </p>
                <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${expandedId === order.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedId === order.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-gray-50 border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-8 space-y-6">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order Contents</h4>
                    <div className="space-y-4">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.products.image_url} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover" 
                            />
                            <div>
                              <p className="font-bold text-gray-900 font-sans line-clamp-1">{item.products.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900 font-sans">
                            ${(item.price_at_purchase * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping To</h4>
                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                          {order.address}<br />
                          {order.city}, {order.wilaya}
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Details</h4>
                        <p className="text-sm font-bold text-gray-900">
                          {order.payment_method === 'COD' ? 'Cash on Delivery' : 'ECCP Bank Transfer'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 font-sans">No orders yet</h3>
            <button 
              onClick={() => router.push('/Product')}

              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
