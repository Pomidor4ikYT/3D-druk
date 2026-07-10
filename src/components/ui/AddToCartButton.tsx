'use client';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import Toast from './Toast';

interface AddToCartButtonProps {
  item: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    originalPrice?: number;
    discount?: number;
    options?: Record<string, any>;
  };
  className?: string;
  showQuantity?: boolean;
}

export default function AddToCartButton({ item, className = '', showQuantity = false }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Додаємо товар з кількістю, але в кошику quantity буде збільшуватися на 1
    // Тому додаємо кілька разів або оновлюємо логіку
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...item,
        options: item.options || {},
      });
    }
    setShowToast(true);
    setQuantity(1); // скидаємо після додавання
  };

  return (
    <>
      {showQuantity && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(Math.max(1, quantity - 1));
            }}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center text-lg font-bold"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-sm">{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(quantity + 1);
            }}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center text-lg font-bold"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAdd}
        className={`text-xs px-3 py-1.5 rounded-full bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
      >
        🛒 Купити
      </button>
      <Toast
        message={`✅ ${item.title} додано до кошика!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}