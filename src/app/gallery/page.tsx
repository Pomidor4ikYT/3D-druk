import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCatalog() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'catalog')
    .single();
  return data?.data || { categories: [], products: [] };
}

export default async function GalleryPage() {
  const { categories } = await getCatalog();

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#1a3c34]">Каталог товарів</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Оберіть категорію та знайдіть ідеальний 3D-виріб
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-lg">Категорій поки немає</p>
          <p className="text-gray-400 text-sm">Загляньте пізніше</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group block"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a3c34] to-[#2d5a4b] flex items-center justify-center text-8xl text-white/30">
                    📁
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-white text-3xl font-bold group-hover:text-[#c9a84c] transition">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">{cat.description}</p>
                  )}
                  <div className="mt-3 inline-flex items-center text-[#c9a84c] text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    Переглянути товари →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Блок з посиланнями на сайти з моделями */}
      <div className="text-center mt-16">
        <p className="text-gray-700 text-lg font-bold mb-4 tracking-wide">
          Шукаєте більше моделей?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.printables.com/model"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-[#1a3c34] bg-gradient-to-r from-[#c9a84c] to-[#b89a3e] shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 transition-all duration-300 hover:scale-105"
          >
            Printables.com
          </a>
          <a
            href="https://www.thingiverse.com/search?category_id=73"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-[#1a3c34] bg-gradient-to-r from-[#c9a84c] to-[#b89a3e] shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 transition-all duration-300 hover:scale-105"
          >
            Thingiverse
          </a>
        </div>
        <p className="text-gray-400 text-xs mt-4">
          * Всі моделі на цих сайтах належать їх авторам. Ми не несемо відповідальності за контент.
        </p>
      </div>
    </div>
  );
}