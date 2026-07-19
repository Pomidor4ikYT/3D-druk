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
    {
      name: 'Telegram',
      href: contacts.telegram,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#26A5E4"/>
          <path d="M11.99 4.5C7.86 4.5 4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm3.55 11.07c-.15.77-.76 1.1-1.52.88l-2.82-1.05-2.82 1.05c-.14.05-.27-.03-.3-.18l-.22-1.1.67-.66 2.78-2.65-2.78-2.66-.67-.66.22-1.1c.03-.15.16-.23.3-.18l5.04 1.87 1.71-.94.87-.42c.16-.07.33.02.35.21l.06.47-.02.37-.06.41-.89 4.87 2.79-1.1c.77-.3 1.13.09 1.1.73l-.51 2.78z" fill="white"/>
          <path d="M13.46 13.88l-2.66 2.51-.53-2.24 2.48-2.26-1.63-1.54-.9-4.58 4.97 1.88 1.85-1.01.34 2.01-.91 4.9 2.65-1.04.34 1.97-.51 2.72-4.14 1.65-.02.02-.49 2.83-.53-2.26-1.72-.56 2.37-2.36z" fill="#26A5E4"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      href: contacts.whatsapp,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.25.62 4.36 1.7 6.16L0 24l5.96-1.67C7.65 23.37 9.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#25D366"/>
          <path d="M12 2.5C6.76 2.5 2.5 6.76 2.5 12c0 2.1.68 4.04 1.83 5.62l-1.2 4.25 4.4-1.22c1.58.96 3.44 1.5 5.47 1.5 5.24 0 9.5-4.26 9.5-9.5S17.24 2.5 12 2.5zm4.17 13.65l-.38.38c-.65.65-1.55.98-2.45.98-1.36 0-2.7-.68-3.9-1.82l-.4-.39c-2.5-2.5-2.5-6.56 0-9.06l.38-.38c.29-.29.65-.42 1.02-.42.6 0 1.17.34 1.46.88l.76 1.44c.2.38.16.85-.1 1.2l-.51.69c-.15.2-.16.46-.02.67.47.84 1.27 1.82 2.14 2.33.21.12.46.12.66-.02l.72-.48c.35-.23.83-.27 1.2-.07l1.44.76c.54.28.88.86.88 1.46 0 .38-.14.74-.43 1.03z" fill="white"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: contacts.instagram,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="url(#insta_gradient)"/>
          <defs>
            <linearGradient id="insta_gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#405DE6"/>
              <stop offset="30%" stopColor="#5851DB"/>
              <stop offset="60%" stopColor="#833AB4"/>
              <stop offset="90%" stopColor="#C13584"/>
              <stop offset="100%" stopColor="#E1306C"/>
            </linearGradient>
          </defs>
          <path d="M12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM17.25 6.75c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75z" fill="white"/>
          <path d="M17.25 4.5H6.75C5.51 4.5 4.5 5.51 4.5 6.75v10.5c0 1.24 1.01 2.25 2.25 2.25h10.5c1.24 0 2.25-1.01 2.25-2.25V6.75c0-1.24-1.01-2.25-2.25-2.25zm.75 12.75c0 .41-.34.75-.75.75H6.75c-.41 0-.75-.34-.75-.75V6.75c0-.41.34.75.75-.75h10.5c.41 0 .75.34.75.75v10.5z" fill="white"/>
        </svg>
      )
    }
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
                  <div className="w-6 h-6 flex-shrink-0">
                    {social.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a3c34] to-[#2d5a4b] rounded-2xl shadow-md border border-[#2d5a4b] p-6 flex flex-col items-start justify-center">
            <div className="flex items-center gap-3 mb-3">
              {/* Тут також можна поставити оригінальний логотип Telegram */}
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#26A5E4"/>
                <path d="M11.99 4.5C7.86 4.5 4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm3.55 11.07c-.15.77-.76 1.1-1.52.88l-2.82-1.05-2.82 1.05c-.14.05-.27-.03-.3-.18l-.22-1.1.67-.66 2.78-2.65-2.78-2.66-.67-.66.22-1.1c.03-.15.16-.23.3-.18l5.04 1.87 1.71-.94.87-.42c.16-.07.33.02.35.21l.06.47-.02.37-.06.41-.89 4.87 2.79-1.1c.77-.3 1.13.09 1.1.73l-.51 2.78z" fill="white"/>
                <path d="M13.46 13.88l-2.66 2.51-.53-2.24 2.48-2.26-1.63-1.54-.9-4.58 4.97 1.88 1.85-1.01.34 2.01-.91 4.9 2.65-1.04.34 1.97-.51 2.72-4.14 1.65-.02.02-.49 2.83-.53-2.26-1.72-.56 2.37-2.36z" fill="#26A5E4"/>
              </svg>
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