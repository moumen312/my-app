"use client";

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
    Users, 
    Package, 
    ShoppingCart, 
    BarChart3, 
    Trash2, 
    Loader2, 
    Search, 
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    History,
    MoreVertical,
    ExternalLink,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

type TabType = 'users' | 'products' | 'orders' | 'analytics';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('analytics');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [data, setData] = useState<any>({
        users: [],
        products: [],
        orders: [],
        stats: null
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        setLoading(true);
        setFetchError(null);
        try {
            const supabase = getSupabaseClient();
            
            // 1. Fetch Users
            const { data: users, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (usersError) throw new Error(`Users Fetch: ${usersError.message}`);

            // 2. Fetch Products
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw new Error(`Products Fetch: ${productsError.message}`);

            // 3. Fetch Orders and Order Items
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw new Error(`Orders Fetch: ${ordersError.message}`);

            const { data: orderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('order_id, quantity, price_at_purchase');
            
            if (itemsError) throw new Error(`Order Items Fetch: ${itemsError.message}`);

            // Manual Join: Map sellers to products
            const enrichedProducts = products?.map(p => {
                const seller = users?.find(u => u.id === p.seller_id);
                return { ...p, seller };
            }) || [];

            // Calculate Stats
            const totalRevenue = orderItems?.reduce((acc, curr) => acc + (curr.quantity * curr.price_at_purchase), 0) || 0;
            
            const enrichedOrders = orders?.map(order => {
                const items = orderItems?.filter(item => item.order_id === order.id) || [];
                const amount = items.reduce((acc, curr) => acc + (curr.quantity * curr.price_at_purchase), 0);
                return { ...order, total_amount: amount };
            }) || [];

            const totalProducts = products?.length || 0;
            const totalUsers = users?.length || 0;
            const totalOrders = orders?.length || 0;

            setData({
                users: users || [],
                products: enrichedProducts,
                orders: enrichedOrders,
                stats: {
                    totalRevenue,
                    totalProducts,
                    totalUsers,
                    totalOrders
                }
            });
        } catch (err: any) {
            console.error('[AdminHub] Fetch Error:', err.message);
            setFetchError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteProduct = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const supabase = getSupabaseClient();
            
            await supabase.from('admin_audit_log').insert({
                admin_id: user?.id,
                action: 'DELETE_PRODUCT',
                target_type: 'product',
                target_id: id,
                details: { title }
            });

            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            setData(prev => ({
                ...prev,
                products: prev.products.filter((p: any) => p.id !== id),
                stats: { ...prev.stats, totalProducts: prev.stats.totalProducts - 1 }
            }));
        } catch (err: any) {
            alert('Delete failed: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-gray-500 font-sans font-medium">Aggregating platform data...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[40px] border border-red-100 shadow-sm">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Fetch Error</h2>
                <p className="text-gray-500 mb-6 max-w-md">{fetchError}</p>
                <button onClick={fetchAllData} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all">
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 font-sans tracking-tight">Admin Hub</h1>
                    <p className="text-gray-500 font-sans">Global platform oversight and management</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {[
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'products', label: 'Products', icon: Package },
                        { id: 'orders', label: 'Orders', icon: ShoppingCart },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id ? 'bg-[#0d1828] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {activeTab === 'analytics' && data.stats && <AnalyticsTab stats={data.stats} orders={data.orders} />}
                    {activeTab === 'users' && <UsersTab users={data.users} />}
                    {activeTab === 'products' && <ProductsTab products={data.products} onDelete={handleDeleteProduct} />}
                    {activeTab === 'orders' && <OrdersTab orders={data.orders} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function AnalyticsTab({ stats, orders }: any) {
    const getStatusStyle = (status: string) => {
        if (status?.toLowerCase() === 'delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: History, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className={`p-3 ${stat.bg} rounded-2xl w-fit mb-4`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 font-sans">{stat.value}</h3>
                    </div>
                ))}
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><History className="w-5 h-5 text-emerald-600" /> Recent Activity</h3>
                <div className="space-y-4">
                    {orders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 font-bold text-blue-600 text-xs">#{order.id.slice(0,4)}</div>
                                <div><p className="text-sm font-bold text-gray-900">${order.total_amount?.toFixed(2)}</p><p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p></div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                {order.status || 'pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function UsersTab({ users }: any) {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 font-sans flex items-center gap-2"><Users className="w-6 h-6 text-blue-600" /> Platform Users</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u: any) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">{u.username?.[0]?.toUpperCase() || 'U'}</div>
                                        <div><p className="font-bold text-gray-900">{u.username}</p><p className="text-xs text-gray-400 font-mono">{u.id.slice(0,8)}...</p></div>
                                    </div>
                                </td>
                                <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : u.role === 'seller' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{u.role}</span></td>
                                <td className="px-8 py-6 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProductsTab({ products, onDelete }: any) {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 font-sans flex items-center gap-2"><Package className="w-6 h-6 text-blue-600" /> Platform Inventory</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Seller</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((p: any) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-100"><img src={p.image_url} alt="" className="w-full h-full object-cover" /></div>
                                        <div><p className="font-bold text-gray-900 line-clamp-1">{p.title}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                                    </div>
                                </td>
                                <td className="px-8 py-6"><p className="text-sm font-bold text-gray-700">{p.seller?.username || 'Unknown Seller'}</p></td>
                                <td className="px-8 py-6 font-bold text-blue-600">${p.price?.toFixed(2)}</td>
                                <td className="px-8 py-6"><button onClick={() => onDelete(p.id, p.title)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OrdersTab({ orders }: any) {
    const getStatusStyle = (status: string) => {
        if (status?.toLowerCase() === 'delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 font-sans flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-blue-600" /> Global Sales History</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((o: any) => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6"><span className="font-bold text-gray-400 text-xs">#{o.id.slice(0, 8)}</span></td>
                                <td className="px-8 py-6 font-black text-gray-900">${o.total_amount?.toFixed(2)}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(o.status)}`}>
                                        {o.status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
