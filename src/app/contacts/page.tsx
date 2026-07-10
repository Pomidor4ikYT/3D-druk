'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function ContactsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const contacts = [
    { 
      icon: '📞', 
      label: 'Телефон / WhatsApp', 
      value: '+38 098 0751707', 
      href: 'tel:+380980751707' 
    },
    { 
      icon: '✉️', 
      label: 'Email', 
      value: 'komarnytskiy.yura@gmail.com', 
      href: 'mailto:komarnytskiy.yura@gmail.com' 
    },
    { 
      icon: '🕒', 
      label: 'Графік роботи', 
      value: 'Пн–Пт 9:00–18:00',
      href: null 
    },
    { 
      icon: '📍', 
      label: 'Адреса', 
      value: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
      href: null 
    },
  ];

  const socials = [
    {
      name: 'Telegram',
      href: 'https://t.me/3d_print',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/380980751707',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/3d_print_ua',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#E4405F">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">Контакти</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Зв'яжіться з нами – ми завжди на зв'язку
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Контакти – горизонтальна сітка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {contacts.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 flex items-center gap-4"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                {item.href ? (
                  <a 
                    href={item.href} 
                    className="text-gray-700 font-medium hover:text-[#1a3c34] transition break-words block"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-700 font-medium break-words">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Соціальні мережі + Telegram CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-start"
          >
            <h2 className="text-lg font-bold text-[#1a3c34] mb-4">Ми в соцмережах</h2>
            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 hover:border-[#c9a84c] hover:bg-[#f5f0eb] transition-all duration-200"
                >
                  {social.icon}
                  <span className="text-sm font-medium text-gray-700">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-[#1a3c34] to-[#2d5a4b] rounded-2xl shadow-md border border-[#2d5a4b] p-6 flex flex-col items-start justify-center"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="text-white font-bold text-lg">Telegram</span>
            </div>
            <p className="text-white/80 text-sm mb-4">Напишіть нам у Telegram – відповімо протягом 12 годин</p>
            <Button href="https://t.me/3d_print" variant="primary" className="bg-[#c9a84c] text-[#1a3c34] hover:bg-[#b89a3e]">
              Написати в Telegram
            </Button>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white"
        >
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
              <span>82400, Львівська обл., м. Стрий, вул. Народна, 8</span>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=82400+Львівська+обл.+Стрий+вул.+Народна+8"
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
        </motion.div>
      </div>
    </div>
  );
}