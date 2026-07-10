'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] bg-[#1a3c34] text-white px-8 py-4 rounded-2xl shadow-2xl border border-[#c9a84c]/40 max-w-md w-full text-center"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">✅</span>
            <p className="font-medium text-lg">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-2 right-3 text-white/60 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}