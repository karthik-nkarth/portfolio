import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalInvoices: 0, totalCustomers: 0, totalRevenueINR: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/admin/dashboard`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);



  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <m.div whileHover={{ scale: 1.02, y: -5 }} className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow">
            <Icon icon="hugeicons:invoice-01" className="w-10 h-10" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Invoices</p>
            <p className="text-4xl font-black text-white drop-shadow-md">{stats.totalInvoices}</p>
          </div>
        </m.div>
        
        <m.div whileHover={{ scale: 1.02, y: -5 }} className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-5 bg-gradient-to-br from-teal-500/20 to-teal-600/10 rounded-2xl text-teal-400 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)] group-hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-shadow">
            <Icon icon="hugeicons:user-group" className="w-10 h-10" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Customers</p>
            <p className="text-4xl font-black text-white drop-shadow-md">{stats.totalCustomers}</p>
          </div>
        </m.div>

        <m.div whileHover={{ scale: 1.02, y: -5 }} className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-5 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow">
            <Icon icon="hugeicons:indian-rupee" className="w-10 h-10" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Revenue (INR)</p>
            <p className="text-4xl font-black text-white drop-shadow-md">₹{Number(stats.totalRevenueINR).toLocaleString()}</p>
          </div>
        </m.div>
      </div>

    </m.div>
  );
};

export default AdminDashboard;
