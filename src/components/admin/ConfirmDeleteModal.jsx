import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10 blur-[50px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <Icon icon="hugeicons:alert-02" className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{title || "Confirm Deletion"}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {message || "Are you sure you want to delete this item? This action cannot be undone."}
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition-all border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-500/25"
                >
                  Delete
                </button>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
