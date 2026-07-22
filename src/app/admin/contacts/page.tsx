'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

type ContactsData = {
  phone: string;
  email: string;
  address: string;
  workHours: string;
  socialLinks: SocialLink[];
};

// Популярні соціальні мережі для швидкого вибору
const SOCIAL_PRESETS = [
  { name: 'Telegram', icon: 'Telegram' },
  { name: 'WhatsApp', icon: 'WhatsApp' },
  { name: 'Instagram', icon: 'Instagram' },
  { name: 'Facebook', icon: 'Facebook' },
  { name: 'YouTube', icon: 'YouTube' },
  { name: 'TikTok', icon: 'TikTok' },
  { name: 'LinkedIn', icon: 'LinkedIn' },
  { name: 'Twitter', icon: 'Twitter' },
];

export default function AdminContacts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<ContactsData>({
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
    workHours: 'Пн–Пт 9:00–18:00',
    socialLinks: [
      { name: 'Telegram', url: 'https://t.me/3d_print', icon: 'Telegram' },
      { name: 'WhatsApp', url: 'https://wa.me/380980751707', icon: 'WhatsApp' },
      { name: 'Instagram', url: 'https://instagram.com/3d_print_ua', icon: 'Instagram' },
    ],
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const contactsItem = items.find((item: any) => item.key === 'contacts');
      if (contactsItem?.data) {
        const d = contactsItem.data;
        // Конвертуємо старі поля в socialLinks, якщо їх немає
        if (!d.socialLinks) {
          const socialLinks = [];
          if (d.telegram) socialLinks.push({ name: 'Telegram', url: d.telegram, icon: 'Telegram' });
          if (d.whatsapp) socialLinks.push({ name: 'WhatsApp', url: d.whatsapp, icon: 'WhatsApp' });
          if (d.instagram) socialLinks.push({ name: 'Instagram', url: d.instagram, icon: 'Instagram' });
          d.socialLinks = socialLinks;
        }
        // Якщо у деяких соціальних мереж немає іконки, додаємо за замовчуванням
        d.socialLinks = d.socialLinks.map((link: any) => ({
          ...link,
          icon: link.icon || link.name,
        }));
        setData(d);
      }
    } catch (err) {
      setError('Не вдалося завантажити контакти');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactsData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index: number, field: 'name' | 'url' | 'icon', value: string) => {
    const newSocial = [...data.socialLinks];
    newSocial[index] = { ...newSocial[index], [field]: value };
    setData(prev => ({ ...prev, socialLinks: newSocial }));
  };

  const addSocial = () => {
    setData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: '', url: '', icon: '' }],
    }));
  };

  const removeSocial = (index: number) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
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
        body: JSON.stringify({ key: 'contacts', data }),
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
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Редагування контактів</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адреса</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Графік роботи</label>
            <input
              type="text"
              value={data.workHours || ''}
              onChange={(e) => handleChange('workHours', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Соціальні мережі</label>
            {data.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-wrap gap-2 mb-2 items-center">
                {/* Випадаючий список з популярними соцмережами */}
                <select
                  value={link.icon || ''}
                  onChange={(e) => handleSocialChange(index, 'icon', e.target.value)}
                  className="w-36 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                >
                  <option value="">Виберіть іконку</option>
                  {SOCIAL_PRESETS.map((preset) => (
                    <option key={preset.name} value={preset.icon}>
                      {preset.name} ({preset.icon})
                    </option>
                  ))}
                  <option value="custom">Інше (введіть назву файлу)</option>
                </select>

                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleSocialChange(index, 'name', e.target.value)}
                  placeholder="Назва (Telegram, Facebook...)"
                  className="flex-1 min-w-[120px] p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                  placeholder="Посилання"
                  className="flex-1 min-w-[180px] p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocial}
              className="text-sm text-blue-600 hover:text-blue-800 transition"
            >
              + Додати соціальну мережу
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Для іконки оберіть назву зі списку (наприклад, Telegram, Facebook) або введіть назву файлу 
              (без розширення) з папки <code className="bg-gray-100 px-1 py-0.5 rounded">public/icons/</code>. 
              Наприклад, <code>Telegram</code> → <code>/icons/Telegram.svg</code>
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✅ Контакти успішно збережено!</p>}

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
    </div>
  );
}