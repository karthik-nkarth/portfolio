import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import {  m  } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-orange-400">Karthik Narayanan</h3>
            <p className="text-gray-400 mb-4">
              Measurement & Analytics SME Team Lead specializing in GA4, GTM, Google Ads, and enterprise-scale analytics solutions.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/nkarth/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/works" className="text-gray-400 hover:text-orange-400 transition-colors">My Works</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Icon icon="hugeicons:mail-01" className="w-4 h-4" />
                <a href="mailto:karthik.hamsanarayanan@gmail.com" className="text-xs sm:text-sm md:text-base hover:text-orange-400 transition-colors">
                  karthik.hamsanarayanan@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Icon icon="hugeicons:call" className="w-4 h-4" />
                <a href="tel:+918686928205" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <span className="hidden sm:inline">+91 86869 28205</span>
                  <span className="sm:hidden">Call</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Icon icon="hugeicons:location-01" className="w-4 h-4" />
                <span>Hyderabad, India</span>
              </li>
            </ul>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Let's Connect</h4>
            <p className="text-gray-400 mb-4">
              Ready to discuss your next project? Get in touch today.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              Get In Touch
            </Link>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} Karthik Narayanan. All rights reserved.</p>
        </m.div>
      </div>
    </footer>
  );
};

export default Footer;
