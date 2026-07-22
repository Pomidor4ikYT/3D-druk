'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PricingItem = {
  label: string;
  value: string;
};

type PricingBlock = {
  title: string;
  icon: string;
  items: PricingItem[];
  footer: string;
  action: string | null;
};

export default function EditPricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<PricingBlock[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const pricing = items.find((item: any) => item.key === 'pricing');
      if (pricing?.data && Array.isArray(pricing.data) && pricing.data.length > 0) {
        setData(pricing.data);
      } else {
        // Дефолтні дані, якщо в базі порожньо
        setData([
          {
            title: 'Орієнтовні ціни',
            icon: '💰',
            items: [
              { label: 'PLA', value: 'від 6 грн/г' },
              { label: 'PETG', value: 'від 7 грн/г' },
              { label: 'ABS', value: 'від 7 грн/г' },
              { label: 'ASA', value: 'від 8 грн/г' },
              { label: 'TPU', value: 'від 10 грн/г' },
              { label: 'PA', value: 'від 15 грн/г' },
            ],
            footer: '*Точна ціна після узгодження моделі',
            action: 'Розрахувати вартість',
          },
          {
            title: 'Доставка',
            icon: '🚚',
            items: [
              { label: 'Нова Пошта', value: '1-3 дні' },
              { label: 'Укрпошта', value: '2-5 днів' },
              { label: 'Самовивіз', value: 'Стрий' },
            ],
            footer: 'Вартість згідно з тарифами перевізника',
            action: null,
          },
          {
            title: 'Гарантії та акції',
            icon: '✅',
            items: [
              { label: 'Якість', value: 'Перевірка кожного виробу' },
              { label: 'Заміна', value: 'Безкоштовно при браку' },
              { label: 'Консультація', value: 'Перед друком' },
              { label: 'Акція', value: 'від 10 шт. – знижка 5%' },
            ],
            footer: 'Повернення браку – при відеофіксації розпаковки',
            action: null,
          },
        ]);
      }
    } catch (err) {
      setError('Не вдалося завантажити дані');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockChange = (blockIndex: number, field: string, value: any) => {
    const newData = [...data];
    newData[blockIndex] = { ...newData[blockIndex], [field]: value };
    setData(newData);
  };

  const handleItemChange = (blockIndex: number, itemIndex: number, field: 'label' | 'value', value: string) => {
    const newData = [...data];
    const items = [...newData[blockIndex].items];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    newData[blockIndex].items = items;
    setData(newData);
  };

  const addItem = (blockIndex: number) => {
    const newData = [...data];
    newData[blockIndex].items.push({ label: 'Нова характеристика', value: 'значення' });
    setData(newData);
  };

  const removeItem = (blockIndex: number, itemIndex: number) => {
    const newData = [...data];
    newData[blockIndex].items.splice(itemIndex, 1);
    setData(newData);
  };

  const addBlock = () => {
    setData([
      ...data,
      {
        title: 'Новий блок',
        icon: '📌',
        items: [{ label: 'Приклад', value: 'значення' }],
        footer: '',
        action: null,
      },
    ]);
  };

  const removeBlock = (blockIndex: number) => {
    if (data.length <= 1) return alert('Має бути хоча б один блок');
    const newData = [...data];
    newData.splice(blockIndex, 1);
    setData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pricing', data }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Редагування: Вартість та доставка</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {data.map((block, blockIdx) => (
          <div key={blockIdx} className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-[#1a3c34]">Блок #{blockIdx + 1}</h3>
              <button
                type="button"
                onClick={() => removeBlock(blockIdx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕ Видалити блок
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Заголовок</label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => handleBlockChange(blockIdx, 'title', e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Іконка (emoji)</label>
                <input
                  type="text"
                  value={block.icon}
                  onChange={(e) => handleBlockChange(blockIdx, 'icon', e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Підвал (footer)</label>
                <input
                  type="text"
                  value={block.footer}
                  onChange={(e) => handleBlockChange(blockIdx, 'footer', e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Дія (текст кнопки, або null)</label>
                <input
                  type="text"
                  value={block.action || ''}
                  onChange={(e) => handleBlockChange(blockIdx, 'action', e.target.value || null)}
                  placeholder="Наприклад: Розрахувати вартість"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Пункти (items)</label>
              {block.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleItemChange(blockIdx, itemIdx, 'label', e.target.value)}
                    placeholder="Назва"
                    className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleItemChange(blockIdx, itemIdx, 'value', e.target.value)}
                    placeholder="Значення"
                    className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(blockIdx, itemIdx)}
                    className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem(blockIdx)}
                className="text-sm text-blue-600 hover:text-blue-800 transition"
              >
                + Додати пункт
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addBlock}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
          >
            + Додати блок
          </button>
          <button
            type="button"
            onClick={() => {
              if (data.length > 0) {
                const newData = [...data];
                newData.pop();
                setData(newData);
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Видалити останній блок
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">✅ Збережено!</p>}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {saving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
}