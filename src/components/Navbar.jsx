import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@iconify/react';
import {  m, AnimatePresence  } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/works', label: 'My Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <m.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-orange-200 dark:border-blue-900"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400">
          <img src="/favicon.svg" alt="KN Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span>Karthik Narayanan</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <m.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-blue-900 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Icon icon="hugeicons:sun-01" className="w-5 h-5 text-orange-400" />
              ) : (
                <Icon icon="hugeicons:moon-02" className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <a
              href="tel:+918686928205"
              className="flex items-center justify-center w-10 h-10 bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full transition-all hover:scale-105"
              aria-label="Call"
            >
              <Icon icon="hugeicons:call" className="w-5 h-5" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-orange-100 dark:hover:bg-blue-900 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <Icon icon="hugeicons:cancel-01" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Icon icon="hugeicons:menu-11" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-orange-200 dark:border-blue-900"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
};

export default Navbar;
