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
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/works" element={<Works />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
            <Footer />
            <FloatingButtons />
          </div>
        </Router>
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
