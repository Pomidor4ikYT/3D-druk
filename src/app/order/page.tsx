'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/forms/FileUpload';
import CalculatorModal from '@/components/order/CalculatorModal';
import DeliverySelector from '@/components/order/DeliverySelector';

// Прайс для дизайнерських моделей
const designPrices = [
  { label: 'Концепція виробу', price: '500–2 000 грн' },
  { label: 'Проста 3D-модель', price: '2 000–5 000 грн' },
  { label: 'Авторський сувенір', price: '5 000–15 000 грн' },
  { label: 'Художня модель', price: '15 000–40 000 грн' },
  { label: 'Підготовка до кольорового друку AMS', price: '+20–40%' },
  { label: 'Передача виключних авторських прав', price: '+50–200% до вартості моделі' },
];

export default function OrderPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    delivery: 'nova' as 'nova' | 'ukr' | 'pickup',
    city: '',
    warehouse: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [calcOpen, setCalcOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<typeof form | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('Будь ласка, завантажте файл моделі або зображення');
      return;
    }
    if (form.delivery !== 'pickup' && (!form.city.trim() || !form.warehouse.trim())) {
      setStatus('Будь ласка, введіть місто та відділення');
      return;
    }
    
    setStatus('Надсилання...');
    
    // Імітація відправки
    setTimeout(() => {
      setLastOrder({ ...form });
      setStatus('');
      setShowSuccess(true);
      setForm({ name: '', phone: '', email: '', delivery: 'nova', city: '', warehouse: '', description: '' });
      setFile(null);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 container-custom max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-[#1a3c34] mb-4 font-heading text-4xl">Замовити 3D-друк</h1>
        <p className="text-gray-600 text-lg">Заповніть форму, завантажте файл і ми розрахуємо вартість</p>
        <button onClick={() => setCalcOpen(true)} className="mt-4 text-[#c9a84c] font-semibold underline hover:no-underline">
          Попередньо розрахувати вартість →
        </button>
        {/* Максимальний розмір */}
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">
          📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см (об'єм ~16,8 л)
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваше ім’я *</label>
              <input
                type="text"
                placeholder="Іван Петренко"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input
                type="tel"
                placeholder="+38 098 0751707"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (необов'язково)</label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Спосіб доставки</label>
            <DeliverySelector
              value={{
                city: form.city,
                warehouse: form.warehouse,
                deliveryType: form.delivery,
              }}
              onChange={(val) => setForm({
                ...form,
                city: val.city,
                warehouse: val.warehouse,
                delivery: val.deliveryType,
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис замовлення</label>
            <textarea
              placeholder="Вкажіть розміри, бажаний матеріал, колір, кількість..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          {/* Прайс дизайнерських моделей */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-[#1a3c34] mb-2">💰 Ціни на дизайнерські моделі</h4>
            <ul className="space-y-1 text-sm">
              {designPrices.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-[#1a3c34]">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Акція */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-sm text-green-800">
            🎉 Акція: при замовленні від 10 одиниць – знижка 5%.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Файл моделі або фото *</label>
            <FileUpload onFileSelect={setFile} />
            {file && <p className="text-[#1a3c34] text-sm mt-2">✅ Вибрано: {file.name}</p>}
          </div>

          {/* Умова повернення браку */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-sm text-red-700">
            ⚠️ Повернення браку можливе при наявності відеофіксації несправності при розпаковці.
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg shadow-lg shadow-[#1a3c34]/20">
            Надіслати заявку
          </Button>
          {status && <p className="text-center font-medium text-[#1a3c34]">{status}</p>}
        </form>
      </div>

      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />

      {/* Модалка успіху – без змін */}
      <AnimatePresence>
        {showSuccess && lastOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7ec8a3]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c9a84c]/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-[#7ec8a3] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#7ec8a3]/30 animate-float">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-heading font-bold text-[#1a3c34] mb-2">Дякуємо!</h3>
                <p className="text-gray-600 text-lg mb-2">Ваше замовлення прийнято.</p>
                <p className="text-gray-500 text-sm mb-6">Ми зв’яжемося з вами протягом 12 годин.</p>

                <div className="flex flex-col gap-2 mb-6 text-left bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Ім’я:</span>
                    <span className="font-medium text-gray-700">{lastOrder.name || '—'}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Телефон:</span>
                    <span className="font-medium text-gray-700">{lastOrder.phone || '—'}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Доставка:</span>
                    <span className="font-medium text-gray-700">
                      {lastOrder.delivery === 'nova' ? 'Нова Пошта' : lastOrder.delivery === 'ukr' ? 'Укрпошта' : 'Самовивіз'}
                    </span>
                  </p>
                  {(lastOrder.city || lastOrder.warehouse) && (
                    <>
                      <p className="text-sm text-gray-500 flex justify-between">
                        <span>Місто:</span>
                        <span className="font-medium text-gray-700">{lastOrder.city || '—'}</span>
                      </p>
                      <p className="text-sm text-gray-500 flex justify-between">
                        <span>Відділення:</span>
                        <span className="font-medium text-gray-700">{lastOrder.warehouse || '—'}</span>
                      </p>
                    </>
                  )}
                  {lastOrder.description && (
                    <p className="text-sm text-gray-500 flex justify-between">
                      <span>Опис:</span>
                      <span className="font-medium text-gray-700 truncate max-w-[150px]">{lastOrder.description}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary w-full py-3 text-center"
                >
                  Зрозуміло
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}