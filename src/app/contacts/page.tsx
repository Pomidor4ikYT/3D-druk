import { supabaseAdmin } from '@/lib/supabase/server';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getContacts() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'contacts')
    .single();
  return data?.data || {
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
    telegram: 'https://t.me/3d_print',
    whatsapp: 'https://wa.me/380980751707',
    instagram: 'https://instagram.com/3d_print_ua',
  };
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  const items = [
    { icon: '📞', label: 'Телефон / WhatsApp', value: contacts.phone, href: `tel:${contacts.phone.replace(/\s/g, '')}` },
    { icon: '✉️', label: 'Email', value: contacts.email, href: `mailto:${contacts.email}` },
    { icon: '🕒', label: 'Графік роботи', value: 'Пн–Пт 9:00–18:00', href: null },
    { icon: '📍', label: 'Адреса', value: contacts.address, href: null },
  ];

  const socials = [
    { name: 'Telegram', href: contacts.telegram, icon: '📱' },
    { name: 'WhatsApp', href: contacts.whatsapp, icon: '💬' },
    { name: 'Instagram', href: contacts.instagram, icon: '📷' },
  ];

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">Контакти</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Зв'яжіться з нами – ми завжди на зв'язку
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 flex items-center gap-4 hover:shadow-md hover:border-[#c9a84c]"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-gray-700 font-medium hover:text-[#1a3c34] transition break-words block">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-700 font-medium break-words">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-start">
            <h2 className="text-lg font-bold text-[#1a3c34] mb-4">Ми в соцмережах</h2>
            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 hover:border-[#c9a84c] hover:bg-[#f5f0eb] transition-all duration-200"
                >
                  <span className="text-xl">{social.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a3c34] to-[#2d5a4b] rounded-2xl shadow-md border border-[#2d5a4b] p-6 flex flex-col items-start justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📱</span>
              <span className="text-white font-bold text-lg">Telegram</span>
            </div>
            <p className="text-white/80 text-sm mb-4">Напишіть нам у Telegram – відповімо протягом 12 годин</p>
            <Button href={contacts.telegram} variant="primary" className="bg-[#c9a84c] text-[#1a3c34] hover:bg-[#b89a3e]">
              Написати в Telegram
            </Button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
          <div className="relative w-full h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps?q=82400+Львівська+обл.+Стрий+вул.+Народна+8&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Карта Google Maps"
            />
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📍</span>
              <span>{contacts.address}</span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contacts.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a84c] font-medium text-sm hover:underline flex items-center gap-1"
            >
              Прокласти маршрут
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}