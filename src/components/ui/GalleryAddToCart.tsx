'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryAddToCartProps {
  item: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    originalPrice?: number;
    category: string;
    image: string;
  };
}

export default function GalleryAddToCart({ item }: GalleryAddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [mounted, setMounted] = useState(false);

  const finalPrice = item.discount
    ? Math.round(item.price * (1 - item.discount / 100))
    : item.price;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const handleAdd = () => {
    addItem({
      id: item.id,
      title: item.title,
      price: finalPrice,
      originalPrice: item.originalPrice || item.price,
      category: item.category,
      image: item.image,
      quantity: quantity,
      options: comment.trim() ? { 'Коментар': comment.trim() } : undefined,
    });
    setShowModal(false);
    setQuantity(1);
    setComment('');
    
    const toastEvent = new CustomEvent('showToast', {
      detail: { message: `✅ ${item.title} додано до кошика!` },
    });
    window.dispatchEvent(toastEvent);
  };

  if (!mounted) return (
    <button
      onClick={() => setShowModal(true)}
      className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm"
    >
      🛒 Купити
    </button>
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm"
      >
        🛒 Купити
      </button>

      {showModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Затемнення */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Модалка */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Зображення товару */}
              <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-md">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-[#1a3c34]">{item.title}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-3xl transition -mt-2"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500">Категорія: {item.category}</p>
                <div className="mt-1">
                  <p className="text-3xl font-bold text-[#1a3c34]">{finalPrice} грн</p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-sm text-red-500 line-through">
                      {item.originalPrice} грн
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <label className="text-base font-medium text-gray-700">Кількість:</label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-xl font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Коментар до замовлення (необов'язково)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Наприклад: колір, розмір, особливості..."
                rows={3}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-base"
              />
            </div>

            <button
              onClick={handleAdd}
              className="mt-6 w-full py-4 bg-[#1a3c34] text-white rounded-xl font-bold hover:bg-[#2d5a4b] transition text-lg"
            >
              Додати до кошика
            </button>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}