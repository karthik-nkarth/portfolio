import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import ShootingStar from './components/ShootingStar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import './index.css';

// Lazy loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Works = React.lazy(() => import('./pages/Works'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminResetPassword = React.lazy(() => import('./pages/admin/ResetPassword'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminSenderProfiles = React.lazy(() => import('./pages/admin/SenderProfiles'));
const AdminCustomers = React.lazy(() => import('./pages/admin/Customers'));
const AdminInvoices = React.lazy(() => import('./pages/admin/Invoices'));
const AdminViewInvoice = React.lazy(() => import('./pages/admin/ViewInvoice'));
const AdminCreateInvoice = React.lazy(() => import('./pages/admin/CreateInvoice'));

// Lightweight loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-black dark:to-blue-900 transition-colors duration-500">
            <StarField />
            <ShootingStar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><Home /><Footer /><FloatingButtons /></>} />
                <Route path="/works" element={<><Navbar /><Works /><Footer /><FloatingButtons /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /><Footer /><FloatingButtons /></>} />
                
                {/* Admin Routes (No Navbar/Footer) */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="sender-profiles" element={<AdminSenderProfiles />} />
                  <Route path="invoices" element={<AdminInvoices />} />
                  <Route path="invoices/create" element={<AdminCreateInvoice />} />
                  <Route path="invoices/:id" element={<AdminViewInvoice />} />
                  <Route path="customers" element={<AdminCustomers />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </Router>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
