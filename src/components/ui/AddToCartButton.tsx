'use client';

import { useCartStore } from '@/store/cartStore';

interface Props {
  item: {
    id?: string;
    title: string;
    price: number;
    category: string;
    image?: string;
    icon?: string;
    discount?: number;
    originalPrice?: number;
  };
}

export default function AddToCartButton({ item }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      id: item.id || `${item.title}-${Date.now()}`,
      title: item.title,
      price: item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price,
      originalPrice: item.originalPrice || item.price,
      category: item.category,
      image: item.image,
      icon: item.icon,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm"
    >
      🛒 Купити
    </button>
  );
}