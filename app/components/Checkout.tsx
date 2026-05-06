import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, CreditCard, Truck, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";

const ALGERIA_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annabba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran'
];

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    wilaya: '',
    city: '',
    address: '',
    paymentMethod: 'COD'
  });

  if (cart.length === 0 && !success) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          wilaya: formData.wilaya,
          city: formData.city,
          address: formData.address,
          payment_method: formData.paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      // We need to fetch product info to get seller_id (or include it in cart context)
      // For this example, we'll fetch them from DB based on cart IDs
      const { data: products } = await supabase
        .from('products')
        .select('id, seller_id')
        .in('id', cart.map(item => item.id));

      const orderItems = cart.map(item => {
        const product = products?.find(p => p.id === item.id);
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          seller_id: product?.seller_id
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 font-sans mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 font-sans mb-8">
            Thank you for your purchase. You can track your order in your dashboard.
          </p>
          <button 
            onClick={() => router.push  ('/dashboard')}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
          >
            Go to My Orders
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <button onClick={() => router.push('/cart')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
              <ChevronLeft className="w-4 h-4" /> Back to Cart
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans">Delivery Details</h1>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Wilaya</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.wilaya}
                  onChange={e => setFormData({ ...formData, wilaya: e.target.value })}
                >
                  <option value="">Select Wilaya</option>
                  {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Birkhadem"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Address</label>
              <textarea
                required
                rows={3}
                placeholder="Street name, Building number, Apartment..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 ml-1">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    formData.paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  <Truck className={`w-6 h-6 ${formData.paymentMethod === 'COD' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'ECCP' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    formData.paymentMethod === 'ECCP' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'ECCP' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="font-bold text-gray-900">ECCP Transfer</p>
                    <p className="text-xs text-gray-500">Pay via BaridiMob/Post</p>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Order Summary
            </h2>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1">{item.title} x {item.quantity}</span>
                  <span className="font-bold text-gray-900 ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-blue-600 font-sans">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
