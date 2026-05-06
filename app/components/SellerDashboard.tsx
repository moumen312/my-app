import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Package, DollarSign, ShoppingCart,Trash2, Edit3, Loader2, AlertCircle, TrendingUp, Inbox, Save, X} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface SellerProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  sold_count: number;
  revenue: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0
  });

  useEffect(() => {
    if (user) fetchSellerData();
  }, [user]);

  async function fetchSellerData() {
    setLoading(true);
    try {
      // 1. Fetch Seller Products
      const { data: myProducts, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      // 2. Fetch Sales Analytics from order_items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity, price_at_purchase')
        .eq('seller_id', user?.id);

      if (itemsError) throw itemsError;

      // 3. Process Data
      const processedProducts = myProducts.map((p: any) => {
        const productItems = items?.filter(item => item.product_id === p.id) || [];
        const sold_count = productItems.reduce((acc, curr) => acc + curr.quantity, 0);
        const revenue = productItems.reduce((acc, curr) => acc + (curr.quantity * curr.price_at_purchase), 0);
        return { ...p, sold_count, revenue };
      });

      setProducts(processedProducts);
      
      const totalRev = processedProducts.reduce((acc, curr) => acc + curr.revenue, 0);
      const totalSold = processedProducts.reduce((acc, curr) => acc + curr.sold_count, 0);
      
      setStats({
        totalSales: totalSold,
        totalRevenue: totalRev,
        totalProducts: processedProducts.length
      });
    } catch (err) {
      console.error('Error fetching seller analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? Careful: If this product has been sold, you might not be able to delete it for record integrity.')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        if (error.code === '23503') {
          throw new Error('Cannot delete this product because it is linked to existing orders. Try hiding it instead (feature coming soon).');
        }
        throw error;
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err as any).message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editForm.title,
          price: parseFloat(editForm.price),
          description: editForm.description,
          
          image_url: editForm.image_url
        })
        .eq('id', editingId);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm, price: parseFloat(editForm.price) } : p));
      setEditingId(null);
    } catch (err) {
      alert('Update failed: ' + (err as any).message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-sans">Calculating analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 font-sans tracking-tight">Seller Hub</h1>
          <p className="text-gray-500 font-sans">Real-time performance and inventory management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-700 font-bold font-sans">Active Status</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Items Sold', value: stats.totalSales, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Live Products', value: stats.totalProducts, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
          >
            <div className={`p-4 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-sans">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 font-sans flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600" /> Manage Inventory
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">Product</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">Price</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">Sales</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">Revenue</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-widest font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 font-sans">{p.title}</p>
                        <span className="text-xs text-gray-400 font-sans">{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-700 font-sans">${p.price.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold">
                      {p.sold_count} Sold
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-blue-600 font-sans">${p.revenue.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setEditingId(p.id);
                          setEditForm({ ...p });
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-sans">
              No products found. Start selling to see analytics here.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Simple) */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative"
            >
              <button 
                onClick={() => setEditingId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 font-sans">Edit Product</h2>
              <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Title</label>
                  <input
                    required
                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </div>
                 
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Image URL</label>
                  <input
                    required
                    type="url"
                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.image_url}
                    onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 sticky bottom-0"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
