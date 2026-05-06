
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Mail, ShieldCheck, Clock, ExternalLink, BarChart3, Package } from 'lucide-react';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-sans">User Dashboard</h1>
              <p className="text-gray-500 font-sans mt-1">Manage your account and view session details</p>
            </div>
            <button
              onClick={signOut}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Quick Actions */}
        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Email Identity</h3>
              </div>
              <p className="text-gray-600 break-all">{user.email}</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                {user.email_confirmed_at ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Verification
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Security Details</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span className="font-mono text-xs overflow-hidden text-ellipsis ml-2 max-w-[150px]">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sign In:</span>
                  <span>{new Date(user.last_sign_in_at || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="capitalize">{user.app_metadata.provider}</span>
                </div>
              </div>
            </div>
          </div>

      
        </div>
      </motion.div>
    </div>
  );
}
