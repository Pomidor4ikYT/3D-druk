import Link from 'next/link';

export default function Footer({ contacts }: { contacts?: any }) {
  const c = contacts || {
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, м. Стрий, вул. Народна, 8',
    telegram: 'https://t.me/3d_print',
    whatsapp: 'https://wa.me/380980751707',
    instagram: 'https://instagram.com/3d_print_ua',
  };

  // Іконки
  const TelegramIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#26A5E4"/>
      <path d="M11.99 4.5C7.86 4.5 4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm3.55 11.07c-.15.77-.76 1.1-1.52.88l-2.82-1.05-2.82 1.05c-.14.05-.27-.03-.3-.18l-.22-1.1.67-.66 2.78-2.65-2.78-2.66-.67-.66.22-1.1c.03-.15.16-.23.3-.18l5.04 1.87 1.71-.94.87-.42c.16-.07.33.02.35.21l.06.47-.02.37-.06.41-.89 4.87 2.79-1.1c.77-.3 1.13.09 1.1.73l-.51 2.78z" fill="white"/>
      <path d="M13.46 13.88l-2.66 2.51-.53-2.24 2.48-2.26-1.63-1.54-.9-4.58 4.97 1.88 1.85-1.01.34 2.01-.91 4.9 2.65-1.04.34 1.97-.51 2.72-4.14 1.65-.02.02-.49 2.83-.53-2.26-1.72-.56 2.37-2.36z" fill="#26A5E4"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.25.62 4.36 1.7 6.16L0 24l5.96-1.67C7.65 23.37 9.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#25D366"/>
      <path d="M12 2.5C6.76 2.5 2.5 6.76 2.5 12c0 2.1.68 4.04 1.83 5.62l-1.2 4.25 4.4-1.22c1.58.96 3.44 1.5 5.47 1.5 5.24 0 9.5-4.26 9.5-9.5S17.24 2.5 12 2.5zm4.17 13.65l-.38.38c-.65.65-1.55.98-2.45.98-1.36 0-2.7-.68-3.9-1.82l-.4-.39c-2.5-2.5-2.5-6.56 0-9.06l.38-.38c.29-.29.65-.42 1.02-.42.6 0 1.17.34 1.46.88l.76 1.44c.2.38.16.85-.1 1.2l-.51.69c-.15.2-.16.46-.02.67.47.84 1.27 1.82 2.14 2.33.21.12.46.12.66-.02l.72-.48c.35-.23.83-.27 1.2-.07l1.44.76c.54.28.88.86.88 1.46 0 .38-.14.74-.43 1.03z" fill="white"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="24" height="24" rx="4" fill="url(#insta_gradient_footer)"/>
      <defs>
        <linearGradient id="insta_gradient_footer" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#405DE6"/>
          <stop offset="30%" stopColor="#5851DB"/>
          <stop offset="60%" stopColor="#833AB4"/>
          <stop offset="90%" stopColor="#C13584"/>
          <stop offset="100%" stopColor="#E1306C"/>
        </linearGradient>
      </defs>
      <path d="M12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM17.25 6.75c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75z" fill="white"/>
      <path d="M17.25 4.5H6.75C5.51 4.5 4.5 5.51 4.5 6.75v10.5c0 1.24 1.01 2.25 2.25 2.25h10.5c1.24 0 2.25-1.01 2.25-2.25V6.75c0-1.24-1.01-2.25-2.25-2.25zm.75 12.75c0 .41-.34.75-.75.75H6.75c-.41 0-.75-.34-.75-.75V6.75c0-.41.34-.75.75-.75h10.5c.41 0 .75.34.75.75v10.5z" fill="white"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <footer className="bg-[#1a3c34] border-t border-[#c9a84c]/20 py-16 text-white">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Бренд */}
        <div>
          <Link href="/" className="text-2xl font-serif font-bold text-[#c9a84c] hover:text-[#b89a3e] transition">
            3D-друк
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed mt-2">
            Якісний 3D-друк на замовлення. Іграшки, прототипи, допомога ЗСУ.
          </p>
          <p className="text-gray-400 text-xs mt-4">© 2026 — Всі права захищені.</p>
        </div>

        {/* Навігація */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Навігація</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-gray-300 hover:text-[#7ec8a3] transition">Головна</Link></li>
            <li><Link href="/services" className="text-gray-300 hover:text-[#7ec8a3] transition">Послуги</Link></li>
            <li><Link href="/printer" className="text-gray-300 hover:text-[#7ec8a3] transition">Принтери</Link></li>
            <li><Link href="/gallery" className="text-gray-300 hover:text-[#7ec8a3] transition">Каталог</Link></li>
            <li><Link href="/contacts" className="text-gray-300 hover:text-[#7ec8a3] transition">Контакти</Link></li>
          </ul>
        </div>

        {/* Корисне */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Корисне</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/order" className="text-gray-300 hover:text-[#7ec8a3] transition">Замовити друк</Link></li>
            <li><Link href="/privacy" className="text-gray-300 hover:text-[#7ec8a3] transition">Політика конфіденційності</Link></li>
            <li><Link href="/terms" className="text-gray-300 hover:text-[#7ec8a3] transition">Умови використання</Link></li>
            <li><Link href="/#pricing" className="text-gray-300 hover:text-[#7ec8a3] transition">Доставка та оплата</Link></li>
          </ul>
        </div>

        {/* Контакти з оригінальними іконками */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Контакти</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <PhoneIcon />
                <span>{c.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${c.email}`} className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <EmailIcon />
                <span>{c.email}</span>
              </a>
            </li>
            <li>
              <a href={c.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <TelegramIcon />
                <span>Telegram: @3d_print</span>
              </a>
            </li>
            <li>
              <a href={c.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <InstagramIcon />
                <span>Instagram: @3d_print_ua</span>
              </a>
            </li>
          </ul>
          <p className="text-gray-400 text-xs mt-4">{c.address}</p>
        </div>
      </div>
    </footer>
  );
}