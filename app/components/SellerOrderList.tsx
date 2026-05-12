"use client";
import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Package, Calendar, MapPin,
  ChevronRight, ShoppingBag,
  Loader2, BadgeCheck, Clock, Truck,
  User, Mail, DollarSign, ListOrdered, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  status: string;
  delivered_at: string | null;
  products: {
    title: string;
    image_url: string;
  };
}

interface SellerOrder {
  order_id: string;
  created_at: string;
  status: string;
  wilaya: string;
  city: string;
  address: string;
  payment_method: string;
  customer: {
    username: string;
    email: string;
  };
  items: OrderItem[];
  seller_total: number;
}

export default function SellerOrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchSellerOrders();
  }, [user]);

  async function fetchSellerOrders() {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error("Request timed out")), 15000);

    try {
      const supabase = getSupabaseClient();

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price_at_purchase,
          order_id,
          status,
          delivered_at,
          products (
            title,
            image_url
          ),
          orders (
            id,
            created_at,
            status,
            wilaya,
            city,
            address,
            payment_method,
            user_id
          )
        `)
        .eq('seller_id', user?.id)
        .abortSignal(controller.signal);

      if (itemsError) throw itemsError;
      if (!itemsData) return;

      const userIds = [...new Set(itemsData.map((item: any) => item.orders.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const groupedOrders: { [key: string]: SellerOrder } = {};

      itemsData.forEach((item: any) => {
        const orderId = item.order_id;
        if (!groupedOrders[orderId]) {
          const profile = profilesData?.find(p => p.id === item.orders.user_id);
          groupedOrders[orderId] = {
            order_id: orderId,
            created_at: item.orders.created_at,
            status: item.orders.status,
            wilaya: item.orders.wilaya,
            city: item.orders.city,
            address: item.orders.address,
            payment_method: item.orders.payment_method,
            customer: {
              username: profile?.username || 'Unknown',
              email: profile?.email || 'N/A'
            },
            items: [],
            seller_total: 0
          };
        }

        groupedOrders[orderId].items.push({
          id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          status: item.status || 'pending',
          delivered_at: item.delivered_at,
          products: item.products
        });

        groupedOrders[orderId].seller_total += (item.price_at_purchase * item.quantity);
      });

      const sortedOrders = Object.values(groupedOrders).sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(sortedOrders);
    } catch (err: any) {
      console.error('Error fetching seller orders:', err.message || err);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  async function handleMarkAsDelivered(itemId: string, orderId: string) {
    try {
      const supabase = getSupabaseClient();
      const now = new Date().toISOString();
      
      // 1. Update the individual item in DB
      const { error: itemError } = await supabase
        .from('order_items')
        .update({ status: 'delivered', delivered_at: now })
        .eq('id', itemId);

      if (itemError) throw itemError;

      // 2. Update local state immediately
      let shouldSyncOrder = false;
      setOrders(prev => prev.map(order => {
        if (order.order_id === orderId) {
          const updatedItems = order.items.map(item => 
            item.id === itemId ? { ...item, status: 'delivered', delivered_at: now } : item
          );
          const allDelivered = updatedItems.every(i => i.status === 'delivered');
          if (allDelivered) shouldSyncOrder = true;

          return {
            ...order,
            status: allDelivered ? 'delivered' : order.status,
            items: updatedItems
          };
        }
        return order;
      }));

      // 3. If all items in our view are delivered, call the RPC to force the order status update
      if (shouldSyncOrder) {
        console.log('[Delivery] Triggering RPC sync for order:', orderId);
        const { error: rpcError } = await supabase.rpc('confirm_order_delivery', { 
          target_order_id: orderId 
        });
        
        if (rpcError) {
          console.warn('[Delivery] RPC failed, trying direct update:', rpcError.message);
          await supabase.from('orders').update({ status: 'delivered' }).eq('id', orderId);
        }
      }

    } catch (err: any) {
      console.error('[Delivery] Error:', err);
      alert('Failed to update: ' + (err.message || 'Unknown error'));
    }
  }

  const getStatusStyle = (status: string) => {
    if (status?.toLowerCase() === 'delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  const getStatusLabel = (status: string) => {
    return status?.toLowerCase() === 'delivered' ? 'Delivered' : 'Pending';
  };

  const getStatusIcon = (status: string) => {
    return status?.toLowerCase() === 'delivered' ? <BadgeCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-sans">Refreshing orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 font-sans tracking-tight">Order Management</h1>
        <p className="text-gray-500 font-sans mt-1">Mark items as delivered to complete fulfillment</p>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order.order_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all ${expandedId === order.order_id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          >
            <div
              className="p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              onClick={() => setExpandedId(expandedId === order.order_id ? null : order.order_id)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID: {order.order_id.split('-')[0]}</p>
                  <h3 className="text-lg font-bold text-gray-900 font-sans">{order.customer.username}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {order.wilaya}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                <p className="text-2xl font-black text-blue-600 font-sans">${order.seller_total.toFixed(2)}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order.order_id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === order.order_id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gray-50 border-t border-gray-100 overflow-hidden">
                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Detail</h4>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 font-medium text-gray-700">
                          {order.address}, {order.city}, {order.wilaya}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</h4>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100">
                          <p className="font-bold text-gray-900">{order.customer.username}</p>
                          <p className="text-blue-600 font-bold">{order.customer.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items Summary</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
                            <div className="flex items-center gap-4">
                              <img src={item.products.image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-50" />
                              <div>
                                <p className="font-bold text-gray-900 line-clamp-1">{item.products.title}</p>
                                <p className="text-xs text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                {item.status === 'delivered' && item.delivered_at && (
                                  <p className="text-[10px] text-emerald-600 font-black mt-1 uppercase">✓ Confirmed on {new Date(item.delivered_at).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(item.status)}`}>
                                {getStatusLabel(item.status)}
                              </span>
                              {item.status !== 'delivered' ? (
                                <button
                                  onClick={() => handleMarkAsDelivered(item.id, order.order_id)}
                                  className="px-6 py-2 bg-[#0d1828] text-white text-[10px] font-black uppercase rounded-xl hover:bg-black transition-all active:scale-95 shadow-md"
                                >
                                  Mark Delivered
                                </button>
                              ) : (
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
