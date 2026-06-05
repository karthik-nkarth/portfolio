import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';
import ChangePasswordModal from './ChangePasswordModal';

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/admin/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setIsAuthenticated(true);
            return;
          }
        }
        setIsAuthenticated(false);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await fetch(`${apiUrl}/api/admin/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: 'hugeicons:dashboard-square-01', label: 'Dashboard' },
    { path: '/admin/invoices', icon: 'hugeicons:invoice-01', label: 'Invoices' },
    { path: '/admin/sender-profiles', icon: 'hugeicons:building-03', label: 'My Businesses' },
    { path: '/admin/customers', icon: 'hugeicons:user-group', label: 'Customers' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex text-white font-sans selection:bg-blue-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-gray-900/60 backdrop-blur-2xl border-r border-gray-800/60 flex flex-col hidden md:flex sticky top-0 h-screen z-20 shadow-2xl">
        <div className="p-8 border-b border-gray-800/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
            <Icon icon="hugeicons:rocket-01" className="text-blue-400 w-8 h-8 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
            Admin Portal
          </h2>
        </div>
        
        <nav className="flex-1 p-5 space-y-3 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <m.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-white/10' 
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white border border-transparent hover:border-gray-700/50'
                }`}
              >
                <Icon icon={item.icon} className={`w-6 h-6 ${isActive ? 'drop-shadow-md' : ''}`} />
                <span className="font-semibold tracking-wide">{item.label}</span>
              </m.button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-800/60 bg-gray-900/40 mt-auto space-y-3">
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-blue-400 font-semibold hover:bg-blue-500/10 hover:text-blue-300 transition-all border border-transparent hover:border-blue-500/20 shadow-lg shadow-transparent hover:shadow-blue-500/5"
          >
            <Icon icon="hugeicons:security-lock" className="w-6 h-6" />
            <span>Change Password</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-red-400 font-semibold hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20 shadow-lg shadow-transparent hover:shadow-red-500/5"
          >
            <Icon icon="hugeicons:logout-01" className="w-6 h-6" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-900/80 backdrop-blur-xl p-5 border-b border-gray-800/60 flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center gap-2">
            <Icon icon="hugeicons:rocket-01" className="text-blue-400 w-6 h-6" />
            Admin
          </h2>
          <button onClick={handleLogout} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
            <Icon icon="hugeicons:logout-01" className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Content */}
        <div className="p-6 md:p-12 flex-1">
          <Outlet />
        </div>
      </main>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default AdminLayout;
