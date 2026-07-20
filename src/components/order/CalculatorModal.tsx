'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

// ==================== ОНОВЛЕНІ ЦІНИ МАТЕРІАЛІВ ====================
const materials = [
  { name: 'PLA', pricePerGram: 6 },
  { name: 'PETG', pricePerGram: 7 },
  { name: 'ABS', pricePerGram: 7 },
  { name: 'ASA', pricePerGram: 8 },
  { name: 'TPU', pricePerGram: 10 },
  { name: 'PA (нейлон)', pricePerGram: 15 },
];

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const [material, setMaterial] = useState(materials[0]);
  const [weight, setWeight] = useState(10);
  const [quantity, setQuantity] = useState(1);

  const total = material.pricePerGram * weight * quantity;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-[#1a3c34] mb-6">🧮 Калькулятор вартості</h3>

        <div className="space-y-4">
          {/* Матеріал */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Матеріал (ціна за грам)</label>
            <select
              value={material.name}
              onChange={(e) => setMaterial(materials.find(m => m.name === e.target.value) || materials[0])}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c9a84c] outline-none transition"
            >
              {materials.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.pricePerGram} ₴/г)
                </option>
              ))}
            </select>
          </div>

          {/* Вага */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вага моделі (г)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value)))}
              min="0.1"
              step="0.1"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c9a84c] outline-none transition"
            />
          </div>

          {/* Кількість */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Кількість</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min="1"
              step="1"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c9a84c] outline-none transition"
            />
          </div>

          {/* Кнопка (не обов'язкова, можна прибрати, бо ціна оновлюється автоматично) */}
          <button className="btn-primary w-full py-3" onClick={() => {}}>
            Розрахувати
          </button>

          {/* Результат */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-[#f5f0eb] rounded-xl border border-[#c9a84c]/30 text-center"
            >
              <p className="text-sm text-gray-600">Орієнтовна вартість:</p>
              <p className="text-3xl font-bold text-[#1a3c34]">{total.toFixed(2)} грн</p>
              <p className="text-xs text-gray-400 mt-1">* Точна ціна після узгодження моделі</p>
            </motion.div>
          )}

          {/* Закрити */}
          <button onClick={onClose} className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition">
            Закрити
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}