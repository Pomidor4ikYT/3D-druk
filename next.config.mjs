/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // для логотипів доставки
      },
      // Додайте інші хости, якщо потрібно
    ],
    // Якщо використовуєте зовнішні зображення без remotePatterns, можна вимкнути перевірку (не рекомендується)
    // unoptimized: true,
  },
  // Інші налаштування...
};

export default nextConfig;