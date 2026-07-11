'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

const images = [
  { src: '/images/gallery/1.jpg', title: 'Масажні ролери', category: 'Іграшки', price: 200, discount: 10, originalPrice: 222 },
  { src: '/images/gallery/2.jpg', title: 'Набір іграшок', category: 'Іграшки', price: 350 },
  { src: '/images/gallery/3.jpg', title: 'Можлива деталь', category: 'Іграшки', price: 150 },
  { src: '/images/gallery/4.jpg', title: 'Коробка передач (прототип)', category: 'Прототипи', price: 500, discount: 15, originalPrice: 588 },
  { src: '/images/gallery/5.jpg', title: 'Масажні ролери', category: 'Декор', price: 250 },
  { src: '/images/gallery/6.jpg', title: 'Можлива деталь', category: 'Іграшки', price: 120 },
  { src: '/images/gallery/7.jpg', title: 'Протез руки', category: 'Прототипи', price: 800 },
  { src: '/images/gallery/8.jpg', title: 'Протез (деталь)', category: 'Прототипи', price: 600 },
  { src: '/images/gallery/9.jpg', title: 'Протез', category: 'Прототипи', price: 900 },
  { src: '/images/gallery/10.jpg', title: 'Протез (готовий виріб)', category: 'Прототипи', price: 1000 },
  { src: '/images/gallery/11.jpg', title: 'Скелет руки (навчальний)', category: 'Прототипи', price: 700 },
  { src: '/images/gallery/12.jpg', title: 'Протез (адаптивний)', category: 'Прототипи', price: 850 },
  { src: '/images/gallery/13.jpg', title: 'Протез (комплексний)', category: 'Прототипи', price: 950 },
  { src: '/images/gallery/14.jpg', title: 'Гра "Хрестики-нолики"', category: 'Іграшки', price: 300 },
  { src: '/images/gallery/15.jpg', title: 'Іграшка-конструктор', category: 'Іграшки', price: 400 },
  { src: '/images/gallery/16.jpg', title: 'Колекція фігурок', category: 'Іграшки', price: 500 },
  { src: '/images/gallery/17.jpg', title: 'Набір фігурок', category: 'Іграшки', price: 450 },
  { src: '/images/gallery/18.jpg', title: 'Фігурка Телелан', category: 'Іграшки', price: 250 },
  { src: '/images/gallery/19.jpg', title: 'Фігурка Чаплін', category: 'Іграшки', price: 280 },
  { src: '/images/gallery/20.jpg', title: 'Фігурка Стрий FM', category: 'Іграшки', price: 300 },
];

const categories = ['Всі', 'Іграшки', 'Прототипи', 'Декор'];

// Компонент модалки покупки (як у послугах)
function PurchaseModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: {
  item: typeof images[0] | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const finalPrice = item.discount
    ? Math.round(item.price * (1 - item.discount / 100))
    : item.price;

  const totalPrice = finalPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#1a3c34]">{item.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-4">
          <div className="relative w-full h-full">
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-contain"
              sizes="100vw"
              loading="eager" // для модалки завантажуємо одразу
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-2">{item.category}</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ціна за шт:</span>
            <span className="font-bold text-[#1a3c34]">{finalPrice} ₴</span>
          </div>
          {item.originalPrice && item.originalPrice > item.price && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Стара ціна:</span>
              <span className="line-through">{item.originalPrice} ₴</span>
            </div>
          )}
          {item.discount && item.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Знижка:</span>
              <span>-{item.discount}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-gray-700 font-medium">Кількість:</span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-xl font-bold"
            >
              −
            </button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-4">
          <p className="text-sm text-gray-600">Загальна вартість:</p>
          <p className="text-3xl font-bold text-[#1a3c34]">{totalPrice} ₴</p>
        </div>

        <button
          onClick={() => {
            onAddToCart(quantity);
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-300 shadow-md shadow-[#1a3c34]/20 text-base"
        >
          Додати в кошик
        </button>
      </motion.div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<typeof images[0] | null>(null);
  const [filter, setFilter] = useState('Всі');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const filtered = filter === 'Всі' ? images : images.filter(img => img.category === filter);

  const handleAddToCart = (item: typeof images[0], quantity: number) => {
    const finalPrice = item.discount
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;

    addItem({
      id: item.src,
      title: item.title,
      price: finalPrice,
      image: item.src,
      category: item.category,
      originalPrice: item.originalPrice,
      discount: item.discount,
      quantity: quantity,
    });
    setToastMessage(`✅ ${item.title} додано до кошика! (${quantity} шт.)`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="pt-32 pb-20 container-custom">
      {/* Toast – справа зверху, як у послугах */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 right-4 z-50 bg-[#1a3c34] text-white px-6 py-4 rounded-xl shadow-2xl border border-[#c9a84c]/30 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-medium">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white transition"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-center mb-4 text-[#1a3c34] font-heading text-4xl font-bold">Галерея робіт</h1>
      <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
        Результати нашої роботи — від дрібних деталей до великих макетів.
      </p>

      <div className="flex justify-center gap-3 flex-wrap mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === cat ? 'bg-[#1a3c34] text-white shadow-lg shadow-[#1a3c34]/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ scale: 1.02 }}
            className="relative h-72 rounded-2xl overflow-hidden shadow-lg cursor-pointer group border border-gray-200"
          >
            {/* Клік на картку – відкриває фото на повний екран */}
            <div onClick={() => setSelectedPhoto(images.indexOf(img))} className="w-full h-full relative">
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
                // для перших 4 зображень (LCP) ставимо eager, для решти lazy (за замовчуванням)
                loading={idx < 4 ? "eager" : "lazy"}
              />
            </div>
            
            {/* Badge акції */}
            {img.discount && img.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                -{img.discount}%
              </div>
            )}

            {/* Інформація на картці (завжди видна) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-heading font-bold text-lg">{img.title}</p>
                  <p className="text-[#7ec8a3] text-sm">{img.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">
                    {img.discount
                      ? Math.round(img.price * (1 - img.discount / 100))
                      : img.price} грн
                  </p>
                  {img.originalPrice && img.originalPrice > img.price && (
                    <p className="text-red-400 text-xs line-through">{img.originalPrice} грн</p>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка "Купити" – з'являється при наведенні, відкриває модалку покупки */}
            <div className="absolute bottom-20 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPurchase(img);
                }}
                className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm"
              >
                🛒 Купити
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm mb-4">Шукаєте більше моделей?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="https://www.printables.com/model" variant="secondary" target="_blank" rel="noopener noreferrer">
            Printables.com
          </Button>
          <Button href="https://www.thingiverse.com/search?category_id=73" variant="secondary" target="_blank" rel="noopener noreferrer">
            Thingiverse
          </Button>
        </div>
      </div>

      {/* Модалка перегляду фото (повний екран) */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full h-[90vh] bg-transparent flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[selectedPhoto].src}
                  alt={images[selectedPhoto].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  loading="eager"
                />
              </div>
              <button
                className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {images[selectedPhoto].title}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Модалка покупки (вибір кількості) */}
      <PurchaseModal
        item={selectedPurchase}
        isOpen={!!selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        onAddToCart={(quantity) => {
          if (selectedPurchase) {
            handleAddToCart(selectedPurchase, quantity);
            setSelectedPurchase(null);
          }
        }}
      />
    </div>
  );
}