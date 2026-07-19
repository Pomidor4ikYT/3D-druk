'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        setOrder(JSON.parse(storedOrder));
      } catch (e) {
        console.error('Помилка парсингу замовлення:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !order) {
      router.push('/');
    }
  }, [loading, order, router]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-custom text-center">
        <p className="text-gray-500">Завантаження...</p>
      </div>
    );
  }

  if (!order) return null;

  const deliveryLabelMap: Record<string, string> = {
    nova: 'Нова Пошта',
    ukr: 'Укрпошта',
    pickup: 'Самовивіз',
  };

  const deliveryLabel = deliveryLabelMap[String(order.delivery.type)] || order.delivery.type;

  return (
    <div className="pt-32 pb-20 container-custom max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#1a3c34]">Дякуємо за замовлення!</h1>
          <p className="text-gray-500 mt-2">
            Ваше замовлення прийнято. Ми зв'яжемося з вами протягом 12 годин.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Номер замовлення: <span className="font-mono font-bold">{order.id}</span>
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h2 className="text-xl font-bold text-[#1a3c34]">Деталі замовлення</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Ім'я</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Телефон</p>
              <p className="font-medium">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{order.customer.email || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500">Коментар</p>
              <p className="font-medium">{order.customer.comment || '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Доставка</p>
            <p className="font-medium">{deliveryLabel}</p>
            {order.delivery.city && <p className="text-sm">Місто: {order.delivery.city}</p>}
            {order.delivery.warehouse && <p className="text-sm">Відділення: {order.delivery.warehouse}</p>}
          </div>

          <div>
            <p className="text-gray-500 text-sm">Товари</p>
            <ul className="list-disc pl-4 text-sm">
              {order.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.title} — {item.quantity} шт. × {item.price} ₴
                  {item.options && Object.keys(item.options).length > 0 && (
                    <span className="text-gray-500"> ({Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')})</span>
                  )}
                  {item.file && (
                    <span className="text-blue-500 ml-1">📎 {item.file}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold mt-2">Загальна сума: {order.total} ₴</p>
          </div>

          <p className="text-xs text-gray-400">Дата: {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center border-t border-gray-200 pt-6">
          <Link
            href="/"
            className="px-6 py-3 bg-[#1a3c34] text-white rounded-xl font-medium hover:bg-[#2d5a4b] transition"
          >
            На головну
          </Link>
          <Link
            href="/gallery"
            className="px-6 py-3 border-2 border-[#c9a84c] text-[#c9a84c] rounded-xl font-medium hover:bg-[#c9a84c] hover:text-white transition"
          >
            Продовжити покупки
          </Link>
        </div>
      </motion.div>
    </div>
  );
}