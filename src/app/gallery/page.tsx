import { supabaseAdmin } from '@/lib/supabase/server';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getGallery() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'gallery')
    .single();
  return data?.data || [];
}

export default async function GalleryPage() {
  const images = await getGallery();
  const categories = ['Всі', ...new Set(images.map((img: any) => img.category))];

  return (
    <div className="pt-32 pb-20 container-custom">
      <h1 className="text-center mb-4 text-[#1a3c34] font-heading text-4xl font-bold">Каталог</h1>
      <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
        Результати нашої роботи — від дрібних деталей до великих макетів.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images
          .filter((img: any) => !img.hidden)
          .map((img: any, idx: number) => {
            const finalPrice = img.discount
              ? Math.round(img.price * (1 - img.discount / 100))
              : img.price;
            return (
              <div
                key={idx}
                className="relative h-72 rounded-2xl overflow-hidden shadow-lg cursor-pointer group border border-gray-200 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-full h-full relative">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading={idx < 4 ? 'eager' : 'lazy'}
                  />
                </div>

                {img.discount && img.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                    -{img.discount}%
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-heading font-bold text-lg">{img.title}</p>
                      <p className="text-[#7ec8a3] text-sm">{img.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">{finalPrice} грн</p>
                      {img.originalPrice && img.originalPrice > img.price && (
                        <p className="text-red-400 text-xs line-through">{img.originalPrice} грн</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm">
                    🛒 Купити
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-400">Фото поки немає</div>
      )}

      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm mb-4">Шукаєте більше моделей?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="https://www.printables.com/model" variant="secondary" target="_blank" rel="noopener noreferrer">
            Printables.com
          </Button>
          <Button href="https://www.thingiverse.com/search?category_id=73" variant="secondary" target="_blank" rel="noopener noreferrer">
            Thingiverse
          </Button>
        </div>
      </div>
    </div>
  );
}